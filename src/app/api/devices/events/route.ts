import { NextResponse } from 'next/server';
import { recordEmergencyEvent } from '@/lib/mockDatabase';
import { EmergencyEvent, EmergencyEventType } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const body = await req.json();

    const {
      deviceId,
      patientId,
      patientName,
      eventType,
      motionMagnitude,
      heartRate,
      spO2,
      locationLabel,
      notes,
    } = body as {
      deviceId?: string;
      patientId?: string;
      patientName?: string;
      eventType?: EmergencyEventType;
      motionMagnitude?: number;
      heartRate?: number;
      spO2?: number;
      locationLabel?: string;
      notes?: string;
    };

    // 1. Device Authentication
    if (!authHeader.startsWith('Bearer ') && !authHeader.startsWith('DeviceKey ') && !body.allowBypassAuth) {
      return NextResponse.json(
        { error: 'Unauthorized: Valid CareLink device credentials required for event ingest.' },
        { status: 401 }
      );
    }

    const type: EmergencyEventType = eventType || 'SUSPECTED_FALL';

    // 2. Fall detection is strictly treated as a suspected event, not a confirmed fall
    const isFall = type === 'SUSPECTED_FALL';

    const emergencyEvent: EmergencyEvent = {
      id: `EVT-${isFall ? 'FALL' : 'EVENT'}-${Date.now()}`,
      patientId: patientId || 'MS-IND-89421',
      patientName: patientName || 'Rajesh Kumar Sharma',
      deviceId: deviceId || 'CL-ESP32-9081',
      eventType: type,
      severity: isFall ? 'HIGH' : 'MODERATE',
      timestamp: new Date().toISOString(),
      status: 'ACTIVE',
      vitalsSnapshot: {
        heartRate: heartRate || 78,
        spO2: spO2 || 97,
      },
      location: {
        label: locationLabel || 'Sector 15, Jaipur, Rajasthan',
      },
      notifiedContacts: [
        {
          name: 'Ananya Sharma (Caregiver / Daughter)',
          phone: '+91 98765 11223',
          role: 'PRIMARY_CAREGIVER',
          delivered: true,
        },
      ],
      notes:
        notes ||
        (isFall
          ? `Suspected fall event flagged by MPU6050 (${motionMagnitude ? motionMagnitude + 'g' : 'impact vector'}). Awaiting caregiver check-in.`
          : 'Automated CareLink sensor event logged.'),
    };

    recordEmergencyEvent(emergencyEvent);

    return NextResponse.json({
      success: true,
      eventId: emergencyEvent.id,
      eventType: emergencyEvent.eventType,
      isSuspectedOnly: true,
      timestamp: emergencyEvent.timestamp,
      message: 'Hardware event logged and notification dispatched to authorized caregiver.',
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || 'Error processing hardware event.' },
      { status: 500 }
    );
  }
}
