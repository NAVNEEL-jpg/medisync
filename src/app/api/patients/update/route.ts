import { NextResponse } from 'next/server';
import { updatePatientProfile, registerCampPatient, getPatients } from '@/lib/mockDatabase';
import { PatientProfile } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, patient, campData } = body as {
      action: 'UPDATE_PROFILE' | 'CONFIRM_PERIODIC_REVIEW' | 'REGISTER_CAMP_PATIENT' | 'ADD_PRESCRIPTION';
      patient?: PatientProfile;
      campData?: Omit<PatientProfile, 'id' | 'lastProfileUpdate' | 'nextReviewDueDate' | 'accessLogs'>;
    };

    if (action === 'REGISTER_CAMP_PATIENT') {
      if (!campData || !campData.fullName || !campData.aadhaarNumber) {
        return NextResponse.json(
          { error: 'Patient name and Aadhaar number are required for camp registration.' },
          { status: 400 }
        );
      }
      const newPatient = registerCampPatient(campData);
      return NextResponse.json({
        success: true,
        patient: newPatient,
        message: 'Patient registered successfully at Offline Assistance Camp.',
      });
    }

    if (!patient || !patient.id) {
      return NextResponse.json(
        { error: 'Valid patient object is required.' },
        { status: 400 }
      );
    }

    if (action === 'CONFIRM_PERIODIC_REVIEW') {
      const now = new Date();
      const nextReview = new Date(now);
      nextReview.setMonth(nextReview.getMonth() + 4);

      const updated: PatientProfile = {
        ...patient,
        lastProfileUpdate: now.toISOString(),
        nextReviewDueDate: nextReview.toISOString(),
      };

      updatePatientProfile(updated);
      return NextResponse.json({
        success: true,
        patient: updated,
        message: 'Periodic 4-month health review confirmed. Next review scheduled for 4 months from now.',
      });
    }

    // Default UPDATE_PROFILE
    const updated = {
      ...patient,
      lastProfileUpdate: new Date().toISOString(),
    };
    const success = updatePatientProfile(updated);

    if (!success) {
      return NextResponse.json(
        { error: 'Patient not found to update.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      patient: updated,
      message: 'Medical profile updated successfully.',
    });
  } catch (error: unknown) {
    const e = error as Error;
    return NextResponse.json(
      { error: e.message || 'Error updating patient information.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    patients: getPatients(),
  });
}
