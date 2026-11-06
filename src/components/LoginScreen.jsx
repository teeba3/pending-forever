'use client';
import { useState } from 'react';
import { usePortal } from '@/lib/PortalContext';
import { useBugs } from '@/bugs/BugsContext';
import { Field, inputCls, btnCls } from './Field';

export default function LoginScreen() {
  const { session, login, say } = usePortal();
  const { isOn, trigger } = useBugs();
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const terminated = session === 'terminated';

  const submit = () => {
    const n = attempts + 1; setAttempts(n);
    if (isOn('generic-login')) {
      // BUG: same vague message for empty fields AND for a correct first try.
      if (!u || !p || n === 1) { setError('Invalid user name or password'); trigger('generic-login', 'No hint which field is wrong'); say('login'); return; }
    } else {
      if (!u) return setError('Username is required.');
      if (!p) return setError('Password is required.');
    }
    setError(''); login();
  };

  return (
    <section className="bg-slate-800 border-2 border-slate-600 p-5 max-w-md mx-auto">
      {terminated ? (
        <div className="bg-red-500/20 border-2 border-red-500 p-3 mb-4">
          <b className="text-red-400">SESSION TERMINATED</b>
          <p className="text-sm">Your session has ended for security reasons. All progress has been deleted. Please log in again.</p>
        </div>
      ) : <p className="mb-4 text-slate-300">Log in to start your application. It will take 5 minutes. (It will not.)</p>}
      {error && <div className="bg-red-500 text-white font-bold p-2 mb-4">⚠ {error}</div>}
      <Field label="Username / National ID"><input className={inputCls} value={u} onChange={(e) => setU(e.target.value)} /></Field>
      <Field label="Password"><input type="password" className={inputCls} value={p} onChange={(e) => setP(e.target.value)} /></Field>
      <button className={btnCls} onClick={submit}>Log in</button>
    </section>
  );
}
