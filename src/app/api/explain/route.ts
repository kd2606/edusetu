import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response('Missing prompt', { status: 400 });
    }

    if (prompt.length > 1000) {
      return new Response('Prompt too long', { status: 400 });
    }

    const API_KEYS = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3
    ].filter(Boolean) as string[];

    if (API_KEYS.length === 0) {
      return new Response(JSON.stringify({ error: 'API keys not configured' }), { status: 500 });
    }

    const MODELS = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
    
    let result;
    let success = false;

    // Try finding a working key/model combo
    for (const modelName of MODELS) {
      for (const apiKey of API_KEYS) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: 'You are a senior engineer mentoring a junior. Explain the given technical concept in exactly 3 concise, easy-to-understand sentences. Do not use markdown.',
          });
          
          result = await model.generateContentStream(prompt);
          success = true;
          break; // break key loop
        } catch (e) {
          console.warn(`Failed with ${modelName} and key ...${apiKey.slice(-4)}`, e);
        }
      }
      if (success) break; // break model loop
    }

    if (!success || !result) {
      return new Response(JSON.stringify({ error: 'Failed to generate explanation due to API limits' }), { status: 500 });
    }

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(encoder.encode(chunkText));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Explanation streaming error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate explanation' }), { status: 500 });
  }
}
