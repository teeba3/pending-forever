'use client';
import { useState } from 'react';
import { BUGS } from '@/bugs/registry';
import { useBugs } from '@/bugs/BugsContext';
import { useApp } from '@/lib/AppContext';

/** Dev panel: flip each problem to its fixed version, watch what triggered. Small on purpose, so the site stays realistic. */
export default function BugPanel() {
  const [open, setOpen] = useState(false);
  const { isOn, toggle, setAll, log, toast, alerts, setAlerts } = useBugs();
  const { expireNow } = useApp();
  return (
    <div dir="ltr">
      {alerts && toast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[60] bg-red-600 text-white font-bold px-4 py-2 shadow-xl text-sm">
          🐛 {toast.title}{toast.detail && <span className="font-normal"> — {toast.detail}</span>}
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="fixed top-1 right-1 z-[60] opacity-60 hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded">
        🛠 Bugs {log.length}
      </button>
      {open && (
        <aside className="fixed top-8 right-1 z-[60] w-80 max-h-[80vh] overflow-auto bg-slate-900 text-slate-100 border border-slate-500 p-3 text-sm">
          <div className="flex flex-wrap gap-2 mb-2">
            <button onClick={() => setAll(true)} className="bg-red-600 px-2 py-1 text-xs">All BUGGY</button>
            <button onClick={() => setAll(false)} className="bg-emerald-600 px-2 py-1 text-xs">All FIXED</button>
            <button onClick={expireNow} className="bg-amber-500 text-black px-2 py-1 text-xs">Expire session now</button>
          </div>
          <label className="flex gap-2 text-xs mb-2"><input type="checkbox" checked={alerts} onChange={(e) => setAlerts(e.target.checked)} /> Show red alert when a bug triggers</label>
          {BUGS.map((b) => (
            <label key={b.id} className="flex items-start gap-2 py-1 border-b border-slate-700 cursor-pointer">
              <input type="checkbox" checked={isOn(b.id)} onChange={() => toggle(b.id)} className="mt-1" />
              <span><b>{b.title}</b><br /><span className="text-slate-400 text-xs">{isOn(b.id) ? 'buggy' : `fixed: ${b.fix}`}</span></span>
            </label>
          ))}
          <h4 className="mt-3 font-bold text-amber-300">Triggered</h4>
          {log.length === 0 && <p className="text-slate-500 text-xs">Nothing yet…</p>}
          {log.map((l, i) => <p key={i} className="text-xs text-slate-300">{l.at} · {l.title} {l.detail && `(${l.detail})`}</p>)}
        </aside>
      )}
    </div>
  );
}
