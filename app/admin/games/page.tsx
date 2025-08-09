"use client";

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGamesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user || session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\-\s]/g, '').replace(/\s+/g, '-').slice(0, 80) || 'game';

  const save = async () => {
    setError(null);
    setResultUrl(null);
    const slug = slugify(name);
    if (!slug || !name || !description || !code) { setError('Name, description, and code are required.'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title: name, description, html: code }),
      });
      if (!res.ok) throw new Error(await res.text());
      setResultUrl(`/games/${slug}`);
      setShowForm(false);
      setName(''); setDescription(''); setCode('');
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Games</h1>

      <button
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => setShowForm(true)}
      >
        Add a new game
      </button>

      {resultUrl && (
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          Saved. View it at <a className="text-green-700 underline" href={resultUrl}>{resultUrl}</a>
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>
      )}

      {showForm && (
        <div className="space-y-3 p-4 border rounded-lg">
          <div className="grid gap-2">
            <label className="font-medium">Game name</label>
                         <input
               className="border rounded p-2 text-black placeholder-gray-500"
               placeholder="e.g., pingpong"
               value={name}
               onChange={(e) => setName(e.target.value)}
             />
          </div>
          <div className="grid gap-2">
            <label className="font-medium">Short description</label>
                         <input
               className="border rounded p-2 text-black placeholder-gray-500"
               placeholder="One-liner for the games page"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
             />
          </div>
          <div className="grid gap-2">
            <label className="font-medium">Game code (HTML/CSS/JS together)</label>
                         <textarea
               className="border rounded p-2 min-h-[300px] font-mono text-black placeholder-gray-500"
               placeholder="Paste full HTML that may include inline <style> and <script>"
               value={code}
               onChange={(e) => setCode(e.target.value)}
             />
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => setShowForm(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              onClick={save}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save game'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 