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
    const body = await req.json();
    const id = (body?.id || `${Date.now()}`).toString();
    const data = {
      id,
      title: body.title,
      subject: body.subject,
      description: body.description,
      yearGroup: body.yearGroup,
      dueDate: body.dueDate,
      isLive: Boolean(body.isLive),
      createdAt: Date.now(),
      updatedAt: Date.now(),
             createdBy: session.user.email || 'admin',
       imageUrl: body.imageUrl || undefined,
    };

    if (!data.title || !data.subject || !data.yearGroup || !data.dueDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await firestoreAdmin.collection('homework').doc(id).set(data);
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to save homework' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const snapshot = await firestoreAdmin.collection('homework').orderBy('createdAt', 'desc').get();
    const items = snapshot.docs.map((d: any) => d.data());
    return NextResponse.json({ homework: items });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to list homework' }, { status: 500 });
  }
} 