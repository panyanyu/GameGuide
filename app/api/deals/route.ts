import { NextRequest, NextResponse } from 'next/server';
import { ITAD_BASE_URL, ITAD_API_KEY } from '../../data/deals';

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

function isChinese(text: string): boolean {
  return /[一-龥]/.test(text);
}

async function translateToEnglish(text: string): Promise<string> {
  if (!isChinese(text)) return text;

  try {
    const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=zh|en`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
  } catch (error) {
    console.error('Translation error:', error);
  }
  return text;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let title = searchParams.get('title') || '';
  const limit = searchParams.get('limit') || '8';

  if (!title) {
    return NextResponse.json({ error: 'Missing title parameter' }, { status: 400 });
  }

  try {
    const translatedTitle = await translateToEnglish(title);
    const searchUrl = `${ITAD_BASE_URL}/games/search/v1?title=${encodeURIComponent(translatedTitle)}&results=${limit}&key=${ITAD_API_KEY}`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`ITAD API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Deals API proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const gameIds: string[] = await request.json();

    if (!gameIds || !Array.isArray(gameIds) || gameIds.length === 0) {
      return NextResponse.json({ error: 'Missing game IDs' }, { status: 400 });
    }

    const pricesRes = await fetch(
      `${ITAD_BASE_URL}/games/prices/v3?key=${ITAD_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameIds),
      }
    );

    if (!pricesRes.ok) {
      throw new Error(`ITAD Prices API error: ${pricesRes.status}`);
    }

    const data = await pricesRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Deals prices API proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}
