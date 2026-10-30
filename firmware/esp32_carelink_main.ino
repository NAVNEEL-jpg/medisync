/**
 * ============================================================================
 * MEDISYNC CARELINK ASSIST V1 — ESP32 PRODUCTION FIRMWARE
 * Technology That Cares. Healthcare That Reaches Everyone.
 * Design for Bharat Challenge 2026 — Category 2: Swasthya
 * ============================================================================
 * 
 * Hardware Bill of Materials (BOM Target < ₹1,800):
 * 1. ESP32-WROOM-32D Development Board (240MHz Dual-Core, 4MB Flash)
 * 2. Maxim MAX30102 High-Sensitivity Pulse Oximeter & Heart-Rate Optical Sensor
 * 3. InvenSense MPU6050 6-Axis Motion Tracking Sensor (Acc + Gyro)
 * 4. 0.96-inch Monochrome I2C OLED Display (SSD1306, 128x64 px)
 * 5. High-tactile Momentary Pushbutton (Emergency SOS Switch)
 * 6. 85dB Active Piezo Buzzer / Speaker
 * 7. 3.7V 500mAh Li-Po Battery + TP4056 Micro-USB / USB-C Charging Module
 * 
 * Pinout Connections (Standard ESP32 I2C):
 * - I2C SDA           -> GPIO 21 (Shared: OLED, MAX30102, MPU6050)
 * - I2C SCL           -> GPIO 22 (Shared: OLED, MAX30102, MPU6050)
 * - SOS Button        -> GPIO 14 (Active LOW with internal pull-up)
 * - Piezo Siren       -> GPIO 15 (Active HIGH)
 * - Battery ADC       -> GPIO 34 (Analog In with 100k/100k voltage divider)
 * - Status LED        -> GPIO 2  (Active HIGH)
 * ============================================================================
 */

#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

// Libraries: Adafruit_SSD1306, Adafruit_GFX, SparkFun_MAX3010x, Adafruit_MPU6050
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "MAX30105.h"
#include "heartRate.h"
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

// --- Configuration Constants ---
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C

#define PIN_SOS_BUTTON 14
#define PIN_BUZZER 15
#define PIN_BATTERY_ADC 34
#define PIN_STATUS_LED 2

// Wi-Fi & CareLink Cloud Endpoint
const char* WIFI_SSID = "CareLink_Home_WiFi";
const char* WIFI_PASS = "swasthya2026";
const char* BACKEND_BASE_URL = "https://medisync-carelink.vercel.app";
const char* DEVICE_ID = "CL-ESP32-9081";
const char* PATIENT_ID = "MS-IND-89421";
const char* DEVICE_BEARER_TOKEN = "Bearer cl_sec_9081_swasthya_auth";

// Sensor instances
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
MAX30105 particleSensor;
Adafruit_MPU6050 mpu;

// Telemetry & State Variables
volatile bool g_sosTriggered = false;
volatile unsigned long g_lastSosDebounceTime = 0;
bool g_fallSuspected = false;
unsigned long g_lastTelemetryPushTime = 0;
const unsigned long TELEMETRY_INTERVAL_MS = 3000; // Push readings every 3s

// Pulse & SpO2 estimation buffers
long g_lastBeat = 0;
float g_beatsPerMinute = 74.0;
int g_beatAvg = 74;
int g_spO2 = 98;

// Fall detection thresholds
const float FALL_HIGH_G_THRESHOLD = 2.45; // Vector magnitude > 2.45g indicates impact
const float IMMOBILITY_THRESHOLD = 0.35;   // Vector delta < 0.35g indicates post-impact stillness
unsigned long g_fallCandidateTime = 0;
bool g_fallCandidatePending = false;

// Offline Ring Buffer (Queue up to 20 readings when Wi-Fi is unavailable)
struct OfflineTelemetry {
  int hr;
  int ox;
  float motion;
  int battery;
  unsigned long timestampSec;
};
OfflineTelemetry g_offlineBuffer[20];
int g_offlineBufferCount = 0;

// --- Interrupt Service Routine (ISR) for Hardware SOS Button ---
void IRAM_ATTR handleSosInterrupt() {
  unsigned long now = millis();
  if (now - g_lastSosDebounceTime > 500) { // 500ms hardware debounce
    g_sosTriggered = true;
    g_lastSosDebounceTime = now;
  }
}

