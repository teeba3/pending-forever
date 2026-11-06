'use client';
import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useBugs } from '@/bugs/BugsContext';
import { toLatin, hasArabicDigits } from '@/lib/utils';
import { Field, inputCls, btnCls } from '../ui';

const MONTHS = ['كانون الثاني','شباط','آذار','نيسان','أيار','حزيران','تموز','آب','أيلول','تشرين الأول','تشرين الثاني','كانون الأول'];

export default function StepApplicant() {
  const { wiz, setForm, setStep, wipe } = useApp();
  const { isOn, trigger } = useBugs();
  const f = wiz.form; const [err, setErr] = useState({});
  const bad1900 = isOn('date-1900');
  const thisYear = new Date().getFullYear();
  const years = bad1900 ? Array.from({ length: thisYear - 1899 }, (_, i) => 1900 + i) : Array.from({ length: 100 }, (_, i) => thisYear - i);

  const next = () => {
    const nid = isOn('arabic-digits') ? f.nid : toLatin(f.nid);
    const phone = isOn('arabic-digits') ? f.phone : toLatin(f.phone);
    const e = {};
    if (f.name.trim().split(/\s+/).length < 4 || /[a-z]/i.test(f.name)) e.name = 'الاسم يجب أن يكون رباعياً وبالعربية';
    if (!/^\d{12}$/.test(nid)) e.nid = hasArabicDigits(f.nid) ? 'الأرقام يجب أن تكون بالإنكليزية' : 'الرقم الوطني يجب أن يتكون من 12 رقماً';
    if (!f.d || !f.m || !f.y) e.birth = 'أدخل تاريخ الميلاد';
    if (!/^07\d{9}$/.test(phone)) e.phone = 'رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 11 رقماً';
    if (!/.+@.+\..+/.test(f.email)) e.email = 'بريد إلكتروني غير صالح';
    if (!Object.keys(e).length) { setForm({ nid, phone }); return setStep(1); }
    if (isOn('state-wipe')) return wipe('بيانات غير صحيحة');
    setErr(e);
  };
  const inp = (k) => ({ className: inputCls, value: f[k], onChange: (e) => setForm({ [k]: e.target.value }) });
  return (
    <div>
      <Field label="الاسم الرباعي (بالعربية)" error={err.name}><input {...inp('name')} /></Field>
      <Field label="الرقم الوطني" error={err.nid} hint={isOn('arabic-digits') ? '' : 'يمكنك الكتابة بالأرقام العربية أو الإنكليزية'}><input {...inp('nid')} inputMode="numeric" /></Field>
      <Field label="تاريخ الميلاد" error={err.birth}>
        <div className="flex gap-2">
          <select className={inputCls} value={f.d} onChange={(e) => setForm({ d: e.target.value })}><option value="">يوم</option>{Array.from({ length: 31 }, (_, i) => <option key={i}>{i + 1}</option>)}</select>
          <select className={inputCls} value={f.m} onChange={(e) => setForm({ m: e.target.value })}><option value="">شهر</option>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select>
          <select className={inputCls} value={f.y} onChange={(e) => setForm({ y: e.target.value })}><option value="">سنة</option>{years.map((y) => <option key={y}>{y}</option>)}</select>
        </div>
      </Field>
      <Field label="رقم الهاتف" error={err.phone}><input {...inp('phone')} inputMode="numeric" /></Field>
      <Field label="البريد الإلكتروني" error={err.email}><input {...inp('email')} /></Field>
      <button className={btnCls} onClick={next}>التالي</button>
    </div>
  );
}
