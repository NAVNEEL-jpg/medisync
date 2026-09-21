'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'CAMP_WORKER';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  licenseNumber?: string;
  hospital?: string;
  aadhaarNumber?: string;
  phoneNumber?: string;
  bloodGroup?: string;
  orgType?: string;
  authProvider?: 'google' | 'password' | 'demo';
}

export interface CitizenSignUpData {
  name: string;
  aadhaarNumber: string;
  phoneNumber: string;
  email: string;
  password?: string;
  bloodGroup?: string;
}

export interface OrgSignUpData {
  orgName: string;
  licenseNumber: string;
  officerName: string;
  orgType: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isFirebaseActive: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string, role: UserRole, extra?: Record<string, string>) => Promise<void>;
  signInWithGoogle: (citizenMeta?: {
    aadhaarNumber?: string;
    phoneNumber?: string;
    bloodGroup?: string;
    name?: string;
  }) => Promise<void>;
  signUpCitizen: (data: CitizenSignUpData) => Promise<void>;
  signUpOrganisation: (data: OrgSignUpData) => Promise<void>;
  updateCitizenAadhaarAndPhone: (
    aadhaarNumber: string,
    phoneNumber: string,
    bloodGroup?: string
  ) => Promise<void>;
  logOut: () => Promise<void>;
  quickLoginAs: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, AppUser> = {
  DOCTOR: {
    uid: 'demo-doc-01',
    email: 'dr.mehra@sms.hospital.in',
    displayName: 'Dr. Vivek Mehra (ER Trauma Lead)',
    role: 'DOCTOR',
    licenseNumber: 'MCI-REG-882194',
    hospital: 'SMS Medical College & Hospital',
    phoneNumber: '+91 98290 12345',
    orgType: 'Trauma Care Hospital',
    authProvider: 'demo',
  },
  PATIENT: {
    uid: 'demo-pat-01',
    email: 'rajesh.sharma@gmail.com',
    displayName: 'Rajesh Kumar Sharma',
    role: 'PATIENT',
    aadhaarNumber: '2345 6789 0123',
    phoneNumber: '+91 98765 43210',
    bloodGroup: 'O+',
    authProvider: 'demo',
  },
  CAMP_WORKER: {
    uid: 'demo-camp-01',
    email: 'asha.sunita@health.rajasthan.gov.in',
    displayName: 'Sunita Sharma (ASHA Facilitator)',
    role: 'CAMP_WORKER',
    hospital: 'Outreach Health Camp #14, Ramgarh',
    licenseNumber: 'CAMP-ID-9941',
    phoneNumber: '+91 97841 55210',
    orgType: 'Rural Assistance Camp',
    authProvider: 'demo',
  },
};

export interface RegisteredAccount {
  uid: string;
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  aadhaarNumber?: string;
  phoneNumber?: string;
  bloodGroup?: string;
  licenseNumber?: string;
  hospital?: string;
  orgType?: string;
}

const REGISTERED_ACCOUNTS_KEY = 'medisync_registered_accounts';
export const DEMO_PASSWORDS = ['demo123', 'Demo@123', 'password123', 'MediSync@2026', 'admin123'];

