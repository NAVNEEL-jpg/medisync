import { NextResponse } from 'next/server';
import { generateWithFallback } from '@/lib/gemini';

export const runtime = 'nodejs';

const SYSTEM_INSTRUCTION = `You are MediSync AI, an intelligent, empathetic, and clinical-grade medical assistant and healthcare educator.
Your role is to help patients understand symptoms, interpret medical terms, prepare questions for their physician, and follow general wellness recommendations.

Guidelines:
1. Always maintain a professional, calm, reassuring, and empathetic tone.
2. Structure your answers clearly: use bullet points, bold keywords, and concise paragraphs.
3. Categorize potential causes logically (e.g., Common & Mild, Less Common, Red Flags).
4. Clearly state "When to seek urgent or emergency care" if any red-flag symptoms are detected.
5. Provide 3-5 specific questions the patient can ask their doctor during their next visit.
6. Always include a brief disclaimer at the end that your advice is for informational purposes and cannot replace professional medical diagnosis.`;

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, userProfile } = body as {
      messages: ChatMessage[];
      userProfile?: {
        age?: string;
        gender?: string;
        allergies?: string;
        conditions?: string;
      };
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and cannot be empty.' },
        { status: 400 }
      );
    }

    let profileContext = '';
    if (userProfile && (userProfile.age || userProfile.conditions || userProfile.allergies)) {
      profileContext = `\n[Patient Context: Age: ${userProfile.age || 'N/A'}, Gender: ${userProfile.gender || 'N/A'}, Known Conditions: ${userProfile.conditions || 'None stated'}, Allergies: ${userProfile.allergies || 'None stated'}]\n`;
    }

    const contents = messages.map((m, idx) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [
        {
          text: idx === messages.length - 1 && profileContext ? `${profileContext}\n${m.text}` : m.text,
        },
      ],
    }));

    const { response, activeModel } = await generateWithFallback({
      contents,
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.3,
    });

    const replyText = response.text || 'I apologize, but I could not generate a response. Please consult a doctor.';

    return NextResponse.json({
      reply: replyText,
      model: activeModel,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Error in /api/gemini/chat:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process chat message with Gemini API.' },
      { status: 500 }
    );
  }
}
