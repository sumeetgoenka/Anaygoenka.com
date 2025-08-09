'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  id: string;
  initialTitle: string;
  initialDescription: string;
  isStatic?: boolean;
}

export default function GameAdminActions({ id, initialTitle, initialDescription, isStatic }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async () => {
    if (!confirm(isStatic ? 'Hide this built-in game?' : 'Delete this game?')) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(isStatic ? `/api/admin/games/hidden/${id}` : `/api/admin/games/${id}`, { method: isStatic ? 'POST' : 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/games/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, html: html || undefined }),
      });
      if (!res.ok) throw new Error(await res.text());
      setIsEditing(false);
      setHtml('');
      router.refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 space-x-2">
      {!isEditing ? (
        <>
          <button className="px-2 py-1 text-xs rounded bg-yellow-500 text-white hover:opacity-90 disabled:opacity-50" onClick={() => setIsEditing(true)} disabled={loading}>Edit</button>
          <button className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:opacity-90 disabled:opacity-50" onClick={onDelete} disabled={loading}>Delete</button>
        </>
      ) : (
        <div className="space-y-2 border rounded p-3">
          <div className="grid gap-1">
            <label className="text-xs text-gray-600">Title</label>
            <input className="border rounded p-2 text-black placeholder-gray-500" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-1">
            <label className="text-xs text-gray-600">Description</label>
            <input className="border rounded p-2 text-black placeholder-gray-500" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-1">
            <label className="text-xs text-gray-600">HTML (optional, leave blank to keep current)</label>
            <textarea className="border rounded p-2 text-black placeholder-gray-500 min-h-[120px] font-mono" value={html} onChange={(e) => setHtml(e.target.value)} placeholder="Paste full HTML if you want to replace the current code" />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="space-x-2">
            <button className="px-3 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300" onClick={() => { setIsEditing(false); setHtml(''); }} disabled={loading}>Cancel</button>
            <button className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:opacity-90 disabled:opacity-50" onClick={onSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      )}
    </div>
  );
} 