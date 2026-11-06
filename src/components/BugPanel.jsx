'use client';
import { useState } from 'react';
import { BUGS } from '@/bugs/registry';
import { useBugs } from '@/bugs/BugsContext';

/** Dev panel: toggle each bug to its fixed version and watch what triggered. */
export default function BugPanel() {
  const [open, setOpen] = useState(false);
  const { isOn, toggle, setAll, log, toast } = useBugs();
  return (
    <>
      {toast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white font-bold px-4 py-2 border-2 border-red-900 shadow-xl">
          🐛 BUG TRIGGERED: {toast.title}{toast.detail && <span className="font-normal"> — {toast.detail}</span>}
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="fixed bottom-4 left-4 z-40 bg-slate-800 border-2 border-slate-500 px-3 py-2 text-sm hover:border-amber-400">
        🛠 Bug Detector ({log.length})
      </button>
      {open && (
        <aside className="fixed bottom-16 left-4 z-40 w-80 max-h-[70vh] overflow-auto bg-slate-900 border-2 border-amber-400 p-3 text-sm">
          <div className="flex gap-2 mb-2">
            <button onClick={() => setAll(true)} className="bg-red-500 px-2 py-1 text-xs">All bugs ON</button>
            <button onClick={() => setAll(false)} className="bg-emerald-600 px-2 py-1 text-xs">All FIXED</button>
          </div>
          {BUGS.map((b) => (
            <label key={b.id} className="flex items-start gap-2 py-1 border-b border-slate-700 cursor-pointer">
              <input type="checkbox" checked={isOn(b.id)} onChange={() => toggle(b.id)} className="mt-1" />
              <span><b>{b.title}</b><br /><span className="text-slate-400">{isOn(b.id) ? 'Bug active' : `Fixed: ${b.fix}`}</span></span>
            </label>
          ))}
          <h4 className="mt-3 font-bold text-amber-300">Triggered</h4>
          {log.length === 0 && <p className="text-slate-500">Nothing yet…</p>}
          {log.map((l, i) => <p key={i} className="text-xs text-slate-300">{l.at} · {l.title} {l.detail && `(${l.detail})`}</p>)}
        </aside>
      )}
    </>
  );
}
