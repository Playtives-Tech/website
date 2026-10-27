import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const configuredUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const backendUrl = configuredUrl || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001');
  if (!backendUrl) {
    return NextResponse.json(
      { error: 'Set API_URL to the Playtives backend URL in the website deployment.' },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(`${backendUrl.replace(/\/$/, '')}/v1/opportunities`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: `Playtives backend returned ${response.status}.` },
        { status: 502 },
      );
    }
    const opportunities: unknown = await response.json();
    if (!Array.isArray(opportunities)) {
      return NextResponse.json({ error: 'Unexpected backend response.' }, { status: 502 });
    }
    return NextResponse.json(opportunities, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch {
    return NextResponse.json(
      { error: 'Cannot reach the Playtives backend. Check API_URL in the website deployment.' },
      { status: 502 },
    );
  }
}
