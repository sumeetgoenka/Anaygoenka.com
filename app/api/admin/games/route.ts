import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { firestoreAdmin } from '@/lib/server/firebaseAdmin';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug, title, description, html } = await req.json();
    if (!slug || !title || !description || !html) {
      return NextResponse.json({ error: 'slug, title, description, and html are required' }, { status: 400 });
    }

    const id = slug.toLowerCase().trim();

    await firestoreAdmin.collection('games').doc(id).set({
      id,
      slug: id,
      title,
      description,
      html,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: session.user.email || 'admin',
    });

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to save game' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const snapshot = await firestoreAdmin.collection('games').orderBy('createdAt', 'desc').get();
    const games = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        url: `/games/${data.slug}`,
      };
    });
    return NextResponse.json({ games });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to list games' }, { status: 500 });
  }
} 