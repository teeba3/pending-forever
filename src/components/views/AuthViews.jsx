'use client';
import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useBugs } from '@/bugs/BugsContext';
import { Field, inputCls, btnCls } from '../ui';

export function LoginView() {
  const { view, login, go } = useApp();
  const { isOn, trigger } = useBugs();
  const [u, setU] = useState(''); const [p, setP] = useState('');
  const [tries, setTries] = useState(0); const [err, setErr] = useState({ all: '', u: '', p: '' });

  const submit = (e) => {
    e.preventDefault();
    const n = tries + 1; setTries(n);
    if (isOn('generic-login')) {
      if (!u || !p || n === 1) { trigger('generic-login', 'No hint which field is wrong'); return setErr({ all: 'اسم المستخدم أو كلمة المرور غير صحيحة', u: '', p: '' }); }
    } else {
      if (!u || !p) return setErr({ all: '', u: u ? '' : 'أدخل اسم المستخدم', p: p ? '' : 'أدخل كلمة المرور' });
    }
    login({ name: u });
  };
  return (
    <form onSubmit={submit} className="bg-white border border-slate-300 p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-green-900 mb-4">تسجيل الدخول</h2>
      {view.msg && <p className="bg-yellow-50 border border-yellow-500 p-2 text-sm mb-3">{view.msg}</p>}
      {err.all && <p className="bg-red-50 border border-red-500 text-red-700 p-2 text-sm mb-3">{err.all}</p>}
      <Field label="اسم المستخدم / الرقم الوطني" error={err.u}><input className={inputCls} value={u} onChange={(e) => setU(e.target.value)} /></Field>
      <Field label="كلمة المرور" error={err.p}><input type="password" className={inputCls} value={p} onChange={(e) => setP(e.target.value)} /></Field>
      <button className={btnCls}>دخول</button>
      <p className="text-sm mt-3">ليس لديك حساب؟ <button type="button" className="text-green-800 underline" onClick={() => go('register')}>سجّل الآن</button></p>
    </form>
  );
}

// Hidden rules the buggy version never reveals.
const RULES = [
  [(p) => p.length === 9, 'تتكون من 9 أحرف بالضبط'],
  [(p) => /[^A-Za-z0-9]/.test(p), 'تحتوي رمزاً واحداً على الأقل'],
  [(p) => !/[A-Z]/.test(p), 'بدون أحرف كبيرة'],
  [(p) => /\d/.test(p), 'تحتوي رقماً واحداً على الأقل'],
];

export function RegisterView() {
  const { go } = useApp();
  const { isOn, trigger } = useBugs();
  const [f, setF] = useState({ name: '', email: '', phone: '', pw: '' });
  const [err, setErr] = useState(''); const [done, setDone] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const miss = RULES.filter(([ok]) => !ok(f.pw)).map(([, m]) => m);
    if (miss.length) {
      if (isOn('silent-pass')) { trigger('silent-pass', 'No reason given'); return setErr('صيغة كلمة المرور غير صحيحة'); }
      return setErr('يجب أن تكون كلمة المرور: ' + miss.join('، '));
    }
    setErr(''); setDone(true);
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
      <Field label="كلمة المرور" error={err}><input type="password" className={inputCls} value={f.pw} onChange={set('pw')} /></Field>
      <button className={btnCls}>إنشاء الحساب</button>
    </form>
  );
}
