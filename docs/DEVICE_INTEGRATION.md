# MediSync CareLink — Device Integration Guide

**Device Model:** CareLink Assist V1 (ESP32-WROOM-32D)  
**Target Environment:** Arduino IDE 2.x / PlatformIO / ESP-IDF

---

## 1. Hardware Circuit Wiring Diagram

All sensors communicate over the shared I2C bus using standard 3.3V logic levels.

```
ESP32-WROOM-32 Pinout Connections:

+----------------+---------------------+-----------------------------------------+
| ESP32 Pin      | Sensor Pin          | Description / Function                  |
+----------------+---------------------+-----------------------------------------+
| 3V3            | VCC (All Sensors)   | Regulated 3.3V DC Power Rail            |
| GND            | GND (All Sensors)   | Common Ground                           |
| GPIO 21        | SDA                 | I2C Data Line (OLED, MAX30102, MPU6050) |
| GPIO 22        | SCL                 | I2C Clock Line (OLED, MAX30102, MPU6050)|
| GPIO 14        | SOS Button Terminal | Hardware Interrupt (Active LOW Pullup)  |
| GPIO 15        | Buzzer (+)          | 85dB Piezo Siren Output (PWM)           |
| GPIO 34        | Voltage Divider Mid | Battery Level Monitoring (ADC 0-3.3V)   |
| GPIO 2         | Built-in LED        | Status Indicator                        |
+----------------+---------------------+-----------------------------------------+
```

### I2C Bus Address Map
- `0x3C`: 0.96" SSD1306 Monochrome OLED Screen
- `0x57`: Maxim MAX30102 Optical Biosensor
- `0x68`: InvenSense MPU6050 6-Axis Motion Sensor

---

## 2. Arduino IDE Setup Instructions

1. **Install ESP32 Board Core:**
   - In Arduino IDE, open **File → Preferences**.
   - Add the following to *Additional Boards Manager URLs*:
     `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Open **Tools → Board → Boards Manager**, search for `esp32`, and install version `2.0.14` or higher.

2. **Install Required Libraries:**
   Open **Sketch → Include Library → Manage Libraries...** and install:
   - `Adafruit SSD1306` (by Adafruit)
   - `Adafruit GFX Library` (by Adafruit)
   - `SparkFun MAX3010x Pulse and Proximity Sensor Library` (by SparkFun)
   - `Adafruit MPU6050` (by Adafruit)
   - `Adafruit Unified Sensor` (by Adafruit)

3. **Open Firmware Sketch:**
   - Open [`firmware/esp32_carelink_main.ino`](file:///d:/Projects/medicync/firmware/esp32_carelink_main.ino).
   - Set `WIFI_SSID` and `WIFI_PASS` to your local 2.4GHz network.
   - Set `BACKEND_BASE_URL` to your CareLink deployment address (e.g. `http://192.168.1.100:3000` or production Vercel domain).
   - Select board: **ESP32 Dev Module**.
   - Flash settings: 240MHz CPU, 80MHz Flash, QIO, 4MB (32Mb).
   - Click **Upload**.

---

## 3. Sensor Working Principles & Fall Detection Algorithm

### Optical Biosensing (MAX30102)
- Emits dual wavelengths: Red (660nm) and Infrared (880nm).
- Oxygenated hemoglobin ($HbO_2$) absorbs more infrared light; deoxygenated hemoglobin ($Hb$) absorbs more red light.
- AC and DC ratios are computed from the pulsating photoplethysmogram to calculate SpO2 percentage:
  $$R = \frac{(AC_{red} / DC_{red})}{(AC_{ir} / DC_{ir})}$$
  $$SpO_2 \approx 110 - 25 \times R$$

### Suspected Fall Detection Algorithm (MPU6050)
1. Samples the tri-axial accelerometer at 50Hz.
2. Calculates instantaneous total acceleration vector magnitude:
   $$A_{total} = \frac{\sqrt{a_x^2 + a_y^2 + a_z^2}}{g}$$
3. **Phase 1 (Impact Spike):** If $A_{total} > 2.45g$, the device flags a high-G candidate event and starts a 2-second evaluation window.
4. **Phase 2 (Post-Impact Immobility):** If during the subsequent 2 seconds the user remains essentially static ($|A_{total} - 1.0g| < 0.35g$), the device confirms a **Suspected Fall Event**.
5. **Phase 3 (Escalation):** The device sounds the local buzzer and transmits an authenticated payload to `/api/devices/events` with `eventType: "SUSPECTED_FALL"`.

> [!IMPORTANT]
> Fall detection is treated as a **suspected event**, not a definitive clinical diagnosis. The system prompts the patient to press the SOS button to cancel if uninjured, and notifies family caregivers to check in immediately.

---

## 4. Telemetry Payload Specifications

### Periodic Telemetry (`POST /api/devices/telemetry`)
```json
{
  "deviceId": "CL-ESP32-9081",
  "patientId": "MS-IND-89421",
  "heartRate": 74,
  "spO2": 98,
  "motionMagnitude": 1.02,
  "batteryLevel": 84,
  "fallSuspected": false
}
```

### Manual SOS Dispatch (`POST /api/devices/sos`)
```json
{
  "deviceId": "CL-ESP32-9081",
  "patientId": "MS-IND-89421",
  "heartRate": 88,
  "spO2": 97,
  "reason": "Physical Hardware SOS Button Pressed"
}
```
