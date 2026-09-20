import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY is not defined in environment variables.');
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

// Verified active models for this API key
export const CANDIDATE_MODELS = [
  'gemini-3.7-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
];

export async function generateWithFallback(options: {
  contents: unknown;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
}) {
  let lastError: unknown = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        config: {
          systemInstruction: options.systemInstruction,
          temperature: options.temperature ?? 0.3,
          responseMimeType: options.responseMimeType,
        },
      });

      return { response, activeModel: model };
    } catch (err: unknown) {
      console.warn(`Model ${model} issue:`, (err as Error).message);
      lastError = err;
    }
  }

  throw lastError || new Error('All candidate Gemini models failed.');
}
