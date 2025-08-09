"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [code, setCode] = useState('');
  const [savingGame, setSavingGame] = useState(false);
  const [gameMsg, setGameMsg] = useState<string | null>(null);

  const [hwTitle, setHwTitle] = useState('');
  const [hwSubject, setHwSubject] = useState('');
  const [hwYear, setHwYear] = useState('');
  const [hwDue, setHwDue] = useState('');
  const [hwDesc, setHwDesc] = useState('');
  const [hwImage, setHwImage] = useState('');
  const [savingHw, setSavingHw] = useState(false);
  const [hwMsg, setHwMsg] = useState<string | null>(null);

  const [aiTitle, setAiTitle] = useState('');
  const [aiSlug, setAiSlug] = useState('');
  const [aiDesc, setAiDesc] = useState('');
  const [aiEmbed, setAiEmbed] = useState('');
  const [savingAI, setSavingAI] = useState(false);
  const [aiMsg, setAiMsg] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user || session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\-\s]/g, '').replace(/\s+/g, '-').slice(0, 80) || 'item';

  async function addGame() {
    setGameMsg(null);
    if (!name || !desc || !code) { setGameMsg('Name, description, and code required'); return; }
    setSavingGame(true);
    try {
      const slug = slugify(name);
      const res = await fetch('/api/admin/games', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title: name, description: desc, html: code }),
      });
      if (!res.ok) throw new Error(await res.text());
      setGameMsg(`Saved. View at /games/${slug}`);
      setName(''); setDesc(''); setCode('');
    } catch (e: any) {
      setGameMsg(e?.message || 'Failed to save');
    } finally { setSavingGame(false); }
  }

  async function addHomework() {
    setHwMsg(null);
    if (!hwTitle || !hwSubject || !hwYear || !hwDue) { setHwMsg('Title, Subject, Year, Due Date required'); return; }
    setSavingHw(true);
    try {
      const res = await fetch('/api/admin/homework', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: hwTitle, subject: hwSubject, yearGroup: hwYear, dueDate: hwDue, description: hwDesc, isLive: true, imageUrl: hwImage || undefined })
      });
      if (!res.ok) throw new Error(await res.text());
      setHwMsg('Homework saved');
      setHwTitle(''); setHwSubject(''); setHwYear(''); setHwDue(''); setHwDesc(''); setHwImage('');
    } catch (e: any) {
      setHwMsg(e?.message || 'Failed to save');
    } finally { setSavingHw(false); }
  }

  async function addAssistant() {
    setAiMsg(null);
    if (!aiTitle || !aiDesc || !aiEmbed) { setAiMsg('Title, description and embed required'); return; }
    setSavingAI(true);
    try {
      const slug = slugify(aiSlug || aiTitle);
      const res = await fetch('/api/admin/assistants', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title: aiTitle, description: aiDesc, embedHtml: aiEmbed })
      });
      if (!res.ok) throw new Error(await res.text());
      setAiMsg(`Assistant saved. View at /ai-assistants/${slug}`);
      setAiTitle(''); setAiDesc(''); setAiEmbed(''); setAiSlug('');
    } catch (e: any) {
      setAiMsg(e?.message || 'Failed to save');
    } finally {
      setSavingAI(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin</h1>
        <p className="text-gray-600 mt-2">Quickly add games, homework, and AI assistants. You can browse the site normally from here.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Add a new game</h2>
          <div className="space-y-3">
            <input className="border rounded p-2 w-full text-black placeholder-gray-500" placeholder="Game name" value={name} onChange={(e)=>setName(e.target.value)} />
            <input className="border rounded p-2 w-full text-black placeholder-gray-500" placeholder="Short description" value={desc} onChange={(e)=>setDesc(e.target.value)} />
            <textarea className="border rounded p-2 w-full min-h-[220px] font-mono text-black placeholder-gray-500" placeholder="Paste full HTML (with inline CSS/JS)" value={code} onChange={(e)=>setCode(e.target.value)} />
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50" onClick={addGame} disabled={savingGame}>{savingGame ? 'Saving...' : 'Save game'}</button>
              {gameMsg && <p className="text-sm text-gray-700">{gameMsg}</p>}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Add homework</h2>
          <div className="grid gap-3">
            <input className="border rounded p-2 w-full text-black placeholder-gray-500" placeholder="Title" value={hwTitle} onChange={(e)=>setHwTitle(e.target.value)} />
            <input className="border rounded p-2 w-full text-black placeholder-gray-500" placeholder="Subject" value={hwSubject} onChange={(e)=>setHwSubject(e.target.value)} />
            <input className="border rounded p-2 w-full text-black placeholder-gray-500" placeholder="Year Group (e.g., Year 10)" value={hwYear} onChange={(e)=>setHwYear(e.target.value)} />
            <input className="border rounded p-2 w-full text-black placeholder-gray-500" type="date" placeholder="Due date" value={hwDue} onChange={(e)=>setHwDue(e.target.value)} />
            <input className="border rounded p-2 w-full text-black placeholder-gray-500" placeholder="Image URL (optional)" value={hwImage} onChange={(e)=>setHwImage(e.target.value)} />
            <textarea className="border rounded p-2 w-full min-h-[120px] text-black placeholder-gray-500" placeholder="Description (optional)" value={hwDesc} onChange={(e)=>setHwDesc(e.target.value)} />
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50" onClick={addHomework} disabled={savingHw}>{savingHw ? 'Saving...' : 'Save homework'}</button>
              {hwMsg && <p className="text-sm text-gray-700">{hwMsg}</p>}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Add AI Assistant</h2>
          <div className="grid gap-3">
            <input className="border rounded p-2 w-full text-black placeholder-gray-500" placeholder="Assistant title" value={aiTitle} onChange={(e)=>setAiTitle(e.target.value)} />
            <input className="border rounded p-2 w-full text-black placeholder-gray-500" placeholder="Slug (optional)" value={aiSlug} onChange={(e)=>setAiSlug(e.target.value)} />
            <input className="border rounded p-2 w-full text-black placeholder-gray-500" placeholder="Short description" value={aiDesc} onChange={(e)=>setAiDesc(e.target.value)} />
            <textarea className="border rounded p-2 w-full min-h-[220px] font-mono text-black placeholder-gray-500" placeholder="Paste embed HTML (iframe/script)" value={aiEmbed} onChange={(e)=>setAiEmbed(e.target.value)} />
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded bg-purple-600 text-white disabled:opacity-50" onClick={addAssistant} disabled={savingAI}>{savingAI ? 'Saving...' : 'Save assistant'}</button>
              {aiMsg && <p className="text-sm text-gray-700">{aiMsg}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 