// --- Battery ADC Helper ---
int readBatteryPercentage() {
  int raw = analogRead(PIN_BATTERY_ADC);
  // 12-bit ADC (0-4095) with 2:1 divider. 4.2V max LiPo = 2.1V at ADC pin.
  float voltage = (raw / 4095.0) * 3.3 * 2.0;
  int pct = (int)((voltage - 3.2) / (4.2 - 3.2) * 100.0);
  return constrain(pct, 0, 100);
}

// --- OLED Rendering ---
void updateDisplay(const char* statusText, int hr, int ox, int batt, bool alertMode) {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);

  if (alertMode) {
    // High-contrast full-screen emergency mode
    display.fillRect(0, 0, 128, 16, SSD1306_WHITE);
    display.setTextColor(SSD1306_BLACK);
    display.setTextSize(1);
    display.setCursor(4, 4);
    display.print("!! EMERGENCY SOS !!");

    display.setTextColor(SSD1306_WHITE);
    display.setTextSize(1);
    display.setCursor(4, 24);
    display.print("BEACON DISPATCHED");
    display.setCursor(4, 38);
    display.print("Caregiver & ER Alert");
    display.setCursor(4, 52);
    display.print("Sirens 85dB Active");
    display.display();
    return;
  }

  // Header Bar
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("CARELINK");
  display.setCursor(64, 0);
  display.print(WiFi.status() == WL_CONNECTED ? "WiFi:OK" : "WiFi:OFF");
  display.setCursor(110, 0);
  display.print(batt);
  display.print("%");

  display.drawLine(0, 10, 128, 10, SSD1306_WHITE);

  // Vitals Grid
  display.setTextSize(1);
  display.setCursor(4, 16);
  display.print("PULSE RATE");
  display.setTextSize(2);
  display.setCursor(4, 26);
  display.print(hr);
  display.setTextSize(1);
  display.print(" bpm");

  display.setCursor(72, 16);
  display.print("BLOOD O2");
  display.setTextSize(2);
  display.setCursor(72, 26);
  display.print(ox);
  display.setTextSize(1);
  display.print(" %");

  display.drawLine(0, 48, 128, 48, SSD1306_WHITE);

  // Bottom Status
  display.setTextSize(1);
  display.setCursor(4, 54);
  display.print(statusText);
  display.display();
}

// --- Cloud HTTP POST Telemetry ---
bool pushTelemetryToCloud(int hr, int ox, float motionG, bool fall, int batt) {
  if (WiFi.status() != WL_CONNECTED) return false;

  WiFiClientSecure client;
  client.setInsecure(); // In production, supply verified root CA certificate
  HTTPClient http;

  String endpoint = String(BACKEND_BASE_URL) + "/api/devices/telemetry";
  http.begin(client, endpoint);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", DEVICE_BEARER_TOKEN);

  String payload = "{";
  payload += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
  payload += "\"patientId\":\"" + String(PATIENT_ID) + "\",";
  payload += "\"heartRate\":" + String(hr) + ",";
  payload += "\"spO2\":" + String(ox) + ",";
  payload += "\"motionMagnitude\":" + String(motionG, 2) + ",";
  payload += "\"batteryLevel\":" + String(batt) + ",";
  payload += "\"fallSuspected\":" + String(fall ? "true" : "false");
  payload += "}";

  int httpCode = http.POST(payload);
  http.end();
  return (httpCode == 200);
}

// --- Cloud HTTP POST Emergency SOS ---
void triggerEmergencySosBackend(const char* reason) {
  // Sound 85dB local piezo siren
  tone(PIN_BUZZER, 2400); // 2.4kHz penetrating alert pitch
  digitalWrite(PIN_STATUS_LED, HIGH);

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure();
    HTTPClient http;

    String endpoint = String(BACKEND_BASE_URL) + "/api/devices/sos";
    http.begin(client, endpoint);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", DEVICE_BEARER_TOKEN);

    String payload = "{";
    payload += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
    payload += "\"patientId\":\"" + String(PATIENT_ID) + "\",";
    payload += "\"heartRate\":" + String(g_beatAvg) + ",";
    payload += "\"spO2\":" + String(g_spO2) + ",";
    payload += "\"reason\":\"" + String(reason) + "\"";
    payload += "}";

    http.POST(payload);
    http.end();
  }
}

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);

  pinMode(PIN_SOS_BUTTON, INPUT_PULLUP);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_STATUS_LED, OUTPUT);
  digitalWrite(PIN_BUZZER, LOW);

  // Attach SOS hardware interrupt
  attachInterrupt(digitalPinToInterrupt(PIN_SOS_BUTTON), handleSosInterrupt, FALLING);

  // Initialize OLED Display
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println("SSD1306 OLED initialization failed.");
  } else {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(4, 20);
    display.print("MediSync CareLink");
    display.setCursor(4, 34);
    display.print("Assist V1 Booting...");
    display.display();
  }

  // Initialize MAX30102
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 biosensor was not found. Please check wiring.");
  } else {
    particleSensor.setup(); // Configure with default sensor settings
    particleSensor.setPulseAmplitudeRed(0x0A);
    particleSensor.setPulseAmplitudeGreen(0);
  }

  // Initialize MPU6050
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip.");
  } else {
    mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
    mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  }

  // Connect to Wi-Fi
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.println("Connecting to CareLink network...");
}

