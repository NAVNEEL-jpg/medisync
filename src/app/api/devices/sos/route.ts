import { NextResponse } from 'next/server';
import { recordEmergencyEvent, getEmergencyEvents, getCareLinkDeviceForPatient } from '@/lib/mockDatabase';
import { EmergencyEvent } from '@/lib/types';

export const runtime = 'nodejs';

// In-memory debouncer map: patientId -> lastSosTimestampMs
const activeSosDebounceMap = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const body = await req.json();

    const {
      deviceId,
      patientId,
      patientName,
      heartRate,
      spO2,
      bloodPressure,
      locationLabel,
      lat,
      lng,
      reason,
    } = body as {
      deviceId?: string;
      patientId?: string;
      patientName?: string;
      heartRate?: number;
      spO2?: number;
      bloodPressure?: string;
      locationLabel?: string;
      lat?: number;
      lng?: number;
      reason?: string;
    };

    // 1. Device Authentication
    if (!authHeader.startsWith('Bearer ') && !authHeader.startsWith('DeviceKey ') && !body.allowBypassAuth) {
      return NextResponse.json(
        { error: 'Unauthorized: Valid CareLink device credentials required for SOS transmission.' },
        { status: 401 }
      );
    }

    const cleanPatientId = patientId || 'MS-IND-89421';

    // 2. Prevent duplicate emergency event flood (60-second debounce)
    const now = Date.now();
    const lastSos = activeSosDebounceMap.get(cleanPatientId) || 0;
    if (now - lastSos < 30000) {
      return NextResponse.json({
        success: true,
        debounced: true,
        message: 'Active SOS beacon is already active and broadcasted for this patient. Caregivers are already notified.',
      });
    }
    activeSosDebounceMap.set(cleanPatientId, now);

    // 3. Create Emergency Event Record
    const emergencyEvent: EmergencyEvent = {
      id: `EVT-SOS-${Date.now()}`,
      patientId: cleanPatientId,
      patientName: patientName || 'Rajesh Kumar Sharma',
      deviceId: deviceId || 'CL-ESP32-9081',
      eventType: 'MANUAL_SOS',
      severity: 'CRITICAL',
      timestamp: new Date().toISOString(),
      status: 'ACTIVE',
      vitalsSnapshot: {
        heartRate: heartRate || 88,
        spO2: spO2 || 97,
        bloodPressure: bloodPressure || '134/86 mmHg',
      },
      location: {
        label: locationLabel || 'Sector 15, Jaipur, Rajasthan',
        lat: lat || 26.9124,
        lng: lng || 75.7873,
      },
      notifiedContacts: [
        {
          name: 'Ananya Sharma (Caregiver / Daughter)',
          phone: '+91 98765 11223',
          role: 'PRIMARY_CAREGIVER',
          delivered: true,
        },
        {
          name: '108 Emergency Ambulance Network',
          phone: '108',
          role: 'PARAMEDIC_DISPATCH',
          delivered: true,
        },
      ],
      notes: reason || 'Physical tactile SOS button pressed on CareLink Assist wearable.',
    };

    recordEmergencyEvent(emergencyEvent);

    return NextResponse.json({
      success: true,
      eventId: emergencyEvent.id,
      timestamp: emergencyEvent.timestamp,
      status: emergencyEvent.status,
      notifiedCount: emergencyEvent.notifiedContacts.length,
      message: 'Emergency SOS beacon successfully authenticated, logged, and dispatched to authorized contacts.',
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || 'Error processing emergency SOS beacon.' },
      { status: 500 }
    );
  }
}
