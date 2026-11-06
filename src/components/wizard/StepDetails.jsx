'use client';
import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useBugs } from '@/bugs/BugsContext';
import { GOVERNORATES } from '@/bugs/registry';
import { Field, inputCls, btnCls } from '../ui';

export default function StepDetails() {
  const { wiz, setForm, setStep, wipe, fieldErr: err, setFieldErr: setErr } = useApp();
  const { isOn, trigger } = useBugs();
  const f = wiz.form;
  const bug = isOn('upload');

  const onFile = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const e2 = {};
    if (!['application/pdf', 'image/png', 'image/jpeg'].includes(file.type)) e2.doc = bug ? 'الملف غير صالح' : 'الصيغ المسموحة: PNG أو JPG أو PDF';
    else if (file.size > 800 * 1024) e2.doc = bug ? 'الملف غير صالح' : 'حجم الملف يجب ألا يتجاوز 800 كيلوبايت';
    else if (bug && /[؀-ۿ]/.test(file.name)) e2.doc = 'الملف غير صالح';
    if (e2.doc) { setErr(e2); setForm({ doc: '' }); if (bug) trigger('upload', 'Rejected without saying why'); return; }
    setErr({}); setForm({ doc: file.name });
  };
  const next = () => {
    const e = {};
    if (!f.gov) e.gov = 'محافظة غير مختارة';
    if (f.address.trim().length < 5) e.address = 'عنوان غير صالح — أدخل العنوان الكامل';
    if (!f.doc) e.doc = 'مستمسك غير مرفق';
    if (!Object.keys(e).length) { setErr({}); return setStep(2); }
    if (isOn('state-wipe')) return wipe('تم مسح النموذج. الخطأ: ' + Object.values(e).join(' • '));
    setErr(e);
  };
  return (
    <div>
      <Field label="المحافظة" error={err.gov}>
        <select className={inputCls} value={f.gov} onChange={(e) => setForm({ gov: e.target.value })}><option value="">-- اختر --</option>{GOVERNORATES.map((g) => <option key={g}>{g}</option>)}</select>
      </Field>
      <Field label="العنوان الكامل" error={err.address}><input className={inputCls} value={f.address} onChange={(e) => setForm({ address: e.target.value })} /></Field>
      <Field label="المستمسك (صورة الهوية)" error={err.doc} hint={bug ? '' : 'PNG أو JPG أو PDF، أقل من 800 كيلوبايت'}>
        <input type="file" accept=".png,.jpg,.jpeg,.pdf" className={inputCls} onChange={onFile} />{f.doc && <span className="text-xs text-green-700">تم رفع: {f.doc}</span>}
      </Field>
      <button className={btnCls} onClick={next}>التالي</button>
    </div>
  );
}
