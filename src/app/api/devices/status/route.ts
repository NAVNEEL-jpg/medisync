import { NextResponse } from 'next/server';
import { getCareLinkDevices, getCareLinkDeviceForPatient, getDeviceTelemetry } from '@/lib/mockDatabase';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get('deviceId');
    const patientId = searchParams.get('patientId');

    let device;
    if (patientId) {
      device = getCareLinkDeviceForPatient(patientId);
    } else if (deviceId) {
      const devices = getCareLinkDevices();
      device = devices.find((d) => d.id.toUpperCase() === deviceId.toUpperCase());
    } else {
      const devices = getCareLinkDevices();
      device = devices[0];
    }

    if (!device) {
      return NextResponse.json(
        { error: 'CareLink device not found.' },
        { status: 404 }
      );
    }

    const telemetry = getDeviceTelemetry(device.id);
    const latestReading = telemetry[0] || null;

    return NextResponse.json({
      success: true,
      device: {
        id: device.id,
        patientId: device.patientId,
        model: device.deviceModel,
        status: device.status,
        batteryPercent: device.batteryLevel,
        isCharging: device.isCharging,
        firmware: device.firmwareVersion,
        lastHeartbeat: device.lastHeartbeat,
      },
      latestReading,
      network: {
        wifiConnected: true,
        signalStrength: '-62 dBm (Good)',
        transportSecurity: 'TLS 1.3 / HTTPS',
      },
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || 'Error fetching device status.' },
      { status: 500 }
    );
  }
}
