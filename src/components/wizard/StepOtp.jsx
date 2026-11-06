'use client';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useBugs } from '@/bugs/BugsContext';
import { code6, mmss, rand } from '@/lib/utils';
import { Field, inputCls, btnCls, btn2Cls } from '../ui';

export default function StepOtp() {
  const { wiz, setStep } = useApp();
  const { isOn, trigger } = useBugs();
  const bug = isOn('otp');
  const first = useRef(null); const [latest, setLatest] = useState(null);
  const [sms, setSms] = useState(null); const [sending, setSending] = useState(false);
  const [left, setLeft] = useState(null); const [lateTag, setLateTag] = useState(false);
  const [val, setVal] = useState(''); const [err, setErr] = useState('');
  const phone = wiz.form.phone || '07700000000';
  const masked = bug ? `07*******${String(10 + rand(89))}` : `07*******${phone.slice(-2)}`;   // BUG: wrong last digits

  useEffect(() => { if (left === null) return; const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(id); }, [left === null]);

  const send = () => {
    setSending(true); setErr('');
    const c = code6();
    setTimeout(() => {
      if (!first.current) first.current = c;
      setLatest(c); setSending(false); setSms(c);
      if (bug) { setLeft(0); setLateTag(true); trigger('otp', 'Code arrived already expired'); } else { setLeft(120); setLateTag(false); }
    }, bug ? 4000 : 800);
  };
  const verify = () => {
    // BUG: only the FIRST code ever sent is accepted.
    const ok = bug ? val === first.current : val === latest;
    if (ok) return setStep(4);
    setErr(bug ? 'رمز غير صحيح أو منتهي الصلاحية' : 'رمز غير صحيح. استخدم آخر رسالة وصلتك.');
    if (bug) trigger('otp', 'Latest code rejected');
  };
  return (
    <div>
      <p className="mb-3 text-sm">سيتم إرسال رمز التأكيد إلى الرقم: <b dir="ltr">{masked}</b></p>
      <button className={btn2Cls} onClick={send} disabled={sending}>{sending ? 'جاري الإرسال...' : latest ? 'إعادة إرسال الرمز' : 'إرسال الرمز'}</button>
      {left !== null && <p className={`mt-2 font-mono text-xl ${left === 0 ? 'text-red-600' : ''}`}>{mmss(left)}{lateTag && <span className="text-sm font-sans"> انتهت صلاحية الرمز منذ دقيقتين</span>}</p>}
      <Field label="رمز التأكيد" error={err}><input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} /></Field>
      <button className={btnCls} onClick={verify}>تأكيد</button>
      {sms && (
        <div className="fixed top-24 left-3 z-50 w-64 bg-slate-900 text-white p-3 text-sm shadow-xl rounded" dir="rtl">
          <b>📱 رسالة جديدة</b><p className="mt-1">رمز التحقق الخاص بك: <b className="text-yellow-300">{sms}</b></p>
          <button className="text-xs underline mt-1" onClick={() => setSms(null)}>إغلاق</button>
        </div>
      )}
    </div>
  );
}
