'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAddGame() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\-\s]/g, '').replace(/\s+/g, '-').slice(0, 80) || 'game';

  const onSave = async () => {
    setError(null);
    if (!title || !description || !html) { setError('All fields are required'); return; }
    setLoading(true);
    try {
      const slug = slugify(title);
      const res = await fetch('/api/admin/games', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title, description, html })
      });
      if (!res.ok) throw new Error(await res.text());
      setOpen(false);
      setTitle(''); setDescription(''); setHtml('');
      router.refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <button className="btn-primary" onClick={() => setOpen(true)}>Add a new game</button>
      {open && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4" onClick={()=>setOpen(false)}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4" onClick={(e)=>e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-3">Add a new game</h3>
            <div className="space-y-2">
              <input className="border rounded p-2 w-full text-black placeholder-gray-500" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
              <input className="border rounded p-2 w-full text-black placeholder-gray-500" placeholder="Short description" value={description} onChange={(e)=>setDescription(e.target.value)} />
              <textarea className="border rounded p-2 w-full min-h-[220px] font-mono text-black placeholder-gray-500" placeholder="Paste full HTML (with inline CSS/JS)" value={html} onChange={(e)=>setHtml(e.target.value)} />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-2">
                <button className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200" onClick={()=>setOpen(false)} disabled={loading}>Cancel</button>
                <button className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50" onClick={onSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 