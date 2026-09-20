import { NextResponse } from 'next/server';
import { generateWithFallback } from '@/lib/gemini';

export const runtime = 'nodejs';

const ANALYZE_PROMPT = `You are MediSync Clinical Analyst, specialized in translating medical lab reports, diagnostic summaries, and prescriptions into clear, patient-friendly explanations.

Analyze the provided medical text carefully and return a valid JSON object strictly matching this schema:
{
  "documentType": "string (e.g. Complete Blood Count, Lipid Panel, Prescription, Imaging Report, General)",
  "patientFriendlySummary": "string (A 2-3 sentence overview in plain language)",
  "overallRiskLevel": "low" | "moderate" | "high" | "needs_attention",
  "keyFindings": [
    {
      "testName": "string",
      "resultValue": "string",
      "referenceRange": "string",
      "status": "normal" | "high" | "low" | "abnormal",
      "meaning": "string (plain English explanation of what this test represents and why it matters)"
    }
  ],
  "actionableAdvice": [
    "string"
  ],
  "questionsForDoctor": [
    "string"
  ],
  "disclaimer": "string"
}

Ensure your response is valid raw JSON only, with no markdown code blocks or wrapping backticks.`;

export async function POST(req: Request) {
  try {
    const { documentText } = await req.json();

    if (!documentText || typeof documentText !== 'string' || documentText.trim().length === 0) {
      return NextResponse.json(
        { error: 'documentText is required and cannot be empty.' },
        { status: 400 }
      );
    }

    const { response, activeModel } = await generateWithFallback({
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${ANALYZE_PROMPT}\n\n[DOCUMENT CONTENT TO ANALYZE]:\n${documentText}` },
          ],
        },
      ],
      temperature: 0.2,
      responseMimeType: 'application/json',
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return NextResponse.json({
      success: true,
      model: activeModel,
      analysis: parsedData,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Error in /api/gemini/analyze:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to analyze document.' },
      { status: 500 }
    );
  }
}
