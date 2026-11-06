'use client';
import { useEffect, useState } from 'react';
import { usePortal } from '@/lib/PortalContext';
import { TICKER } from '@/lib/taunts';

export default function HelpBot() {
  const { bot } = usePortal();
  const [i, setI] = useState(0);
  const [msg, setMsg] = useState(TICKER[0]);
  const [open, setOpen] = useState(true);

  useEffect(() => { const t = setInterval(() => setI((n) => n + 1), 8000); return () => clearInterval(t); }, []);
  useEffect(() => { setMsg(TICKER[i % TICKER.length]); }, [i]);
  useEffect(() => { if (bot) { setMsg(bot.text); setOpen(true); } }, [bot]);

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-xs">
      {open && (
        <div className="bg-slate-800 border-2 border-amber-400 p-3 mb-2 text-sm shadow-lg">
          <b className="text-amber-300">HelpBot 3000:</b> {msg}
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="float-right bg-amber-400 text-slate-900 rounded-full w-12 h-12 text-2xl border-2 border-amber-700" aria-label="Help bot">🤖</button>
    </div>
  );
}
