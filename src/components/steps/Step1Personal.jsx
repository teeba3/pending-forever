'use client';
import { useState } from 'react';
import { usePortal } from '@/lib/PortalContext';
import { useBugs } from '@/bugs/BugsContext';
import { Field, inputCls, btnCls } from '../Field';

const RULES = {
  name: (v) => (v.trim().length < 3 ? 'Name is required (min 3 chars)' : ''),
  nationalId: (v) => (/^\d{12}$/.test(v) ? '' : 'National ID must be exactly 12 digits'),
  email: (v) => (/.+@.+\..+/.test(v) ? '' : 'Enter a valid email'),
  phone: (v) => (/^07\d{9}$/.test(v) ? '' : 'Phone must look like 07XXXXXXXXX'),
  birthdate: (v) => (v ? '' : 'Birthdate is required'),
  employment: (v) => (v ? '' : 'Choose an employment status'),
};

export default function Step1Personal() {
  const { form, update, next, wipeForm } = usePortal();
  const { isOn } = useBugs();
  const [errors, setErrors] = useState({});

  const submit = () => {
    const errs = {};
    Object.entries(RULES).forEach(([k, fn]) => { const m = fn(form[k]); if (m) errs[k] = m; });
    if (Object.keys(errs).length === 0) return next();
    if (isOn('state-wipe')) { wipeForm(); setErrors({ _all: 'Validation error. Form reset.' }); }  // BUG: everything erased
    else setErrors(errs);                                                                           // FIX: keep data
  };
  const f = (k) => ({ className: inputCls, value: form[k], onChange: (e) => update({ [k]: e.target.value }) });

  return (
    <div>
      {errors._all && <div className="bg-red-500 text-white font-bold p-2 mb-4 animate-flash">⚠ {errors._all}</div>}
      <Field label="Full name" error={errors.name}><input {...f('name')} /></Field>
      <Field label="National ID" error={errors.nationalId}><input {...f('nationalId')} /></Field>
      <Field label="Email" error={errors.email}><input {...f('email')} /></Field>
      <Field label="Phone" error={errors.phone}><input {...f('phone')} /></Field>
      <Field label="Birthdate" error={errors.birthdate}><input type="date" {...f('birthdate')} /></Field>
      <Field label="Employment status" error={errors.employment}>
        <select {...f('employment')}>
          <option value="">-- select --</option><option>Employed</option><option>Unemployed</option><option>Retired</option><option>Student</option>
        </select>
      </Field>
      <button className={btnCls} onClick={submit}>Next →</button>
    </div>
  );
}
