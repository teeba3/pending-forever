'use client';
import { useState } from 'react';
import { usePortal } from '@/lib/PortalContext';
import { Field, inputCls, btnCls } from './Field';

export default function LoginScreen() {
  const { session, login } = usePortal();
  const [u, setU] = useState('');
  const terminated = session === 'terminated';
  return (
    <section className="bg-slate-800 border-2 border-slate-600 p-5 max-w-md mx-auto">
      {terminated ? (
        <div className="bg-red-500/20 border-2 border-red-500 p-3 mb-4">
          <b className="text-red-400">SESSION TERMINATED</b>
          <p className="text-sm">Your session has ended for security reasons. All progress has been deleted. Please log in again.</p>
        </div>
      ) : <p className="mb-4 text-slate-300">Log in to start your application. It will take 5 minutes. (It will not.)</p>}
      <Field label="Username / National ID"><input className={inputCls} value={u} onChange={(e) => setU(e.target.value)} /></Field>
      <Field label="Password"><input type="password" className={inputCls} /></Field>
      <button className={btnCls} onClick={login}>Log in</button>
    </section>
  );
}
