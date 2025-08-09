import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { firestoreAdmin } from '@/lib/server/firebaseAdmin';

export async function PATCH(req: NextRequest, context: { params: { id: string } | Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: idRaw } = await context.params;
    const id = idRaw.toLowerCase().trim();
    const body = await req.json();
    const allowed: Record<string, any> = {};
    if (typeof body.title === 'string') allowed.title = body.title;
    if (typeof body.description === 'string') allowed.description = body.description;
    if (typeof body.html === 'string') allowed.html = body.html;
    allowed.updatedAt = Date.now();

    // Merge with existing data to support local fallback overwrite semantics
    const currentSnap = await firestoreAdmin.collection('games').doc(id).get();
    const current = currentSnap?.data ? currentSnap.data() : undefined;
    const merged = { ...(current || {}), ...allowed, id, slug: id };

    await firestoreAdmin.collection('games').doc(id).set(merged);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: { params: { id: string } | Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: idRaw } = await context.params;
    const id = idRaw.toLowerCase().trim();
    await firestoreAdmin.collection('games').doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
  }
} 