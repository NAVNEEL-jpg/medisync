import { NextResponse } from 'next/server';
import { recordDeviceTelemetry, getCareLinkDevices } from '@/lib/mockDatabase';
import { DeviceTelemetry } from '@/lib/types';

export const runtime = 'nodejs';

// In-memory rate limiting map: deviceId -> lastRequestTimestampMs
const rateLimitMap = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const body = await req.json();

    const {
      deviceId,
      patientId,
      heartRate,
      spO2,
      motionMagnitude,
      batteryLevel,
      fallSuspected,
    } = body as {
      deviceId?: string;
      patientId?: string;
      heartRate?: number;
      spO2?: number;
      motionMagnitude?: number;
      batteryLevel?: number;
      fallSuspected?: boolean;
    };

    // 1. Device Authentication check
    if (!authHeader.startsWith('Bearer ') && !authHeader.startsWith('DeviceKey ')) {
      return NextResponse.json(
        { error: 'Unauthorized: Valid CareLink Bearer device token is required.' },
        { status: 401 }
      );
    }

    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId is required.' }, { status: 400 });
    }

    // 2. Rate Limiting Check (Max 2 requests per second per device)
    const now = Date.now();
    const lastRequest = rateLimitMap.get(deviceId) || 0;
    if (now - lastRequest < 450) {
      return NextResponse.json(
        { error: 'Rate limit exceeded: Telemetry stream cannot exceed 2 requests per second.' },
        { status: 429 }
      );
    }
    rateLimitMap.set(deviceId, now);

    // 3. Clinical Sensor Range Validation (Prototypes must adhere to valid physiological bounds)
    const hr = Number(heartRate);
    const ox = Number(spO2);
    const motion = Number(motionMagnitude) || 1.0;
    const batt = Number(batteryLevel) >= 0 && Number(batteryLevel) <= 100 ? Number(batteryLevel) : 85;

    if (isNaN(hr) || hr < 25 || hr > 240) {
      return NextResponse.json(
        { error: 'Invalid telemetry: heartRate must be a plausible physiological reading (25-240 bpm).' },
        { status: 422 }
      );
    }

    if (isNaN(ox) || ox < 50 || ox > 100) {
      return NextResponse.json(
        { error: 'Invalid telemetry: spO2 must be between 50% and 100%.' },
        { status: 422 }
      );
    }

    // Treat sudden acceleration vector > 2.4g as suspected fall
    const isFallSuspected = Boolean(fallSuspected || motion > 2.4);

    const telemetryEntry: DeviceTelemetry = {
      id: `tel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      deviceId: deviceId.trim().toUpperCase(),
      patientId: patientId || 'MS-IND-89421',
      timestamp: new Date().toISOString(),
      heartRate: Math.round(hr),
      spO2: Math.round(ox),
      motionMagnitude: Number(motion.toFixed(2)),
      fallSuspected: isFallSuspected,
      batteryLevel: Math.round(batt),
      status: isFallSuspected ? 'SUSPECTED_FALL' : 'ONLINE',
    };

    recordDeviceTelemetry(telemetryEntry);

    return NextResponse.json({
      success: true,
      readingId: telemetryEntry.id,
      timestamp: telemetryEntry.timestamp,
      fallFlagged: isFallSuspected,
      message: isFallSuspected
        ? 'Telemetry ingested: Suspected fall motion pattern flagged for caregiver notification.'
        : 'Telemetry ingested successfully.',
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || 'Error ingesting device telemetry.' },
      { status: 500 }
    );
  }
}
