'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  X,
  Send,
  MessageSquare,
  Shield,
  Heart,
  Activity,
  QrCode,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { PatientProfile } from '@/lib/types';

interface AiHealthBotProps {
  patient?: PatientProfile;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  quickActions?: { label: string; query: string }[];
}

const PRESET_ANSWERS: Record<string, string> = {
  bp: `**Blood Pressure Summary (138/86 mmHg):**
• **Classification:** Pre-hypertension / Watch category.
• **What it means:** Your systolic pressure (138) is slightly higher than ideal (<120), but not in the critical emergency zone (>180).
• **Recommended Actions:**
  1. Reduce dietary sodium (limit papads, pickles, and salty snacks).
  2. Maintain 30 minutes of brisk walking daily.
  3. Re-check in 7 days and discuss with your consulting doctor if readings stay above 135 mmHg.`,

  meds: `**Your Current Prescription Schedule:**
• **Metformin 500mg:** 1 tablet twice daily after meals (Breakfast & Dinner).
• **Paracetamol 650mg:** SOS (only if fever > 100°F or body ache), max 3 tablets in 24 hours.
• **Atorvastatin 10mg:** 1 tablet at bedtime.

*Tip:* Never stop prescribed cardiac or diabetic medications without consulting your physician.`,

  qr: `**How Your Emergency QR Card Works:**
1. In an accident or emergency, any first responder, EMT, or ER doctor can scan your QR code using any smartphone camera.
2. It displays your **Blood Group, Emergency Contacts, Known Allergies, and Critical Surgeries** without needing your phone password.
3. Your sensitive financial data is completely protected under ABDM / NDHM guidelines.`,

  sugar: `**Fasting Blood Glucose Standards:**
• **Normal:** 70 – 99 mg/dL
• **Early Elevation (Pre-diabetes):** 100 – 125 mg/dL
• **High (Diabetic Range):** 126 mg/dL or higher

*Your recent log (135 mg/dL)* indicates elevated fasting glucose. It is advised to monitor HbA1c every 3 months.`,

  share: `**Sharing Health Records with Hospitals:**
1. You can share your MediSync Health ID or Emergency QR directly at reception or clinic counter.
2. Hospitals connected to the ABDM network can pull authorized diagnostic PDFs instantly.
3. You maintain full consent control to revoke access at any time.`,
};

