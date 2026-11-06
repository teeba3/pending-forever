'use client';
import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useBugs } from '@/bugs/BugsContext';
import { toLatin } from '@/lib/utils';
import { Field, inputCls, btnCls } from '../ui';

export function TrackView() {
  const { submissions } = useApp();
  const { isOn, trigger } = useBugs();
  const [q, setQ] = useState(''); const [res, setRes] = useState(null);
  const search = (e) => {
    e.preventDefault();
    if (isOn('status-stuck')) { trigger('status-stuck', 'Always "under processing"'); return setRes({ status: 'قيد المعالجة' }); }
    const hit = submissions.find((s) => s.ref === q.trim() || s.nid === toLatin(q.trim()));
    setRes(hit ? { status: 'قيد المراجعة من قبل الموظف المختص', ref: hit.ref } : { status: 'لا يوجد طلب بهذا الرقم' });
  };
  return (
    <form onSubmit={search} className="bg-white border border-slate-300 p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-green-900 mb-4">متابعة طلب</h2>
      <Field label="رقم الطلب أو الرقم الوطني"><input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} /></Field>
      <button className={btnCls}>بحث</button>
      {res && <p className="mt-4 p-3 bg-yellow-50 border border-yellow-600">حالة الطلب: <b>{res.status}</b></p>}
    </form>
  );
}

export function DoneView() {
  const { view, go } = useApp();
  return (
    <div className="bg-white border border-slate-300 p-8 max-w-xl mx-auto text-center">
      <div className="text-5xl">✅</div>
      <h2 className="text-xl font-bold mt-3">تمت العملية بنجاح</h2>
      {view.ref ? (
        <>
          <p className="mt-3">رقم الطلب: <b dir="ltr">{view.ref}</b></p>
          <button className={`${btnCls} mt-4`} onClick={() => window.print()}>طباعة الوصل</button>
        </>
      ) : <p className="mt-3">شكراً لاستخدامكم البوابة.</p>}
      <div><button className="underline text-green-800 mt-4" onClick={() => go('home')}>الرئيسية</button></div>
    </div>
  );
}
