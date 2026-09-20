'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';
import { UserProfile } from './Header';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface SymptomChatProps {
  profile: UserProfile;
}

const SAMPLE_QUERIES = [
  'Persistent dry cough with low-grade fever for 4 days',
  'Dull ache in lower back that worsens when bending down',
  'Throbbing one-sided headache with sensitivity to sound and light',
  'Burning sensation in chest after dinner and when lying down',
];

export function SymptomChat({ profile }: SymptomChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I'm MediSync AI, your clinical intelligence assistant. Describe any symptoms you're experiencing, how long they've lasted, or health questions you have.",
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, text: m.text })),
          userProfile: profile,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to receive a response.');
      }

      const botMessage: Message = {
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: unknown) {
      const error = err as Error;
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: `⚠️ Error: ${error.message || 'Unable to connect to Gemini API. Please check your network or API quota.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'model',
        text: "Conversation reset. How can I help you today? Feel free to describe any symptoms, medications, or lab inquiries.",
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[720px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Top action bar */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              Symptom Triage & Consultation
              <span className="text-[10px] text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded-full font-medium">
                Gemini 3.6 Flash
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile.age || profile.conditions
                ? `Personalized context: ${[profile.age && `${profile.age}y/o`, profile.conditions].filter(Boolean).join(', ')}`
                : 'General assessment mode'}
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-2.5 py-1.5 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
          title="Clear chat session"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Message scroll list */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m, idx) => {
          const isModel = m.role === 'model';
          return (
            <div
              key={idx}
              className={`flex gap-3 max-w-3xl ${isModel ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                  isModel
                    ? 'bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-xs'
                    : 'bg-slate-700 text-white'
                }`}
              >
                {isModel ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`group relative rounded-2xl p-4 text-sm leading-relaxed transition-all ${
                  isModel
                    ? 'bg-slate-100/80 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60'
                    : 'bg-teal-600 text-white rounded-br-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                <div
                  className={`flex items-center justify-between gap-4 mt-2 pt-2 border-t text-[11px] ${
                    isModel
                      ? 'border-slate-200/60 dark:border-slate-700/60 text-slate-400'
                      : 'border-teal-500/50 text-teal-100'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {isModel && (
                    <button
                      onClick={() => copyToClipboard(m.text, idx)}
                      className="opacity-0 group-hover:opacity-100 transition text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1"
                      title="Copy response"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-md mr-auto items-center animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 rounded-2xl px-4 py-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-spin" />
              <span>MediSync AI is analyzing symptoms & clinical literature...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sample question chips */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-500" />
            Try a common clinical query:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_QUERIES.map((sample, i) => (
              <button
                key={i}
                onClick={() => handleSend(sample)}
                className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-300 hover:text-teal-600 transition truncate max-w-xs"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message input field */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your symptoms (e.g. sharp headache, mild fever, duration, triggers)..."
            disabled={isLoading}
            className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium text-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask MediSync</span>
          </button>
        </form>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-slate-400" />
            Informational assessment only. In emergencies, seek immediate in-person care.
          </span>
          <span className="hidden sm:inline">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
}