export function AiHealthBot({ patient }: AiHealthBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(true);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: `Namaste${patient?.fullName ? ` ${patient.fullName}` : ''}! I am your **MediSync AI Health Companion**.

I can help explain your vitals, review medications, guide you on your Emergency QR, or explain lab tests in simple language. What would you like to check?`,
      time: 'Just now',
      quickActions: [
        { label: '🩺 Explain my Blood Pressure', query: 'bp' },
        { label: '💊 Check my Medications', query: 'meds' },
        { label: '🚨 Emergency QR Guide', query: 'qr' },
        { label: '🧪 Fasting Blood Sugar Range', query: 'sugar' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShowWelcomeBubble(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSend = async (userQuery?: string) => {
    const queryText = (userQuery || inputVal).trim();
    if (!queryText) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!userQuery) setInputVal('');
    setIsTyping(true);

    const lower = queryText.toLowerCase();

    // Check offline preset answers first for instant response
    let matchedAnswer: string | null = null;
    if (lower.includes('bp') || lower.includes('blood pressure') || lower.includes('pressure') || lower.includes('hypertension')) {
      matchedAnswer = PRESET_ANSWERS.bp;
    } else if (lower.includes('med') || lower.includes('medicine') || lower.includes('prescription') || lower.includes('metformin') || lower.includes('dose')) {
      matchedAnswer = PRESET_ANSWERS.meds;
    } else if (lower.includes('qr') || lower.includes('emergency') || lower.includes('card') || lower.includes('first responder')) {
      matchedAnswer = PRESET_ANSWERS.qr;
    } else if (lower.includes('sugar') || lower.includes('glucose') || lower.includes('diabetes') || lower.includes('fasting')) {
      matchedAnswer = PRESET_ANSWERS.sugar;
    } else if (lower.includes('share') || lower.includes('doctor') || lower.includes('hospital') || lower.includes('abdm') || lower.includes('abha')) {
      matchedAnswer = PRESET_ANSWERS.share;
    }

    if (matchedAnswer) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: matchedAnswer!,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsTyping(false);
      }, 700);
      return;
    }

    // Try real API call to /api/gemini/chat
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', text: queryText }],
          userProfile: {
            age: patient?.dob
              ? `${Math.max(0, new Date().getFullYear() - new Date(patient.dob).getFullYear())}`
              : (patient?.age ? String(patient.age) : 'Adult'),
            gender: patient?.gender || 'N/A',
            allergies: patient?.allergies?.map((a) => a.allergen).join(', ') || 'None',
            conditions:
              patient?.existingConditions?.join(', ') ||
              patient?.chronicConditions?.join(', ') ||
              'General Wellness',
          },
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      const botResponse = data.text || 'I have noted your query. Please consult your physician for personalized clinical advice.';

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      // Graceful fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Thank you for asking about "${queryText}".\n\nFor clinical security, all vitals, lab reports, and medication timings are safely archived in your MediSync Vault. If this is an urgent health symptom, please contact emergency helpline **108** or visit the nearest trauma clinic.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <aside aria-label="AI Health Assistant" className="fixed bottom-20 right-3.5 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end pointer-events-auto">
      {/* ── Chat Window ────────────────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="MediSync AI Assistant Chat"
          className="fixed inset-x-2 bottom-20 sm:static sm:inset-auto w-auto sm:w-[420px] h-[75vh] sm:h-[580px] max-h-[85vh] sm:max-h-[82vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-2 sm:mb-4 animate-scaleIn border border-[#DDD4C5] z-50"
          style={{
            background: 'var(--color-surface)',
            boxShadow: '0 20px 50px rgba(13, 27, 62, 0.22), 0 4px 16px rgba(245, 132, 92, 0.15)',
          }}
        >
          {/* Header */}
          <div
            className="p-4 px-5 flex items-center justify-between text-white shrink-0"
            style={{
              background: 'linear-gradient(135deg, var(--clr-navy) 0%, #162654 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center relative shrink-0"
                style={{
                  background: 'linear-gradient(135deg, var(--clr-coral) 0%, #EA580C 100%)',
                  boxShadow: '0 4px 12px rgba(245, 132, 92, 0.4)',
                }}
              >
                <Bot className="w-5 h-5 text-white" />
                <span
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0D1B3E]"
                  style={{ background: 'var(--clr-mint)' }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base tracking-tight text-white">
                    Ayush AI Assistant
                  </h3>
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase"
                    style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399' }}
                  >
                    Online
                  </span>
                </div>
                <p className="text-xs font-body text-slate-300">
                  National Health Vault Clinical Guide
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer text-slate-300 hover:text-white hover:bg-white/10"
              title="Close chat"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 p-4 overflow-y-auto space-y-4 font-body"
            style={{ background: 'var(--color-background)' }}
          >
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 text-sm sm:text-[15px] leading-relaxed ${
                      isBot
                        ? 'bg-white text-[var(--color-foreground)] border border-[#DDD4C5] shadow-sm rounded-tl-sm'
                        : 'text-white rounded-tr-sm'
                    }`}
                    style={{
                      background: isBot ? '#FFFFFF' : 'var(--clr-coral)',
                      boxShadow: isBot ? '0 2px 8px rgba(13,27,62,0.06)' : '0 2px 8px rgba(245,132,92,0.25)',
                    }}
                  >
                    <div className="whitespace-pre-line">
                      {msg.text.split('\n').map((line, idx) => {
                        // Bold formatting
                        if (line.includes('**')) {
                          const parts = line.split('**');
                          return (
                            <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
                              {parts.map((part, i) =>
                                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                              )}
                            </p>
                          );
                        }
                        return (
                          <p key={idx} className={idx > 0 ? 'mt-1' : ''}>
                            {line}
                          </p>
                        );
                      })}
                    </div>

                    {/* Quick action buttons if provided */}
                    {msg.quickActions && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {msg.quickActions.map((qa, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(qa.query)}
                            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer text-left press-scale"
                            style={{
                              background: 'var(--clr-coral-light)',
                              color: 'var(--clr-coral-hover)',
                              borderColor: 'rgba(245,132,92,0.3)',
                            }}
                          >
                            {qa.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 mt-1 px-1 font-mono">
                    {msg.time}
                  </span>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white p-3 rounded-2xl w-fit border border-[#DDD4C5]">
                <Sparkles className="w-3.5 h-3.5 text-[var(--clr-coral)] animate-pulse" />
                <span>Ayush AI is analyzing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Strip */}
          <div className="px-3 py-2 bg-white/70 border-t border-[#DDD4C5] flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Ask:
            </span>
            <button
              onClick={() => handleSend('bp')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap cursor-pointer transition"
            >
              🩺 BP Check
            </button>
            <button
              onClick={() => handleSend('meds')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap cursor-pointer transition"
            >
              💊 Medicines
            </button>
            <button
              onClick={() => handleSend('qr')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap cursor-pointer transition"
            >
              🚨 Emergency QR
            </button>
          </div>

          {/* Input Bar */}
          <div
            className="p-3 bg-white border-t border-[#DDD4C5] shrink-0"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about tests, symptoms, medicines..."
                className="flex-1 h-11 px-4 rounded-xl text-sm sm:text-[15px] bg-[#F7F4EF] border border-[#DDD4C5] text-[var(--color-foreground)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--clr-coral)]"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 cursor-pointer shrink-0 press-scale"
                style={{
                  background: 'var(--clr-coral)',
                  boxShadow: '0 3px 10px rgba(245, 132, 92, 0.35)',
                }}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Hovering Bot Icon & Floating Badge ────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Welcome Callout Speech Pill */}
        {showWelcomeBubble && !isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-[var(--color-foreground)] border border-[#DDD4C5] shadow-lg cursor-pointer hover:border-[var(--clr-coral)] transition-all animate-fadeIn"
            style={{
              boxShadow: '0 8px 24px rgba(13, 27, 62, 0.12)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-sm font-display font-bold">
              Need help? Ask Ayush AI 💬
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowWelcomeBubble(false);
              }}
              className="text-slate-400 hover:text-slate-600 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className="group relative w-13 h-13 sm:w-[68px] sm:h-[68px] rounded-2xl sm:rounded-3xl flex items-center justify-center cursor-pointer transition-all duration-300 press-scale"
          style={{
            background: 'linear-gradient(135deg, var(--clr-coral) 0%, #EA580C 100%)',
            boxShadow: '0 8px 24px rgba(245, 132, 92, 0.45), 0 0 16px rgba(245, 132, 92, 0.25)',
            animation: isOpen ? 'none' : 'float 3.5s ease-in-out infinite',
          }}
          title={isOpen ? 'Close AI Assistant' : 'Chat with MediSync AI Assistant'}
        >
          {/* Animated glow ring */}
          <span
            className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-75 animate-ping pointer-events-none"
            style={{ background: 'var(--clr-coral)', animationDuration: '3s' }}
          />

          {isOpen ? (
            <X className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10 transition-transform group-hover:rotate-90 duration-200" />
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center">
              <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white transition-transform group-hover:scale-110 duration-200" />
              {/* Online status indicator */}
              <span
                className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white"
                style={{ background: 'var(--clr-mint)' }}
              />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
