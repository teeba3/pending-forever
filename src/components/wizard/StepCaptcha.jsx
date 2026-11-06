'use client';
import { useMemo, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useBugs } from '@/bugs/BugsContext';
import { rand } from '@/lib/utils';
import { Field, inputCls, btnCls, btn2Cls } from '../ui';

const BAD = 'O0Il1B8S5Z2gq9';           // ambiguous characters
const GOOD = 'ACDEFHKMNPRTWX34679';
const make = (bad) => Array.from({ length: bad ? 7 : 5 }, () => (bad ? BAD : GOOD)[rand((bad ? BAD : GOOD).length)]).join('');

export default function StepCaptcha() {
  const { setStep, wipe } = useApp();
  const { isOn, trigger } = useBugs();
  const bug = isOn('captcha');
  const [seed, setSeed] = useState(0);
  const text = useMemo(() => make(bug), [seed, bug]);
  const [val, setVal] = useState('');
  const [err, setErr] = useState('');
  const chars = useMemo(() => text.split('').map(() => ({ r: rand(50) - 25, y: rand(14) })), [text]);

  const refresh = () => {
    setSeed((s) => s + 1); setVal(''); setErr('');
    if (bug) wipe('تم تحديث الصفحة. يرجى إعادة إدخال البيانات'), trigger('captcha', 'Refreshing the CAPTCHA erased the form');
  };
  const check = () => {
    const right = val.trim() === text;                         // case-sensitive
    if (right && !(bug && rand(3) === 0)) return setStep(3);   // bug: a third of correct answers are rejected
    if (bug) { trigger('captcha', right ? 'Correct answer rejected' : 'Wrong answer wiped the form'); if (!right) return wipe('رمز التحقق غير صحيح'); }
    setSeed((s) => s + 1); setVal(''); setErr('رمز التحقق غير صحيح');
  };
  return (
    <div>
      <p className="text-sm mb-2">{bug ? 'أدخل الرمز الظاهر في الصورة' : 'أدخل الرمز الظاهر (لا يفرّق بين الأحرف الكبيرة والصغيرة)'}</p>
      <svg width={bug ? 230 : 200} height="60" className="border border-slate-400 bg-slate-100 mb-2" aria-label="captcha">
        {bug && Array.from({ length: 6 }, (_, i) => <line key={i} x1={rand(230)} y1={rand(60)} x2={rand(230)} y2={rand(60)} stroke="#94a3b8" strokeWidth="2" />)}
        {chars.map((c, i) => <text key={i} x={12 + i * (bug ? 30 : 36)} y={bug ? 34 + c.y : 40} fontSize={bug ? 22 : 30} fontWeight="bold" fill={bug ? '#b6bfcc' : '#1e293b'} transform={bug ? `rotate(${c.r} ${12 + i * 30} 34)` : ''} fontFamily="monospace">{text[i]}</text>)}
      </svg>
      <button className={`${btn2Cls} mr-2 !px-2`} onClick={refresh} aria-label="تحديث">↻</button>
      <Field label="الرمز" error={err}><input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} /></Field>
      <button className={btnCls} onClick={check}>تحقق</button>
    </div>
  );
}
