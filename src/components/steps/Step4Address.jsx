'use client';
import { useState } from 'react';
import { usePortal } from '@/lib/PortalContext';
import { useBugs } from '@/bugs/BugsContext';
import { GOVERNORATES } from '@/bugs/registry';
import { Field, inputCls, btnCls } from '../Field';

export default function Step4Address() {
  const { form, update, next, flashGov, wipeForm } = usePortal();
  const { isOn } = useBugs();
  const [errors, setErrors] = useState({});

  const go = () => {
    const errs = {};
    if (!form.governorate) errs.governorate = 'Select a governorate';
    if (form.address.trim().length < 5) errs.address = 'Enter your full address';
    if (!form.document) errs.document = 'Upload a document';
    if (!Object.keys(errs).length) return next();
    if (isOn('state-wipe')) wipeForm(); else setErrors(errs);
  };

  return (
    <div>
      <Field label="Governorate" error={errors.governorate}>
        <select key={flashGov} className={`${inputCls} ${flashGov ? 'bug-pulse' : ''}`} value={form.governorate} onChange={(e) => update({ governorate: e.target.value })}>
          <option value="">-- select --</option>
          {GOVERNORATES.map((g) => <option key={g}>{g}</option>)}
        </select>
      </Field>
      <Field label="Address" error={errors.address}><input className={inputCls} value={form.address} onChange={(e) => update({ address: e.target.value })} /></Field>
      <Field label="Upload document (PDF/JPG)" error={errors.document}>
        <input type="file" className={inputCls} onChange={(e) => update({ document: e.target.files?.[0]?.name || '' })} />
        {form.document && <span className="text-xs text-slate-400">Selected: {form.document}</span>}
      </Field>
      <button className={btnCls} onClick={go}>Next →</button>
    </div>
  );
}
