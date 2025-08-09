import { NextRequest, NextResponse } from 'next/server';
import { firestoreAdmin } from '@/lib/server/firebaseAdmin';

export async function GET(_req: NextRequest, context: { params: { slug: string } | Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const doc = await firestoreAdmin.collection('assistants').doc(slug).get();
    if (!doc.exists) return new NextResponse('Not found', { status: 404 });
    const data = doc.data() as { embedHtml: string } | undefined;
    const html = data?.embedHtml || '';
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    console.error(e);
    return new NextResponse('Failed to load assistant', { status: 500 });
  }
} 