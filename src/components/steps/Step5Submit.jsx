'use client';
import { useEffect, useState } from 'react';
import { usePortal } from '@/lib/PortalContext';
import { useBugs } from '@/bugs/BugsContext';
import { btnCls } from '../Field';

const MESSAGES = ['Processing submission...', 'Contacting server...', 'Verifying documents...', 'Almost there...', 'Processing submission...'];

export default function Step5Submit() {
  const { form, say } = usePortal();
  const { isOn, trigger } = useBugs();
  const [phase, setPhase] = useState('review');   // review | loading | done
  const [m, setM] = useState(0);
  const [ref, setRef] = useState('');

  useEffect(() => {
    if (phase !== 'loading') return;
    if (!isOn('eternal-load')) {                    // FIX: actually finish
      const t = setTimeout(() => { setRef(`GOV-${Math.floor(Math.random() * 1e8)}`); setPhase('done'); }, 1500);
      return () => clearTimeout(t);
    }
    const t = setInterval(() => setM((n) => n + 1), 4000);  // BUG: never ends
    return () => clearInterval(t);
  }, [phase, isOn]);

  const submit = () => { setPhase('loading'); if (isOn('eternal-load')) { trigger('eternal-load', 'Spinner will never resolve'); say('submit'); } };

  if (phase === 'loading') return (
    <div className="text-center py-8">
      <div className="mx-auto w-14 h-14 border-4 border-slate-600 border-t-amber-400 rounded-full animate-spin" />
      <p className="mt-4 text-amber-300">{MESSAGES[m % MESSAGES.length]}</p>
      <p className="text-xs text-slate-500">Do not close this window or press Back.</p>
    </div>
  );
  if (phase === 'done') return <p className="text-emerald-400 font-bold">✔ Submitted. Reference number: {ref}</p>;

  return (
    <div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm mb-4">
        {['name', 'nationalId', 'email', 'phone', 'birthdate', 'employment', 'governorate', 'address', 'document'].map((k) => (
          <div key={k} className="contents"><dt className="text-slate-400">{k}</dt><dd>{form[k] || '—'}</dd></div>
        ))}
      </dl>
      <button className={btnCls} onClick={submit}>Submit application</button>
    </div>
  );
}
