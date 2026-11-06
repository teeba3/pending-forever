'use client';
import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useBugs } from '@/bugs/BugsContext';
import { Field, inputCls, btnCls } from '../ui';
import HumanCheck from '../HumanCheck';

export function LoginView() {
  const { view, login, go } = useApp();
  const { isOn, trigger } = useBugs();
  const [u, setU] = useState(''); const [p, setP] = useState(''); const [human, setHuman] = useState(false);
  const [tries, setTries] = useState(0); const [err, setErr] = useState({ all: '', u: '', p: '', h: '' });

  const fail = (e) => { setErr({ all: '', u: '', p: '', h: '', ...e }); if (isOn('generic-login')) setHuman(false); };  // bug: checkbox un-ticks itself

  const submit = (e) => {
    e.preventDefault();
    const n = tries + 1; setTries(n);
    if (!human) return fail({ h: 'يرجى تأكيد أنك لست روبوتاً' });
    if (isOn('generic-login')) {
      if (!u || !p || n === 1) { trigger('generic-login', 'No hint which field is wrong'); return fail({ all: 'اسم المستخدم أو كلمة المرور غير صحيحة' }); }
    } else if (!u || !p) return fail({ u: u ? '' : 'أدخل اسم المستخدم', p: p ? '' : 'أدخل كلمة المرور' });

    login({ name: u });
  };
  return (
    <form onSubmit={submit} className="bg-white border border-slate-300 p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-green-900 mb-4">تسجيل الدخول</h2>
      {view.msg && <p className="bg-yellow-50 border border-yellow-500 p-2 text-sm mb-3">{view.msg}</p>}
      {err.all && <p className="bg-red-50 border border-red-500 text-red-700 p-2 text-sm mb-3">{err.all}<br /><span className="text-xs text-red-400" dir="ltr">Error 0x80070057 — Reference: unknown</span></p>}
      <Field label="اسم المستخدم / الرقم الوطني" error={err.u}><input className={inputCls} value={u} onChange={(e) => setU(e.target.value)} /></Field>
      <Field label="كلمة المرور" error={err.p}><input type="password" className={inputCls} value={p} onChange={(e) => setP(e.target.value)} /></Field>
      <HumanCheck checked={human} onChange={setHuman} error={err.h} />
      <button className={btnCls}>دخول</button>
      <p className="text-sm mt-3">ليس لديك حساب؟ <button type="button" className="text-green-800 underline" onClick={() => go('register')}>سجّل الآن</button></p>
    </form>
  );
}

// Password rules. The buggy version never reveals them; the fixed version lists what is missing.
const RULES = [
  [(p) => p.length >= 8, '8 أحرف على الأقل'],
  [(p) => /[A-Z]/.test(p), 'حرف كبير (A-Z)'],
  [(p) => /[a-z]/.test(p), 'حرف صغير (a-z)'],
  [(p) => /\d/.test(p), 'رقم واحد على الأقل'],
  [(p) => /[^A-Za-z0-9]/.test(p), 'رمز واحد على الأقل (مثل ! @ #)'],
  [(p) => !/(.)\1\1/.test(p), 'بدون تكرار الحرف نفسه أكثر من مرتين متتاليتين (مثل 000 أو 2222)'],
];

export function RegisterView() {
  const { go } = useApp();
  const { isOn, trigger } = useBugs();
  const [f, setF] = useState({ name: '', email: '', phone: '', pw: '' });
  const [human, setHuman] = useState(false);
  const [err, setErr] = useState(''); const [herr, setHerr] = useState(''); const [done, setDone] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setHerr('');
    if (!human) return setHerr('يرجى تأكيد أنك لست روبوتاً');
    const miss = RULES.filter(([ok]) => !ok(f.pw)).map(([, m]) => m);
    if (miss.length) {
      if (isOn('silent-pass')) { trigger('silent-pass', 'No reason given'); setHuman(false); return setErr('صيغة كلمة المرور غير صحيحة'); }  // bug: checkbox un-ticks
      return setErr('كلمة المرور تحتاج إلى: ' + miss.join('، '));
    }
    setErr('');
    setDone(true);
    if (isOn('ghost-active')) trigger('ghost-active', 'Activated before email verification');
  };
  if (done) return (
    <div className="bg-white border border-slate-300 p-6 max-w-md mx-auto">
      {isOn('ghost-active')
        ? <p className="bg-green-100 border border-green-600 p-3 font-bold">✅ تم تفعيل الحساب بنجاح!</p>
        : <p className="bg-yellow-50 border border-yellow-600 p-3 font-bold">📧 أُرسل رابط التفعيل إلى بريدك. فعّل الحساب ثم سجّل الدخول.</p>}
      <button className={`${btnCls} mt-4`} onClick={() => go('login')}>تسجيل الدخول</button>
    </div>
  );
  return (
    <form onSubmit={submit} className="bg-white border border-slate-300 p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-green-900 mb-4">إنشاء حساب جديد</h2>
      <Field label="الاسم الكامل"><input className={inputCls} value={f.name} onChange={set('name')} /></Field>
      <Field label="البريد الإلكتروني"><input className={inputCls} value={f.email} onChange={set('email')} /></Field>
      <Field label="رقم الهاتف"><input className={inputCls} value={f.phone} onChange={set('phone')} /></Field>
      <Field label="كلمة المرور" error={err} hint={isOn('silent-pass') ? '' : 'على الأقل 8 أحرف، حرف كبير وصغير، رقم، رمز، ولا يتكرر الحرف نفسه أكثر من مرتين متتاليتين'}><input type="password" className={inputCls} value={f.pw} onChange={set('pw')} /></Field>
      <HumanCheck checked={human} onChange={setHuman} error={herr} />
      <button className={btnCls}>إنشاء الحساب</button>
    </form>
  );
}
