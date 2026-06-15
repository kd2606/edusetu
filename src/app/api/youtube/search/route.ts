import { NextResponse } from 'next/server';

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_HOUR = 10;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    const now = Date.now();
    
    // Rate Limiting Logic
    const timestamps = rateLimitMap.get(ip) || [];
    const validTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
    
    if (validTimestamps.length >= MAX_REQUESTS_PER_HOUR) {
      return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    }
    
    validTimestamps.push(now);
    rateLimitMap.set(ip, validTimestamps);

    const body = await req.json();
    const { query, language } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const searchQuery = encodeURIComponent(query + ' tutorial');
    const relLang = language ?? 'en';
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&type=video&videoEmbeddable=true&relevanceLanguage=${relLang}&safeSearch=moderate&q=${searchQuery}&key=${apiKey}`;

    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      const errText = await response.text();
      console.error('YouTube API Error:', response.status, errText);
      return NextResponse.json({ error: 'YouTube API unavailable' }, { status: 502 });
    }

    const data = await response.json();

    const videos = (data.items || [])
      .filter((item: { id?: { videoId?: string } }) => item?.id?.videoId)
      .map((item: { id: { videoId: string }, snippet: { title: string, thumbnails: { medium: { url: string } }, channelTitle: string } }) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
      }));

    return NextResponse.json({ videos });

  } catch (error: unknown) {
    console.error('YouTube search failed:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}
