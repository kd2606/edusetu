import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nodeTitle, courseContext } = body;

    if (!nodeTitle || typeof nodeTitle !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid field: nodeTitle' }, { status: 400 });
    }

    const prompt = `
You are an expert learning mentor. A student is struggling with the concept "${nodeTitle}".
${courseContext ? `This concept is part of a broader course: "${courseContext}".` : ''}

Break down "${nodeTitle}" into 3 logical, strictly sequential sub-topics that will help them understand it step-by-step.
Return ONLY raw JSON matching the exact schema below. No markdown, no extra text.

Schema:
[
  {
    "id": "string (generate a short unique slug, e.g. topic-sub-1)",
    "title": "string",
    "description": "string (explain what this sub-topic covers and why it helps)",
    "difficulty_level": "Beginner" | "Intermediate" | "Advanced",
    "is_boss_node": false
  }
]
    `;

    const API_KEYS = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3
    ].filter(Boolean);

    if (API_KEYS.length === 0) {
      throw new Error("No API keys configured");
    }

    const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-lite-latest"];

    let geminiResponse;
    let lastErrorText = "";
    let success = false;

    for (const model of MODELS) {
      for (const key of API_KEYS) {
        geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" }
            })
          }
        );

        if (geminiResponse.ok) {
          success = true;
          break;
        }

        lastErrorText = await geminiResponse.text();
        console.log(`Model ${model} with Key ...${key?.slice(-4)} failed (Status: ${geminiResponse.status})`);
      }
      if (success) break;
    }

    if (!success || !geminiResponse) {
      throw new Error(`All models and keys failed. Last error: ${lastErrorText}`);
    }

    const geminiData = await geminiResponse.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) throw new Error("No response from Gemini");

    let jsonText = responseText.trim();
    if (jsonText.startsWith('\`\`\`')) {
      jsonText = jsonText.replace(/^\`\`\`(?:json)?\n?/i, '').replace(/\n?\`\`\`$/i, '');
    }

    const data = JSON.parse(jsonText);

    return NextResponse.json(data);

  } catch (error: unknown) {
    console.error("=== BREAKDOWN API ERROR ===");
    console.error("Error Message:", (error as Error)?.message);
    console.error("========================");
    return NextResponse.json({
      error: "Failed to generate breakdown. Please try again."
    }, { status: 500 });
  }
}
