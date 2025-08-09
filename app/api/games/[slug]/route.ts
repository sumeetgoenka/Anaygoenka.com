import { NextRequest, NextResponse } from 'next/server';
import { firestoreAdmin } from '@/lib/server/firebaseAdmin';

function injectControls(html: string) {
  const script = `\n<script>\n(function(){\n  function setMuted(m) {\n    try {\n      document.querySelectorAll('audio, video').forEach(function(el){\n        el.muted = m;\n        try { el.volume = m ? 0 : 1; } catch(e){}\n        if (!m) { try { el.play && el.play(); } catch(e){} }\n      });\n    } catch(e){}\n  }\n  window.addEventListener('message', function(e){\n    var data = e && e.data;\n    if (!data || typeof data.type !== 'string') return;\n    if (data.type === 'AG_MUTE') setMuted(true);\n    if (data.type === 'AG_UNMUTE') setMuted(false);\n  });\n})();\n</script>`;
  if (html.includes('</body>')) return html.replace('</body>', script + '</body>');
  return html + script;
}

export async function GET(_req: NextRequest, context: { params: { slug: string } | Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const doc = await firestoreAdmin.collection('games').doc(slug).get();
    if (!doc.exists) return new NextResponse('Not found', { status: 404 });
    const data = doc.data() as { html: string } | undefined;
    const html = injectControls(data?.html || '');

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
    return new NextResponse('Failed to load game', { status: 500 });
  }
} 