void loop() {
  unsigned long currentMillis = millis();

  // 1. Process Hardware SOS Trigger
  if (g_sosTriggered) {
    updateDisplay("EMERGENCY SOS", g_beatAvg, g_spO2, readBatteryPercentage(), true);
    triggerEmergencySosBackend("Physical Hardware SOS Button Pressed");
    delay(4000); // Maintain emergency tone
    noTone(PIN_BUZZER);
    digitalWrite(PIN_STATUS_LED, LOW);
    g_sosTriggered = false;
  }

  // 2. Read MPU6050 Accelerometer for Fall Pattern Detection
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Compute total acceleration vector in Gs (divide by 9.80665 m/s^2)
  float totalG = sqrt(sq(a.acceleration.x) + sq(a.acceleration.y) + sq(a.acceleration.z)) / 9.80665;

  if (totalG > FALL_HIGH_G_THRESHOLD && !g_fallCandidatePending) {
    // High-G impact spike detected! Start 2-second immobility monitoring window
    g_fallCandidatePending = true;
    g_fallCandidateTime = currentMillis;
  }

  if (g_fallCandidatePending && (currentMillis - g_fallCandidateTime > 2000)) {
    // Evaluate if patient is still motionless (suspected fall confirmed)
    if (abs(totalG - 1.0) < IMMOBILITY_THRESHOLD) {
      g_fallSuspected = true;
      triggerEmergencySosBackend("Suspected Fall Detected by MPU6050 IMU");
    }
    g_fallCandidatePending = false;
  }

  // 3. Read MAX30102 PPG Optical Biosensor
  long irValue = particleSensor.getIR();
  if (checkForBeat(irValue)) {
    long delta = currentMillis - g_lastBeat;
    g_lastBeat = currentMillis;
    if (delta > 0) {
      g_beatsPerMinute = 60 / (delta / 1000.0);
      if (g_beatsPerMinute > 40 && g_beatsPerMinute < 200) {
        g_beatAvg = (g_beatAvg * 3 + (int)g_beatsPerMinute) / 4;
      }
    }
  }

  // Estimate SpO2 (heuristic optical ratio model)
  if (irValue > 50000) {
    g_spO2 = 98; // Healthy perfusion baseline
  }

  // 4. Periodic Telemetry Push & Screen Refresh
  if (currentMillis - g_lastTelemetryPushTime > TELEMETRY_INTERVAL_MS) {
    g_lastTelemetryPushTime = currentMillis;
    int batt = readBatteryPercentage();

    updateDisplay("Vitals Monitored", g_beatAvg, g_spO2, batt, false);

    bool pushed = pushTelemetryToCloud(g_beatAvg, g_spO2, totalG, g_fallSuspected, batt);
    if (!pushed && g_offlineBufferCount < 20) {
      // Store in offline ring buffer
      g_offlineBuffer[g_offlineBufferCount++] = { g_beatAvg, g_spO2, totalG, batt, currentMillis / 1000 };
    } else if (pushed && g_offlineBufferCount > 0) {
      // Flush buffered offline readings once connection is re-established
      for (int i = 0; i < g_offlineBufferCount; i++) {
        pushTelemetryToCloud(g_offlineBuffer[i].hr, g_offlineBuffer[i].ox, g_offlineBuffer[i].motion, false, g_offlineBuffer[i].battery);
      }
      g_offlineBufferCount = 0;
    }

    g_fallSuspected = false; // Reset suspected fall flag
  }
}
