'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { SERVICES } from '@/data/services';
import { inputCls, btnCls } from '../ui';

const SLIDES = [
  ['إطلاق النسخة الجديدة من البوابة', 'تم إطلاق النسخة التجريبية (v0.0.1-beta) بنجاح'],
  ['إعلان مهم', 'يرجى مراجعة الدائرة المختصة لإكمال معاملتكم'],
  ['خدمة جديدة', 'الآن يمكنكم تقديم الطلبات إلكترونياً (أو الحضور شخصياً)'],
];

export default function HomeView() {
  const { t, openService } = useApp();
  const [i, setI] = useState(0);
  const [q, setQ] = useState('');
  const [searched, setSearched] = useState(false);
  useEffect(() => { const id = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 2500); return () => clearInterval(id); }, []);
  return (
    <div>
      <div className="bg-gradient-to-l from-green-800 to-green-600 text-white p-8 text-center mb-4 h-36">
        <h2 className="text-2xl font-bold">{SLIDES[i][0]}</h2><p className="mt-2">{SLIDES[i][1]}</p>
      </div>
      <form className="flex gap-2 mb-2" onSubmit={(e) => { e.preventDefault(); setSearched(true); }}>
        <input className={inputCls} placeholder="ابحث عن خدمة..." value={q} onChange={(e) => { setQ(e.target.value); setSearched(false); }} />
        <button className={btnCls}>{t('search')}</button>
      </form>
      {searched && <p className="text-red-700 text-sm mb-2">لا توجد نتائج مطابقة.</p>}
      <h3 className="text-lg font-bold text-green-900 border-r-4 border-yellow-600 pr-2 my-4">{t('services')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SERVICES.map((s) => (
          <button key={s.id} onClick={() => openService(s)} className="bg-white border border-slate-300 hover:border-green-700 p-4 text-center">
            <div className="text-3xl mb-1">{s.icon}</div><div className="text-sm font-bold">{s.ar}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
