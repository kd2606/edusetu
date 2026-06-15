import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API using the same keys approach as generate route, or just first available
const apiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY_3 || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response('Missing prompt', { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: 'You are a senior engineer mentoring a junior. Explain the given technical concept in exactly 3 concise, easy-to-understand sentences. Do not use markdown.',
    });

    const result = await model.generateContentStream(prompt);

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
