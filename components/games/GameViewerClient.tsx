'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Heart, HeartOff, Maximize2, ThumbsDown, ThumbsUp, Volume2, VolumeX } from 'lucide-react';

interface GameViewerClientProps {
  slug: string;
  title?: string;
  src: string; // iframe URL
}

export default function GameViewerClient({ slug, title, src }: GameViewerClientProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  const storageKey = useMemo(() => `ag_game_state:${slug}`, [slug]);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setLiked(Boolean(parsed.liked));
        setDisliked(Boolean(parsed.disliked));
        setFavorited(Boolean(parsed.favorited));
        setMuted(parsed.muted !== false);
      }
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ liked, disliked, favorited, muted })
      );
    } catch {}
  }, [storageKey, liked, disliked, favorited, muted]);

  const postToFrame = useCallback((payload: any) => {
    const win = frameRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(payload, '*');
  }, []);

  // Send mute state on changes
  useEffect(() => {
    postToFrame({ type: muted ? 'AG_MUTE' : 'AG_UNMUTE' });
  }, [muted, postToFrame]);

  // Viewport sender
  const sendViewport = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    postToFrame({ type: 'viewport', width: Math.round(rect.width), height: Math.round(rect.height) });
  }, [postToFrame]);

  useEffect(() => {
    // initial viewport
    sendViewport();
    const onResize = () => {
      sendViewport();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [sendViewport]);

  const onToggleMute = () => {
    setMuted((m) => !m);
  };

  const onLike = () => {
    setLiked((v) => {
      const next = !v;
      if (next) setDisliked(false);
      return next;
    });
  };

  const onDislike = () => {
    setDisliked((v) => {
      const next = !v;
      if (next) setLiked(false);
      return next;
    });
  };

  const onFavorite = () => setFavorited((v) => !v);

  const enableFullscreenPermissions = () => {
    const iframe = frameRef.current as any;
    if (!iframe) return;
    // Dynamically allow fullscreen and autoplay
    iframe.setAttribute('allow', 'fullscreen; autoplay');
    try { iframe.allowFullscreen = true; } catch {}
    iframe.setAttribute('allowfullscreen', '');
  };

  const requestContainerFullscreen = async () => {
    const el = containerRef.current as any;
    if (!el) return;
    if (el.requestFullscreen) await el.requestFullscreen();
  };

  const onFullscreen = async () => {
    enableFullscreenPermissions();
    await requestContainerFullscreen();
    // Let the game know it can re-attempt fullscreen internally if it wants
    postToFrame({ type: 'AG_FULLSCREEN_READY' });
    // Send viewport once more after a tick
    setTimeout(sendViewport, 250);
  };

  return (
    <div className="space-y-4">
      {title && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}

      {/* 16:9 responsive card, max 900px or 92vw, rounded + shadow, overflow hidden */}
      <div
        ref={containerRef}
        className="relative w-[92vw] max-w-[900px] aspect-video rounded-xl border border-gray-200 shadow-md overflow-hidden bg-black"
      >
        <iframe
          ref={frameRef}
          title={title || slug}
          src={src}
          className="absolute inset-0 w-full h-full"
          // IMPORTANT: no allow / allowFullScreen initially, to block game-driven fullscreen
        />

        {/* Overlay controls bar */}
        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap items-center gap-2 p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
          <button
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={onLike}
            className={`px-2 py-1 rounded border text-xs sm:text-sm flex items-center gap-1 ${liked ? 'bg-green-100 border-green-300 text-green-800' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>Like</span>
          </button>
          <button
            aria-label={disliked ? 'Remove dislike' : 'Dislike'}
            onClick={onDislike}
            className={`px-2 py-1 rounded border text-xs sm:text-sm flex items-center gap-1 ${disliked ? 'bg-red-100 border-red-300 text-red-800' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            <ThumbsDown className="h-4 w-4" />
            <span>Dislike</span>
          </button>
          <button
            aria-label={favorited ? 'Unfavorite' : 'Favorite'}
            onClick={onFavorite}
            className={`px-2 py-1 rounded border text-xs sm:text-sm flex items-center gap-1 ${favorited ? 'bg-pink-100 border-pink-300 text-pink-800' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            {favorited ? <Heart className="h-4 w-4" /> : <HeartOff className="h-4 w-4" />}
            <span>{favorited ? 'Favorited' : 'Favorite'}</span>
          </button>
          <button
            aria-label="Fullscreen"
            onClick={onFullscreen}
            className="px-2 py-1 rounded border text-xs sm:text-sm flex items-center gap-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Maximize2 className="h-4 w-4" />
            <span>Fullscreen</span>
          </button>
          <button
            aria-label={muted ? 'Unmute' : 'Mute'}
            onClick={onToggleMute}
            className="px-2 py-1 rounded border text-xs sm:text-sm flex items-center gap-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span>{muted ? 'Muted' : 'Sound on'}</span>
          </button>
        </div>
      </div>
    </div>
  );
} 