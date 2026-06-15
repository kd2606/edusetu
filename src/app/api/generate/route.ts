import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { domain, currentLevel, ultimateGoal, timeframe } = await req.json();

    const prompt = `
You are an expert learning pathway generator. Generate a structured learning roadmap.
You must return ONLY raw JSON matching the exact schema below. No markdown, no extra text.

Schema:
{
  "title": "string",
  "estimated_duration": "string",
  "nodes": [
    {
      "id": "string",
      "label": "string",
      "description": "string",
      "category": "prerequisite" | "core" | "practice" | "project",
      "priority": "critical" | "high" | "medium",
      "time_allocation": "string",
      "resources": [
        { "type": "string", "title": "string", "url": "string" }
      ]
    }
  ],
  "edges": [
    { "source": "string", "target": "string" }
  ]
}

Domain: ${domain}
Current Level: ${currentLevel}
Ultimate Goal: ${ultimateGoal}
Timeframe: ${timeframe}
    `;

    const API_KEYS = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3
    ].filter(Boolean);

    if (API_KEYS.length === 0) {
      throw new Error("No API keys configured");
    }

    const MODELS = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-flash-lite-latest"];

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
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '');
    }

    const data = JSON.parse(jsonText);

    // Persist to database quietly if user is logged in
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      try {
        const { data: dbData, error } = await supabase.from('roadmaps').insert({
          user_id: user.id,
          title: data.title,
          domain: domain,
          nodes: data.nodes,
          edges: data.edges,
        }).select('id').single();
        
        if (!error && dbData) {
          data.id = dbData.id;
        }
      } catch (dbError) {
        console.error("Failed to save roadmap to DB:", dbError);
        // Non-blocking error, we still return the roadmap data to user
      }
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("=== API ERROR ===");
    console.error("Error Message:", error?.message);
    console.error("========================");
    return NextResponse.json({
      error: "Failed to generate roadmap",
      details: error?.message || String(error)
    }, { status: 500 });
  }
}
