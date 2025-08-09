import { NextResponse } from 'next/server';
import { getHiddenIds } from '@/lib/server/hiddenStore';

export async function GET() {
  try {
    const ids = await getHiddenIds();
    return NextResponse.json({ ids });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to load hidden games' }, { status: 500 });
  }
} 