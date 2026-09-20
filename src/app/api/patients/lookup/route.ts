import { NextResponse } from 'next/server';
import { findPatientByAadhaarOrMobile, logPatientAccess } from '@/lib/mockDatabase';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, accessMode, doctorCredentials, otp } = body as {
      query: string;
      accessMode: 'BREAK_GLASS' | 'OTP' | 'PATIENT_DIRECT';
      doctorCredentials?: {
        name: string;
        licenseNumber: string;
        hospital: string;
        emergencyReason: string;
      };
      otp?: string;
    };

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Aadhaar, Mobile Number, or MediSync ID is required.' },
        { status: 400 }
      );
    }

    const patient = findPatientByAadhaarOrMobile(query);

    if (!patient) {
      return NextResponse.json(
        { error: 'No patient record found matching the provided Aadhaar / Mobile number.' },
        { status: 404 }
      );
    }

    // Handle Break-Glass emergency override
    if (accessMode === 'BREAK_GLASS') {
      if (!doctorCredentials?.licenseNumber || !doctorCredentials?.hospital) {
        return NextResponse.json(
          { error: 'Medical license number and hospital location are mandatory for emergency break-glass override.' },
          { status: 400 }
        );
      }

      logPatientAccess(patient.id, {
        accessorName: doctorCredentials.name || 'Emergency Attending Physician',
        accessorRole: 'EMERGENCY_DOCTOR',
        hospitalOrLocation: doctorCredentials.hospital,
        licenseNumber: doctorCredentials.licenseNumber,
        accessType: 'BREAK_GLASS_OVERRIDE',
        reason: doctorCredentials.emergencyReason || 'Critical emergency resuscitation triage',
      });

      return NextResponse.json({
        success: true,
        patient,
        accessType: 'BREAK_GLASS_OVERRIDE',
        message: 'Emergency Break-Glass access granted. Access logged in audit trail and SMS alert dispatched to registered next-of-kin.',
      });
    }

    // Handle standard OTP verification
    if (accessMode === 'OTP') {
      // In demo/kiosk mode, '123456' or any 6-digit number is accepted
      if (!otp || otp.length < 4) {
        return NextResponse.json(
          { error: 'Please enter a valid OTP sent to registered mobile number.' },
          { status: 400 }
        );
      }

      logPatientAccess(patient.id, {
        accessorName: patient.fullName,
        accessorRole: 'PATIENT',
        hospitalOrLocation: 'Patient Self-Service Portal',
        accessType: 'VERIFIED_OTP',
        reason: 'Standard authorized medical profile access',
      });

      return NextResponse.json({
        success: true,
        patient,
        accessType: 'VERIFIED_OTP',
      });
    }

    // Patient direct access
    return NextResponse.json({
      success: true,
      patient,
      accessType: 'PATIENT_LOGIN',
    });
  } catch (error: unknown) {
    const e = error as Error;
    console.error('Error in /api/patients/lookup:', e);
    return NextResponse.json(
      { error: e.message || 'Server error looking up patient record.' },
      { status: 500 }
    );
  }
}
