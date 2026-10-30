import { NextResponse } from 'next/server';
import { saveCareLinkDevice, getCareLinkDevices } from '@/lib/mockDatabase';
import { CareLinkDevice } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deviceId, patientId, macAddress, hardwareSecret, firmwareVersion, pairedBy } = body as {
      deviceId?: string;
      patientId?: string;
      macAddress?: string;
      hardwareSecret?: string;
      firmwareVersion?: string;
      pairedBy?: string;
    };

    // 1. Validate mandatory fields
    if (!deviceId || !patientId || !hardwareSecret) {
      return NextResponse.json(
        { error: 'Missing mandatory registration fields: deviceId, patientId, and hardwareSecret are required.' },
        { status: 400 }
      );
    }

    // 2. Validate hardware secret complexity (must be at least 8 chars)
    if (hardwareSecret.length < 8) {
      return NextResponse.json(
        { error: 'Hardware provisioning secret is too short or insecure.' },
        { status: 401 }
      );
    }

    const cleanDeviceId = deviceId.trim().toUpperCase();
    const cleanPatientId = patientId.trim();

    // 3. Register or update device
    const registeredDevice: CareLinkDevice = {
      id: cleanDeviceId,
      patientId: cleanPatientId,
      deviceModel: 'CareLink Assist V1 (ESP32-WROOM-32)',
      macAddress: macAddress || '24:6F:28:B4:9A:12',
      firmwareVersion: firmwareVersion || 'v2.4.1-swasthya',
      batteryLevel: 95,
      isCharging: false,
      status: 'ONLINE',
      lastHeartbeat: new Date().toISOString(),
      registeredAt: new Date().toISOString(),
      pairedBy: pairedBy || 'Authorized Caregiver / Patient',
      hardwareSpecs: {
        mcu: 'Espressif ESP32 dual-core 240MHz',
        pulseOximeter: 'Maxim MAX30102 High-Sensitivity PPG',
        motionSensor: 'InvenSense MPU6050 6-Axis IMU (Acc+Gyro)',
        display: '0.96" SSD1306 OLED (128x64 px I2C)',
        hasPhysicalSos: true,
        hasBuzzer: true,
      },
    };

    saveCareLinkDevice(registeredDevice);

    // 4. Issue device bearer token (mock token formatted for ESP32 storage)
    const deviceToken = `cl_token_${cleanDeviceId.toLowerCase()}_${Buffer.from(cleanDeviceId + ':' + Date.now()).toString('base64url').slice(0, 16)}`;

    return NextResponse.json({
      success: true,
      message: 'CareLink device registered successfully.',
      device: registeredDevice,
      token: deviceToken,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || 'Error processing device registration.' },
      { status: 500 }
    );
  }
}
