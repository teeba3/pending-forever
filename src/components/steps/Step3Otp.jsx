'use client';
import { useEffect, useRef, useState } from 'react';
import { usePortal } from '@/lib/PortalContext';
import { useBugs } from '@/bugs/BugsContext';
import { Field, inputCls, btnCls, btn2Cls } from '../Field';

const gen = () => String(Math.floor(100000 + Math.random() * 900000));
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function Step3Otp() {
  const { next, say } = usePortal();
  const { isOn, trigger } = useBugs();
  const first = useRef(gen());
  const [latest, setLatest] = useState(first.current);
  const [resent, setResent] = useState(false);
  const [left, setLeft] = useState(120);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  useEffect(() => { const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, []);

  const resend = () => {
    setLatest(gen()); setResent(true); setError('');
    if (isOn('otp-time')) { setLeft(0); trigger('otp-time', 'Timer starts at 00:00'); say('otp'); } // BUG: born expired
    else setLeft(120);
  };

  const verify = () => {
    // BUG: once you resend, only the OLD code is accepted. FIX: the latest code works.
    const valid = isOn('otp-time') ? code === first.current : code === latest;
    if (valid) { setOk(true); return; }
    setError(isOn('otp-time') ? 'Invalid code. Note: Old codes work better than new codes.' : 'Invalid code. Check the latest SMS.');
    if (isOn('otp-time')) trigger('otp-time', 'Latest code rejected');
  };

  const expiredMsg = resent && isOn('otp-time');
  return (
    <div>
      <p className="mb-2 text-sm text-slate-300">📱 Simulated SMS inbox: <b className="text-amber-300">{resent && isOn('otp-time') ? `${latest} (new)` : latest}</b>{resent && isOn('otp-time') && <span className="text-slate-500"> · earlier: {first.current}</span>}</p>
      <p className={`font-mono text-2xl mb-1 ${left === 0 ? 'text-red-400' : 'text-amber-300'}`}>{mmss(left)}</p>
      {expiredMsg && <p className="text-red-400 text-sm mb-2">Code expired 3 minutes ago</p>}
      <Field label="Verification code" error={error}><input className={inputCls} value={code} onChange={(e) => setCode(e.target.value)} /></Field>
      <div className="flex gap-2">
        <button className={btnCls} onClick={verify}>Verify</button>
        <button className={btn2Cls} onClick={resend}>Resend code</button>
      </div>
      {ok && <div className="mt-3"><p className="text-emerald-400">✔ Verified.</p><button className={`${btnCls} mt-2`} onClick={next}>Continue →</button></div>}
    </div>
  );
}
