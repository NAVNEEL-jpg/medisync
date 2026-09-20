'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isFirebaseActive: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string, role: UserRole, extra?: Record<string, string>) => Promise<void>;
  logOut: () => Promise<void>;
  quickLoginAs: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users when testing offline or before Firebase keys are loaded
const DEMO_USERS: Record<UserRole, AppUser> = {
  DOCTOR: {
    uid: 'demo-doc-01',
    email: 'dr.mehra@sms.hospital.in',
    displayName: 'Dr. Vivek Mehra (Cardiologist / ER Head)',
    role: 'DOCTOR',
    licenseNumber: 'MCI-REG-882194',
    hospital: 'SMS Medical College & Hospital, Jaipur',
  },
  PATIENT: {
    uid: 'demo-pat-01',
    email: 'rajesh.sharma@gmail.com',
    displayName: 'Rajesh Kumar Sharma',
    role: 'PATIENT',
    aadhaarNumber: '234567890123',
  },
  CAMP_WORKER: {
    uid: 'demo-camp-01',
    email: 'asha.sunita@health.rajasthan.gov.in',
    displayName: 'Sunita Sharma (ASHA Facilitator)',
    role: 'CAMP_WORKER',
    hospital: 'Outreach Health Camp #14, Ramgarh',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // Fetch user metadata from Firestore if available
          let role: UserRole = 'PATIENT';
          let displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
          let extraData: Record<string, any> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

          if (db) {
            try {
              const userDocRef = doc(db, 'users', firebaseUser.uid);
              const userSnap = await getDoc(userDocRef);
              if (userSnap.exists()) {
                const data = userSnap.data();
                role = data.role || 'PATIENT';
                displayName = data.displayName || displayName;
                extraData = data;
              }
            } catch (e) {
              console.warn('Could not fetch user document from Firestore:', e);
            }
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName,
            role,
            ...extraData,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Local storage restore for mock session
      const saved = localStorage.getItem('medicync_auth_user');
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
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      // Mock login check
      const matched = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase());
      const loggedUser = matched || {
        uid: `user-${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        role: 'PATIENT',
      };
      setUser(loggedUser);
      localStorage.setItem('medicync_auth_user', JSON.stringify(loggedUser));
    }
  };

  const signUp = async (
    email: string,
    pass: string,
    name: string,
    role: UserRole,
    extra?: Record<string, string>
  ) => {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const appUser: AppUser = {
        uid: cred.user.uid,
        email,
        displayName: name,
        role,
        ...extra,
      };

      if (db) {
        await setDoc(doc(db, 'users', cred.user.uid), appUser);
      }
      setUser(appUser);
    } else {
      const appUser: AppUser = {
        uid: `user-${Date.now()}`,
        email,
        displayName: name,
        role,
        ...extra,
      };
      setUser(appUser);
      localStorage.setItem('medicync_auth_user', JSON.stringify(appUser));
    }
  };

  const logOut = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    } else {
      setUser(null);
      localStorage.removeItem('medicync_auth_user');
    }
  };

  const quickLoginAs = (role: UserRole) => {
    const demo = DEMO_USERS[role];
    setUser(demo);
    localStorage.setItem('medicync_auth_user', JSON.stringify(demo));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseActive: isFirebaseConfigured,
        signIn,
        signUp,
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
