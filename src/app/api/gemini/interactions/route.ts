import { NextResponse } from 'next/server';
import { generateWithFallback } from '@/lib/gemini';

export const runtime = 'nodejs';

const INTERACTION_PROMPT = `You are MediSync Pharmacology Intelligence.
Given a list of medications and/or supplements, evaluate potential drug-drug and drug-food interactions.

Return a valid JSON object strictly matching this schema:
{
  "safetyRating": "safe" | "caution" | "warning" | "danger",
  "summary": "string (Overall assessment)",
  "interactions": [
    {
      "drugsInvolved": ["string", "string"],
      "severity": "mild" | "moderate" | "major",
      "effect": "string (Description of the interaction mechanism)",
      "management": "string (Guidance on timing, spacing, or doctor consultation)"
    }
  ],
  "foodAndLifestyleWarnings": [
    "string"
  ],
  "optimalTimingAdvice": [
    "string"
  ],
  "disclaimer": "string"
}

Return raw JSON only, without markdown backticks.`;

export async function POST(req: Request) {
  try {
    const { medications } = await req.json();

    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return NextResponse.json(
        { error: 'A list of medications is required.' },
        { status: 400 }
      );
    }

    const { response, activeModel } = await generateWithFallback({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${INTERACTION_PROMPT}\n\n[MEDICATIONS LIST]:\n${medications.map((m: string) => `- ${m}`).join('\n')}`,
            },
          ],
        },
      ],
      temperature: 0.2,
      responseMimeType: 'application/json',
    });

    const responseText = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    return NextResponse.json({
      success: true,
      model: activeModel,
      data: parsed,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Error in /api/gemini/interactions:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to check medication interactions.' },
      { status: 500 }
    );
  }
}
