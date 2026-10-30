'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AccessibilityPreferences } from '@/lib/types';

interface AccessibilityContextType {
  prefs: AccessibilityPreferences;
  isAssistiveMode: boolean;
  toggleAssistiveMode: () => void;
  setHighContrast: (val: boolean) => void;
  setFontSizeScale: (val: 'normal' | 'large' | 'extra-large') => void;
  setLanguage: (lang: 'en' | 'hi' | 'bn') => void;
  setTtsEnabled: (val: boolean) => void;
  setVoiceNavEnabled: (val: boolean) => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  t: (key: string) => string;
}

const DEFAULT_PREFS: AccessibilityPreferences = {
  highContrast: false,
  fontSizeScale: 'normal',
  ttsEnabled: true,
  voiceNavEnabled: false,
  language: 'en',
};

// Vernacular localization strings for Swasthya / Assistive Tech
const TRANSLATIONS: Record<'en' | 'hi' | 'bn', Record<string, string>> = {
  en: {
    appName: 'MediSync CareLink',
    assistiveMode: 'Assistive Mode',
    exitAssistiveMode: 'Exit Assistive Mode',
    emergencySos: 'Emergency SOS',
    sosTriggered: 'Emergency SOS Sent! Paramedics and Family Notified.',
    vitalsTitle: 'Current Health Vitals',
    heartRate: 'Heart Rate',
    pulse: 'Pulse',
    bloodOxygen: 'Blood Oxygen (SpO2)',
    bloodPressure: 'Blood Pressure',
    deviceStatus: 'CareLink Device',
    deviceOnline: 'Connected & Active',
    deviceBattery: 'Battery',
    medications: 'Medication Schedule',
    emergencyContacts: 'Emergency Contacts',
    readAloud: 'Read Aloud',
    speechActive: 'Listening for voice commands...',
    textSize: 'Text Size',
    highContrast: 'High Contrast',
    language: 'Language',
    normal: 'Normal',
    large: 'Large',
    extraLarge: 'Extra Large',
    pressToCall: 'Press to Call Emergency (108)',
    fallSuspected: 'Suspected Fall Detected',
    allClear: 'All Vitals Normal & Monitored',
  },
  hi: {
    appName: 'मेडीसिंक केयरलिंक',
    assistiveMode: 'सहायक मोड (सुलभता)',
    exitAssistiveMode: 'सामान्य मोड पर लौटें',
    emergencySos: 'आपातकालीन एसओएस',
    sosTriggered: 'आपातकालीन चेतावनी भेजी गई! परिवार और एम्बुलेंस को सूचित किया गया।',
    vitalsTitle: 'वर्तमान स्वास्थ्य स्थिति (वाइटल्स)',
    heartRate: 'हृदय गति (नाड़ी)',
    pulse: 'पल्स',
    bloodOxygen: 'रक्त ऑक्सीजन (SpO2)',
    bloodPressure: 'रक्तचाप (बीपी)',
    deviceStatus: 'केयरलिंक डिवाइस',
    deviceOnline: 'सक्रिय और कनेक्टेड',
    deviceBattery: 'बैटरी',
    medications: 'दवाइयों का समय',
    emergencyContacts: 'आपातकालीन संपर्क',
    readAloud: 'सुनें (बोलकर बताएं)',
    speechActive: 'आवाज आदेश सुन रहे हैं...',
    textSize: 'अक्षर का आकार',
    highContrast: 'हाई कंट्रास्ट (स्पष्ट दृश्य)',
    language: 'भाषा',
    normal: 'सामान्य',
    large: 'बड़ा',
    extraLarge: 'अति विशाल',
    pressToCall: 'आपातकाल 108 पर कॉल करें',
    fallSuspected: 'संभावित गिरावट (फॉल) का पता चला',
    allClear: 'सभी स्वास्थ्य संकेत सामान्य हैं',
  },
  bn: {
    appName: 'মেডিসিংক কেয়ারলিঙ্ক',
    assistiveMode: 'সহায়ক মোড (অ্যাক্সেসিবিলিটি)',
    exitAssistiveMode: 'সাধারণ মোডে ফিরুন',
    emergencySos: 'জরুরি এসওএস',
    sosTriggered: 'জরুরি সতর্কতা পাঠানো হয়েছে! পরিবার ও অ্যাম্বুলেন্সকে জানানো হয়েছে।',
    vitalsTitle: 'বর্তমান স্বাস্থ্য পরিস্থিতি (ভাইটালস)',
    heartRate: 'হৃৎস্পন্দন',
    pulse: 'পালস',
    bloodOxygen: 'রক্তের অক্সিজেন (SpO2)',
    bloodPressure: 'রক্তচাপ',
    deviceStatus: 'কেয়ারলিঙ্ক ডিভাইস',
    deviceOnline: 'সংযুক্ত ও সক্রিয়',
    deviceBattery: 'ব্যাটারি',
    medications: 'ওষুধের সময়সূচী',
    emergencyContacts: 'জরুরি যোগাযোগ',
    readAloud: 'পড়ে শোনান',
    speechActive: 'ভয়েস কমান্ড শুনছি...',
    textSize: 'লেখার আকার',
    highContrast: 'উচ্চ বৈসাদৃশ্য (হাই কন্ট্রাস্ট)',
    language: 'ভাষা',
    normal: 'স্বাভাবিক',
    large: 'বড়',
    extraLarge: 'অত্যন্ত বড়',
    pressToCall: 'জরুরি পরিষেবায় কল করুন (১০৮)',
    fallSuspected: 'সম্ভাব্য পড়ে যাওয়ার শনাক্তকরণ',
    allClear: 'সকল স্বাস্থ্য সূচক স্বাভাবিক আছে',
  },
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<AccessibilityPreferences>(DEFAULT_PREFS);
  const [isAssistiveMode, setIsAssistiveMode] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('carelink_accessibility_prefs');
        if (saved) {
          const parsed = JSON.parse(saved);
          setPrefs(parsed);
          if (parsed.fontSizeScale === 'large' || parsed.fontSizeScale === 'extra-large' || parsed.highContrast) {
            setIsAssistiveMode(true);
          }
        }
      } catch (e) {
        console.warn('Could not load accessibility prefs:', e);
      }
    }
  }, []);

  // Sync classes with documentElement for global CSS targeting
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    if (prefs.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    root.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-xl');
    if (prefs.fontSizeScale === 'large') {
      root.classList.add('font-scale-large');
    } else if (prefs.fontSizeScale === 'extra-large') {
      root.classList.add('font-scale-xl');
    } else {
      root.classList.add('font-scale-normal');
    }
  }, [prefs]);

  const savePrefs = useCallback((next: AccessibilityPreferences) => {
    setPrefs(next);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('carelink_accessibility_prefs', JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save accessibility prefs:', e);
      }
    }
  }, []);

  const setHighContrast = (highContrast: boolean) => {
    savePrefs({ ...prefs, highContrast });
  };

  const setFontSizeScale = (fontSizeScale: 'normal' | 'large' | 'extra-large') => {
    savePrefs({ ...prefs, fontSizeScale });
  };

  const setLanguage = (language: 'en' | 'hi' | 'bn') => {
    savePrefs({ ...prefs, language });
  };

  const setTtsEnabled = (ttsEnabled: boolean) => {
    savePrefs({ ...prefs, ttsEnabled });
  };

  const setVoiceNavEnabled = (voiceNavEnabled: boolean) => {
    savePrefs({ ...prefs, voiceNavEnabled });
  };

  const toggleAssistiveMode = () => {
    setIsAssistiveMode((prev) => {
      const next = !prev;
      if (next) {
        savePrefs({
          ...prefs,
          fontSizeScale: 'large',
          ttsEnabled: true,
        });
      } else {
        savePrefs({
          ...prefs,
          fontSizeScale: 'normal',
          highContrast: false,
        });
      }
      return next;
    });
  };

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel(); // Stop any active speech

      const utterance = new SpeechSynthesisUtterance(text);
      if (prefs.language === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (prefs.language === 'bn') {
        utterance.lang = 'bn-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      utterance.rate = 0.9; // Slightly slower for elderly comprehension
      window.speechSynthesis.speak(utterance);
    },
    [prefs.language]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      const langDict = TRANSLATIONS[prefs.language] || TRANSLATIONS.en;
      return langDict[key] || TRANSLATIONS.en[key] || key;
    },
    [prefs.language]
  );

  return (
    <AccessibilityContext.Provider
      value={{
        prefs,
        isAssistiveMode,
        toggleAssistiveMode,
        setHighContrast,
        setFontSizeScale,
        setLanguage,
        setTtsEnabled,
        setVoiceNavEnabled,
        speak,
        stopSpeaking,
        t,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return ctx;
}
