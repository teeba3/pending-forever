'use client';
import { useState } from 'react';
import { usePortal } from '@/lib/PortalContext';
import { useBugs } from '@/bugs/BugsContext';
import { Field, inputCls, btnCls } from '../Field';

// The secret rules the buggy version never reveals.
const SECRET = [
  [(p) => p.length === 9, 'exactly 9 characters'],
  [(p) => /[^A-Za-z0-9]/.test(p), 'at least one symbol'],
  [(p) => !/[A-Z]/.test(p), 'no capital letters'],
  [(p) => /\d/.test(p), 'at least one number'],
];

export default function Step2Account() {
  const { form, update, next, say } = usePortal();
  const { isOn, trigger } = useBugs();
  const [error, setError] = useState('');
  const [activated, setActivated] = useState(false);

  const register = () => {
    const missing = SECRET.filter(([ok]) => !ok(form.password)).map(([, m]) => m);
    if (missing.length) {
      if (isOn('silent-pass')) { setError('Invalid Password Format'); trigger('silent-pass', 'No reason given'); say('password'); }
      else setError(`Password needs: ${missing.join(', ')}.`);
      return;
    }
    setError('');
    setActivated(true);
    if (isOn('ghost-active')) { trigger('ghost-active', 'Activated without email verification'); say('ghost'); }
  };

  return (
    <div>
      <Field label="Email (used as username)"><input className={inputCls} value={form.email} readOnly /></Field>
      <Field label="Password" error={error}>
        <input type="password" className={inputCls} value={form.password} onChange={(e) => update({ password: e.target.value })} />
      </Field>
      {!activated && <button className={btnCls} onClick={register}>Create account</button>}
      {activated && (
        <div className="mt-2">
          {isOn('ghost-active')
            ? <p className="bg-emerald-600 p-2 font-bold">✅ Account activated successfully! <span className="font-normal text-xs">(you never opened your inbox)</span></p>
            : <p className="bg-amber-500 text-slate-900 p-2 font-bold">📧 Account created. Click the link we emailed to activate it.</p>}
          <button className={`${btnCls} mt-3`} onClick={next}>Continue →</button>
        </div>
      )}
    </div>
  );
}
