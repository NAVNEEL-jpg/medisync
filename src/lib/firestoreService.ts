import { db, isFirebaseConfigured } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { PatientProfile, AccessAuditLog } from './types';
import {
  findPatientByAadhaarOrMobile as findMockPatient,
  updatePatientProfile as updateMockPatient,
  logPatientAccess as logMockAccess,
  INITIAL_PATIENTS,
  normalizeQuery,
} from './mockDatabase';

const PATIENTS_COLLECTION = 'patients';
const AUDIT_LOGS_COLLECTION = 'audit_logs';

export async function getPatientRecord(searchQuery: string): Promise<PatientProfile | null> {
  const clean = normalizeQuery(searchQuery);

  if (isFirebaseConfigured && db) {
    try {
      // Check by Aadhaar
      const qAadhaar = query(
        collection(db, PATIENTS_COLLECTION),
        where('aadhaarNumber', '==', clean)
      );
      const snapAadhaar = await getDocs(qAadhaar);
      if (!snapAadhaar.empty) {
        return snapAadhaar.docs[0].data() as PatientProfile;
      }

      // Check by Mobile
      const qMobile = query(
        collection(db, PATIENTS_COLLECTION),
        where('mobileNumber', '==', clean)
      );
      const snapMobile = await getDocs(qMobile);
      if (!snapMobile.empty) {
        return snapMobile.docs[0].data() as PatientProfile;
      }

      // Check by ID
      const docRef = doc(db, PATIENTS_COLLECTION, searchQuery.trim());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as PatientProfile;
      }
    } catch (err) {
      console.warn('Firestore fetch failed, checking local store:', err);
    }
  }

  // Fallback to in-memory / local mock database
  return findMockPatient(searchQuery) || null;
}

export async function savePatientRecord(patient: PatientProfile): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, PATIENTS_COLLECTION, patient.id);
      await setDoc(docRef, patient, { merge: true });
      return true;
    } catch (err) {
      console.error('Error saving patient to Firestore:', err);
    }
  }

  // Local fallback
  return updateMockPatient(patient);
}

export async function logAuditAccessRecord(
  patientId: string,
  log: Omit<AccessAuditLog, 'id' | 'timestamp'>
): Promise<AccessAuditLog> {
  const newLog: AccessAuditLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...log,
  };

  if (isFirebaseConfigured && db) {
    try {
      const logRef = doc(db, AUDIT_LOGS_COLLECTION, newLog.id);
      await setDoc(logRef, { ...newLog, patientId });
    } catch (err) {
      console.warn('Error writing audit log to Firestore:', err);
    }
  }

  // Local fallback
  logMockAccess(patientId, log);
  return newLog;
}
