import { NextResponse } from 'next/server';

// Placeholder sync endpoint to avoid build-time errors.
// Adjust with real implementation when needed.
export async function GET() {
  return NextResponse.json({ ok: true, message: 'Sync endpoint not implemented' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    return NextResponse.json({ ok: true, received: body });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}