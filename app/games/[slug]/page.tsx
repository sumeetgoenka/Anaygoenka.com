import { notFound } from 'next/navigation';
import { firestoreAdmin } from '@/lib/server/firebaseAdmin';
import GameViewerClient from '@/components/games/GameViewerClient';

export default async function GameViewerPage({ params }: { params: { slug: string }}) {
  const slug = (await params).slug;
  const snap = await firestoreAdmin.collection('games').doc(slug).get();
  if (!snap.exists) return notFound();
  const data = snap.data();

  const gameUrl = `/api/games/${slug}`;

  return (
    <div className="space-y-6">
      <GameViewerClient slug={slug} title={data?.title || slug} src={gameUrl} />
    </div>
  );
} 