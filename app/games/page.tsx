import Link from 'next/link';
import { Gamepad2, Play, Star } from 'lucide-react';

import { firestoreAdmin } from '@/lib/server/firebaseAdmin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import GameAdminActions from '@/components/games/GameAdminActions';
import AdminAddGame from '@/components/games/AdminAddGame';

async function fetchDynamicGames() {
  try {
    const snapshot = await firestoreAdmin.collection('games').orderBy('createdAt', 'desc').get();
    const items = snapshot.docs.map((d: any) => {
      const data = d.data();
      return { id: data.id, title: data.title, description: data.description, url: `/games/${data.slug}`, isDynamic: true };
    });
    return items as Array<{ id: string; title: string; description: string; url: string; isDynamic?: boolean }>;
  } catch {
    return [] as Array<{ id: string; title: string; description: string; url: string; isDynamic?: boolean }>;
  }
}

export default async function GamesPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === 'admin';
  const dynamicGames = await fetchDynamicGames();
  const staticGames = [
    {
      id: 'ping-pong',
      title: 'Ping Pong',
      description: 'Classic ping pong game with modern controls and smooth gameplay. Challenge yourself with increasing difficulty levels.',
      imageUrl: '/images/games/ping-pong.jpg',
      gameUrl: '/games/ping-pong',
      category: 'Arcade',
      featured: true,
      difficulty: 'Easy',
      playCount: 1250
    },
    {
      id: 'geometry-dash',
      title: 'Geometry Dash',
      description: 'Navigate through geometric obstacles in this rhythm-based platformer. Test your reflexes and timing skills.',
      imageUrl: '/images/games/geometry-dash.jpg',
      gameUrl: '/games/geometry-dash',
      category: 'Platformer',
      featured: true,
      difficulty: 'Medium',
      playCount: 890
    },
    {
      id: 'polytrack',
      title: 'Polytrack',
      description: 'A unique puzzle game where you connect polygonal tracks to guide objects to their destination.',
      imageUrl: '/images/games/polytrack.jpg',
      gameUrl: '/games/polytrack',
      category: 'Puzzle',
      featured: true,
      difficulty: 'Hard',
      playCount: 567
    },
    {
      id: 'math-quiz',
      title: 'Math Quiz',
      description: 'Test your mathematical skills with interactive quizzes covering various topics and difficulty levels.',
      imageUrl: '/images/games/math-quiz.jpg',
      gameUrl: '/games/math-quiz',
      category: 'Educational',
      featured: false,
      difficulty: 'Variable',
      playCount: 432
    },
    {
      id: 'word-scramble',
      title: 'Word Scramble',
      description: 'Unscramble letters to form words. Perfect for improving vocabulary and spelling skills.',
      imageUrl: '/images/games/word-scramble.jpg',
      gameUrl: '/games/word-scramble',
      category: 'Educational',
      featured: false,
      difficulty: 'Easy',
      playCount: 321
    },
    {
      id: 'memory-match',
      title: 'Memory Match',
      description: 'Classic memory card game with educational themes. Match pairs to improve concentration.',
      imageUrl: '/images/games/memory-match.jpg',
      gameUrl: '/games/memory-match',
      category: 'Educational',
      featured: false,
      difficulty: 'Easy',
      playCount: 298
    }
  ];

  // Merge dynamic into All Games (dynamic first), remove the "Newly Added" section
  // Filter out statics that are hidden
  const hiddenRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/games/hidden`, { cache: 'no-store' }).then(r => r.ok ? r.json() : { ids: [] as string[] }).catch(() => ({ ids: [] as string[] }));
  const hiddenIds: string[] = hiddenRes.ids || [];

  const allGames = [
    ...dynamicGames.map(g => ({ id: g.id, title: g.title, description: g.description, gameUrl: g.url, isDynamic: true })),
    ...staticGames.filter(s => !hiddenIds.includes(s.id))
  ];

  const categories = ['All', 'Arcade', 'Platformer', 'Puzzle', 'Educational'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Variable'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Educational Games
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Learn while having fun with our collection of interactive educational games
        </p>
      </div>

      {isAdmin && (
        <AdminAddGame />
      )}

      {/* Featured Games */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Star className="h-6 w-6 text-yellow-500" />
          Featured Games
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {staticGames.filter(game => game.featured).map((game) => (
            <div key={game.id} className="card group hover:shadow-lg transition-all duration-200">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <Gamepad2 className="h-12 w-12 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {game.title}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                    {game.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {game.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {game.playCount} plays
                  </span>
                  <Link
                    href={game.gameUrl}
                    className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Play Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Games */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          All Games
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allGames.map((game) => (
            <div key={game.id} className="card group hover:shadow-lg transition-all duration-200">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <Gamepad2 className="h-12 w-12 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {game.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {game.description}
                </p>
                <div className="flex items-center justify-between">
                  <Link
                    href={(game as any).gameUrl || (game as any).url || '#'}
                    className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Play Now
                  </Link>
                </div>
                {isAdmin && (
                  <GameAdminActions id={game.id} initialTitle={game.title} initialDescription={game.description} isStatic={!((game as any).isDynamic)} />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Game Categories Info */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Game Categories
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Arcade</h3>
            <p className="text-sm text-gray-600">
              Fast-paced action games to test your reflexes
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Platformer</h3>
            <p className="text-sm text-gray-600">
              Jump and navigate through challenging levels
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Puzzle</h3>
            <p className="text-sm text-gray-600">
              Brain teasers and logic challenges
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Educational</h3>
            <p className="text-sm text-gray-600">
              Learn while playing fun educational games
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 