export function getRegisteredAccounts(): RegisteredAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRegisteredAccount(account: RegisteredAccount) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getRegisteredAccounts();
    const filtered = existing.filter((a) => a.email.toLowerCase() !== account.email.toLowerCase());
    filtered.push(account);
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Could not persist registered account:', e);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Synchronous zero-latency session recovery from localStorage
  const [user, setUser] = useState<AppUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('medicync_auth_user');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('medicync_auth_user');
    }
    return false;
  });

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // Check local storage for quick cached session
          let cached: AppUser | null = null;
          if (typeof window !== 'undefined') {
            try {
              const saved = localStorage.getItem('medicync_auth_user');
              if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.uid === firebaseUser.uid) cached = parsed;
              }
            } catch {}
          }

          const baseUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: cached?.displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Citizen',
            role: cached?.role || 'PATIENT',
            authProvider: firebaseUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'password',
            ...(cached || {}),
          };

          // Immediately set user and finish loading for zero lag
          setUser((prev) => (prev && prev.uid === firebaseUser.uid ? prev : baseUser));
          setLoading(false);

          // Background non-blocking enrichment from Firestore
          if (db) {
            try {
              const userDocRef = doc(db, 'users', firebaseUser.uid);
              const userSnap = await Promise.race([
                getDoc(userDocRef),
                new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
              ]);

              if (userSnap && userSnap.exists()) {
                const data = userSnap.data();
                setUser((prev) => {
                  const updated: AppUser = {
                    ...(prev || baseUser),
                    role: data.role || prev?.role || 'PATIENT',
                    displayName: data.displayName || prev?.displayName || baseUser.displayName,
                    ...data,
                  };
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('medicync_auth_user', JSON.stringify(updated));
                  }
                  return updated;
                });
              }
            } catch (e) {
              console.warn('Could not fetch user document from Firestore:', e);
            }
          }
        } else {
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('medicync_auth_user');
          }
          setLoading(false);
        }
      });

      return () => unsubscribe();
    } else {
      // Local storage restore for mock session
      const saved = typeof window !== 'undefined' ? localStorage.getItem('medicync_auth_user') : null;
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const activeUser: AppUser = {
          uid: cred.user.uid,
          email: cred.user.email || email,
          displayName: cred.user.displayName || email.split('@')[0],
          role: 'PATIENT',
          authProvider: 'password',
        };
        setUser(activeUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('medicync_auth_user', JSON.stringify(activeUser));
        }

        // Background Firestore role & metadata fetch
        if (db) {
          (async () => {
            try {
              const userDocRef = doc(db, 'users', cred.user.uid);
              const userSnap = await Promise.race([
                getDoc(userDocRef),
                new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
              ]);
              if (userSnap && userSnap.exists()) {
                const data = userSnap.data();
                const updated: AppUser = {
                  ...activeUser,
                  role: data.role || 'PATIENT',
                  displayName: data.displayName || activeUser.displayName,
                  ...data,
                };
                setUser(updated);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('medicync_auth_user', JSON.stringify(updated));
                }
              }
            } catch (e) {
              console.warn('Background Firestore user sync error:', e);
            }
          })();
        }
      } catch (err: any) {
        const code = err?.code || '';
        const msg = err?.message || String(err);
        const registered = getRegisteredAccounts();
        const accountExists =
          registered.some((a) => a.email.toLowerCase() === cleanEmail) ||
          Object.values(DEMO_USERS).some((d) => d.email.toLowerCase() === cleanEmail);

        if (code === 'auth/user-not-found' || (!accountExists && (code === 'auth/invalid-credential' || msg.includes('invalid-credential')))) {
          const notFoundError = new Error(`No account exists for ${email}. Please sign up first.`);
          (notFoundError as any).code = 'auth/user-not-found';
          throw notFoundError;
        }

        const invalidCredError = new Error('Invalid email or password. Access denied.');
        (invalidCredError as any).code = 'auth/wrong-password';
        throw invalidCredError;
      }
    } else {
      // Local / Offline authentication mode
      const registered = getRegisteredAccounts();
      const localAcc = registered.find((a) => a.email.toLowerCase() === cleanEmail);
      const demoAcc = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === cleanEmail);

      // 1. Check if email exists at all
      if (!localAcc && !demoAcc) {
        const notFoundError = new Error(`No account exists for ${email}. Please sign up first.`);
        (notFoundError as any).code = 'auth/user-not-found';
        throw notFoundError;
      }

      // 2. Email exists -> Verify password
      let isPasswordCorrect = false;
      let appUser: AppUser;

      if (localAcc) {
        isPasswordCorrect = localAcc.password === cleanPass;
        appUser = {
          uid: localAcc.uid,
          email: localAcc.email,
          displayName: localAcc.displayName,
          role: localAcc.role,
          aadhaarNumber: localAcc.aadhaarNumber,
          phoneNumber: localAcc.phoneNumber,
          bloodGroup: localAcc.bloodGroup,
          licenseNumber: localAcc.licenseNumber,
          hospital: localAcc.hospital,
          orgType: localAcc.orgType,
          authProvider: 'password',
        };
      } else {
        // demoAcc
        isPasswordCorrect = DEMO_PASSWORDS.includes(cleanPass);
        appUser = { ...demoAcc!, authProvider: 'password' };
      }

      if (!isPasswordCorrect) {
        const invalidCredError = new Error('Invalid email or password. Access denied.');
        (invalidCredError as any).code = 'auth/wrong-password';
        throw invalidCredError;
      }

      // Password matches -> Set user session
      setUser(appUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('medicync_auth_user', JSON.stringify(appUser));
      }
    }
  };

  const signInWithGoogle = async (citizenMeta?: {
    aadhaarNumber?: string;
    phoneNumber?: string;
    bloodGroup?: string;
    name?: string;
  }) => {
    if (isFirebaseConfigured && auth && googleProvider) {
      // Real Google Sign-In with Firebase popup
      const result = await signInWithPopup(auth, googleProvider);
      const gUser = result.user;

      // Construct immediate active user so dashboard opens immediately upon successful authentication
      const activeUser: AppUser = {
        uid: gUser.uid,
        email: gUser.email || '',
        displayName: citizenMeta?.name || gUser.displayName || 'Google User',
        role: 'PATIENT',
        authProvider: 'google',
        aadhaarNumber: citizenMeta?.aadhaarNumber || '',
        phoneNumber: citizenMeta?.phoneNumber || '',
        bloodGroup: citizenMeta?.bloodGroup || 'O+',
      };

      // Set user immediately
      setUser(activeUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('medicync_auth_user', JSON.stringify(activeUser));
      }

      // Perform Firestore synchronization non-blockingly in the background
      if (db) {
        (async () => {
          try {
            const userDocRef = doc(db, 'users', gUser.uid);
            const snap = await Promise.race([
              getDoc(userDocRef),
              new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
            ]);

            if (snap && snap.exists()) {
              const extraData = snap.data();
              const mergedUser: AppUser = {
                ...activeUser,
                role: extraData.role || 'PATIENT',
                ...extraData,
                ...(citizenMeta?.aadhaarNumber ? { aadhaarNumber: citizenMeta.aadhaarNumber } : {}),
                ...(citizenMeta?.phoneNumber ? { phoneNumber: citizenMeta.phoneNumber } : {}),
                ...(citizenMeta?.bloodGroup ? { bloodGroup: citizenMeta.bloodGroup } : {}),
              };
              setUser(mergedUser);
              if (typeof window !== 'undefined') {
                localStorage.setItem('medicync_auth_user', JSON.stringify(mergedUser));
              }

              if (citizenMeta?.aadhaarNumber || citizenMeta?.phoneNumber) {
                const updates: Record<string, any> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
                if (citizenMeta.aadhaarNumber) updates.aadhaarNumber = citizenMeta.aadhaarNumber;
                if (citizenMeta.phoneNumber) updates.phoneNumber = citizenMeta.phoneNumber;
                if (citizenMeta.bloodGroup) updates.bloodGroup = citizenMeta.bloodGroup;
                setDoc(userDocRef, updates, { merge: true }).catch(() => {});
              }
            } else if (snap && !snap.exists()) {
              // Initial user creation
              setDoc(userDocRef, activeUser).catch(() => {});
            }

            // Seed patient profile with Aadhaar in background
            if (citizenMeta?.aadhaarNumber || citizenMeta?.phoneNumber) {
              const patientDocRef = doc(db, 'patients', gUser.uid);
              setDoc(
                patientDocRef,
                {
                  id: `#NDHN-${gUser.uid.slice(0, 6).toUpperCase()}`,
                  fullName: citizenMeta?.name || gUser.displayName || 'Verified Citizen',
                  aadhaarNumber: citizenMeta?.aadhaarNumber || '',
                  mobileNumber: citizenMeta?.phoneNumber || '',
                  bloodGroup: citizenMeta?.bloodGroup || 'O+',
                  existingConditions: [],
                  allergies: [],
                  prescriptions: [],
                  vitals: { heartRate: 72, bloodPressure: '120/80', spO2: 98, temperature: 98.6 },
                  lastProfileUpdate: new Date().toISOString().slice(0, 10),
                  nextReviewDueDate: new Date(Date.now() + 120 * 24 * 3600 * 1000).toISOString().slice(0, 10),
                },
                { merge: true }
              ).catch(() => {});
            }
          } catch (err) {
            console.warn('Background Firestore sync on Google sign-in:', err);
          }
        })();
      }
    } else {
      // Offline fallback only when Firebase is completely unconfigured in environment
      const mockGoogleUser: AppUser = {
        uid: `google-${Date.now()}`,
        email: citizenMeta?.name
          ? `${citizenMeta.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`
          : 'user.citizen@gmail.com',
        displayName: citizenMeta?.name || 'Google Verified Citizen',
        role: 'PATIENT',
        aadhaarNumber: citizenMeta?.aadhaarNumber || '2345 6789 0123',
        phoneNumber: citizenMeta?.phoneNumber || '+91 98765 43210',
        bloodGroup: citizenMeta?.bloodGroup || 'O+',
        authProvider: 'google',
      };
      setUser(mockGoogleUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('medicync_auth_user', JSON.stringify(mockGoogleUser));
      }
    }
  };

  const updateCitizenAadhaarAndPhone = async (
    aadhaarNumber: string,
    phoneNumber: string,
    bloodGroup = 'O+'
  ) => {
    if (!user) return;
    const updated: AppUser = {
      ...user,
      aadhaarNumber,
      phoneNumber,
      bloodGroup,
    };

    setUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('medicync_auth_user', JSON.stringify(updated));
    }

    if (isFirebaseConfigured && db && auth?.currentUser) {
      const currentUid = auth.currentUser.uid;
      (async () => {
        try {
          const userDocRef = doc(db, 'users', currentUid);
          await setDoc(userDocRef, { aadhaarNumber, phoneNumber, bloodGroup }, { merge: true });

          const patientDocRef = doc(db, 'patients', currentUid);
          await setDoc(
            patientDocRef,
            {
              aadhaarNumber,
              mobileNumber: phoneNumber,
              bloodGroup,
            },
            { merge: true }
          );
        } catch (err) {
          console.warn('Error updating Aadhaar/phone in Firestore:', err);
        }
      })();
    }
  };

  const signUp = async (
    email: string,
    pass: string,
    name: string,
    role: UserRole,
    extra?: Record<string, string>
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const registered = getRegisteredAccounts();
    const isAlreadyRegistered =
      registered.some((a) => a.email.toLowerCase() === cleanEmail) ||
      Object.values(DEMO_USERS).some((d) => d.email.toLowerCase() === cleanEmail);

    if (isAlreadyRegistered) {
      const existsErr = new Error(`An account with email ${email} is already registered. Please sign in.`);
      (existsErr as any).code = 'auth/email-already-in-use';
      throw existsErr;
    }

    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const appUser: AppUser = {
        uid: cred.user.uid,
        email,
        displayName: name,
        role,
        ...extra,
      };

      saveRegisteredAccount({
        uid: cred.user.uid,
        email,
        password: pass,
        displayName: name,
        role,
        ...extra,
      });

      setUser(appUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('medicync_auth_user', JSON.stringify(appUser));
      }

      if (db) {
        setDoc(doc(db, 'users', cred.user.uid), appUser).catch(() => {});
      }
    } else {
      const newUid = `user-${Date.now()}`;
      const appUser: AppUser = {
        uid: newUid,
        email,
        displayName: name,
        role,
        ...extra,
      };

      saveRegisteredAccount({
        uid: newUid,
        email,
        password: pass,
        displayName: name,
        role,
        ...extra,
      });

      setUser(appUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('medicync_auth_user', JSON.stringify(appUser));
      }
    }
  };

  const signUpCitizen = async (data: CitizenSignUpData) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const password = data.password || 'MediSync@2026';

    const registered = getRegisteredAccounts();
    const isAlreadyRegistered =
      registered.some((a) => a.email.toLowerCase() === cleanEmail) ||
      Object.values(DEMO_USERS).some((d) => d.email.toLowerCase() === cleanEmail);

    if (isAlreadyRegistered) {
      const existsErr = new Error(`An account with email ${data.email} is already registered. Please sign in.`);
      (existsErr as any).code = 'auth/email-already-in-use';
      throw existsErr;
    }

    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, data.email, password);
      const citizenUser: AppUser = {
        uid: cred.user.uid,
        email: data.email,
        displayName: data.name,
        role: 'PATIENT',
        aadhaarNumber: data.aadhaarNumber,
        phoneNumber: data.phoneNumber,
        bloodGroup: data.bloodGroup || 'O+',
        authProvider: 'password',
      };

      saveRegisteredAccount({
        uid: cred.user.uid,
        email: data.email,
        password,
        displayName: data.name,
        role: 'PATIENT',
        aadhaarNumber: data.aadhaarNumber,
        phoneNumber: data.phoneNumber,
        bloodGroup: data.bloodGroup || 'O+',
      });

      // Set user immediately so dashboard opens without delay
      setUser(citizenUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('medicync_auth_user', JSON.stringify(citizenUser));
      }

      if (db) {
        (async () => {
          try {
            await setDoc(doc(db, 'users', cred.user.uid), citizenUser);
            await setDoc(doc(db, 'patients', cred.user.uid), {
              id: `#NDHN-${cred.user.uid.slice(0, 6).toUpperCase()}`,
              fullName: data.name,
              aadhaarNumber: data.aadhaarNumber,
              mobileNumber: data.phoneNumber,
              bloodGroup: data.bloodGroup || 'O+',
              existingConditions: [],
              allergies: [],
              prescriptions: [],
              vitals: { heartRate: 72, bloodPressure: '120/80', spO2: 98, temperature: 98.6 },
              lastProfileUpdate: new Date().toISOString().slice(0, 10),
              nextReviewDueDate: new Date(Date.now() + 120 * 24 * 3600 * 1000).toISOString().slice(0, 10),
            });
          } catch (e) {
            console.warn('Background Firestore user seed error:', e);
          }
        })();
      }
    } else {
      const newUid = `cit-${Date.now()}`;
      const citizenUser: AppUser = {
        uid: newUid,
        email: data.email,
        displayName: data.name,
        role: 'PATIENT',
        aadhaarNumber: data.aadhaarNumber,
        phoneNumber: data.phoneNumber,
        bloodGroup: data.bloodGroup || 'O+',
        authProvider: 'password',
      };

      saveRegisteredAccount({
        uid: newUid,
        email: data.email,
        password,
        displayName: data.name,
        role: 'PATIENT',
        aadhaarNumber: data.aadhaarNumber,
        phoneNumber: data.phoneNumber,
        bloodGroup: data.bloodGroup || 'O+',
      });

      setUser(citizenUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('medicync_auth_user', JSON.stringify(citizenUser));
      }
    }
  };

  const signUpOrganisation = async (data: OrgSignUpData) => {
    const cleanEmail = data.email.trim().toLowerCase();

    const registered = getRegisteredAccounts();
    const isAlreadyRegistered =
      registered.some((a) => a.email.toLowerCase() === cleanEmail) ||
      Object.values(DEMO_USERS).some((d) => d.email.toLowerCase() === cleanEmail);

    if (isAlreadyRegistered) {
      const existsErr = new Error(`An account with email ${data.email} is already registered. Please sign in.`);
      (existsErr as any).code = 'auth/email-already-in-use';
      throw existsErr;
    }

    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const orgUser: AppUser = {
        uid: cred.user.uid,
        email: data.email,
        displayName: `${data.officerName} (${data.orgName})`,
        role: 'DOCTOR',
        hospital: data.orgName,
        licenseNumber: data.licenseNumber,
        orgType: data.orgType,
        phoneNumber: data.phoneNumber,
        authProvider: 'password',
      };

      saveRegisteredAccount({
        uid: cred.user.uid,
        email: data.email,
        password: data.password,
        displayName: `${data.officerName} (${data.orgName})`,
        role: 'DOCTOR',
        hospital: data.orgName,
        licenseNumber: data.licenseNumber,
        orgType: data.orgType,
        phoneNumber: data.phoneNumber,
      });

      // Set user immediately
      setUser(orgUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('medicync_auth_user', JSON.stringify(orgUser));
      }

      if (db) {
        (async () => {
          try {
            await setDoc(doc(db, 'users', cred.user.uid), orgUser);
            await setDoc(doc(db, 'organisations', cred.user.uid), {
              id: `ORG-${cred.user.uid.slice(0, 6).toUpperCase()}`,
              name: data.orgName,
              licenseNumber: data.licenseNumber,
              officerName: data.officerName,
              type: data.orgType,
              contactEmail: data.email,
              contactPhone: data.phoneNumber,
              accreditationStatus: 'ACTIVE_VERIFIED',
              registeredAt: new Date().toISOString(),
            });
          } catch (e) {
            console.warn('Background Firestore org seed error:', e);
          }
        })();
      }
    } else {
      const newUid = `org-${Date.now()}`;
      const orgUser: AppUser = {
        uid: newUid,
        email: data.email,
        displayName: `${data.officerName} (${data.orgName})`,
        role: 'DOCTOR',
        hospital: data.orgName,
        licenseNumber: data.licenseNumber,
        orgType: data.orgType,
        phoneNumber: data.phoneNumber,
        authProvider: 'password',
      };

      saveRegisteredAccount({
        uid: newUid,
        email: data.email,
        password: data.password,
        displayName: `${data.officerName} (${data.orgName})`,
        role: 'DOCTOR',
        hospital: data.orgName,
        licenseNumber: data.licenseNumber,
        orgType: data.orgType,
        phoneNumber: data.phoneNumber,
      });

      setUser(orgUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('medicync_auth_user', JSON.stringify(orgUser));
      }
    }
  };

  const logOut = async () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('medicync_auth_user');
    }
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('SignOut error:', err);
      }
    }
  };

  const quickLoginAs = (role: UserRole) => {
    const demo = DEMO_USERS[role];
    setUser(demo);
    if (typeof window !== 'undefined') {
      localStorage.setItem('medicync_auth_user', JSON.stringify(demo));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseActive: isFirebaseConfigured,
        signIn,
        signUp,
        signInWithGoogle,
        signUpCitizen,
        signUpOrganisation,
        updateCitizenAadhaarAndPhone,
        logOut,
        quickLoginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
