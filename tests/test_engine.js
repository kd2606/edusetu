const fs = require('fs');
const path = require('path');

async function runTest() {
  const domain = "React";
  const currentLevel = "Beginner";
  const ultimateGoal = "Build web apps";
  const timeframe = "3 months";

  const prompt = `
You are an expert learning pathway generator. Generate a structured learning roadmap.
If the Domain relates to Indian Education (e.g. 10th/12th Board, JEE, NEET, UPSC), you MUST heavily contextualize the output for an Indian student:
- Recommend standard Indian textbooks (e.g. NCERT, RD Sharma, HC Verma, Laxmikanth).
- Recommend popular high-quality Indian YouTube channels (e.g. PhysicsWallah, Unacademy, Apni Kaksha, Aman Dhattarwal, Let's Crack UPSC, etc.).
- Structure the timeline according to typical Indian academic calendars if applicable.
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
      "difficulty_level": "Beginner" | "Intermediate" | "Advanced",
      "proof_project": {
        "title": "string",
        "description": "string",
        "github_required": "boolean"
      },
      "is_boss_node": "boolean",
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

  // Try to load .env.local manually if it exists
  let apiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY_3;
  
  if (!apiKey) {
    try {
      const envPath = path.resolve(__dirname, '../.env.local');
      if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf-8');
        const match = envFile.match(/GEMINI_API_KEY(?:_1|_2|_3)?=(.+)/);
        if (match) {
          apiKey = match[1].trim();
        }
      }
    } catch (e) {
      console.warn("Could not read .env.local", e);
    }
  }

  if (!apiKey) {
    console.error("Please set GEMINI_API_KEY_1 environment variable.");
    process.exit(1);
  }

  const model = "gemini-2.5-flash";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API call failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    let jsonText = text.trim();
    if (jsonText.startsWith('\`\`\`')) {
      jsonText = jsonText.replace(/^\`\`\`(?:json)?\n?/i, '').replace(/\n?\`\`\`$/i, '');
    }

    const parsed = JSON.parse(jsonText);
    console.log("Successfully generated response!");
    console.log("======================================");
    console.log("First Node Output (to verify new fields):");
    console.log(JSON.stringify(parsed.nodes[0], null, 2));
    console.log("======================================");
    
    const node = parsed.nodes[0];
    if (node.difficulty_level && node.proof_project && typeof node.is_boss_node !== 'undefined') {
      console.log("SUCCESS: New fields verified.");
    } else {
      console.log("FAILED: Missing new fields in output.");
    }

  } catch (error) {
    console.error("Test failed:", error);
  }
}

runTest();
