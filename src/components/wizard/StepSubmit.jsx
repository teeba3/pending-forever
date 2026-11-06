'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useBugs } from '@/bugs/BugsContext';
import { btnCls } from '../ui';

const LABELS = { name: 'الاسم', nid: 'الرقم الوطني', phone: 'الهاتف', email: 'البريد', gov: 'المحافظة', address: 'العنوان', doc: 'المستمسك' };

export default function StepSubmit() {
  const { wiz, go, setWiz, setSubmissions } = useApp();
  const { isOn, trigger } = useBugs();
  const [loading, setLoading] = useState(false);
  const bug = isOn('no-confirmation');

  useEffect(() => {
    if (!loading) return;
    const id = setTimeout(() => {
      const ref = `PF-${Math.floor(10000000 + Math.random() * 89999999)}`;
      setSubmissions((s) => [...s, { ref, nid: wiz.form.nid }]);
      setWiz(null);
      if (bug) { trigger('no-confirmation', 'Finished with no reference number'); go('done', {}); }
      else go('done', { ref });
    }, bug ? 9000 : 1500);
    return () => clearTimeout(id);
  }, [loading]);

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 z-50 bg-white/90 flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full border-4 border-slate-300 border-t-green-700" style={{ animation: 'spin 1s linear infinite' }} />
          <p className="mt-4 font-bold">جاري المعالجة... يرجى عدم إغلاق الصفحة</p>
        </div>
      )}
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm mb-4">
        {Object.entries(LABELS).map(([k, l]) => <div key={k} className="contents"><dt className="text-slate-500">{l}</dt><dd>{wiz.form[k] || '—'}</dd></div>)}
      </dl>
      <button className={btnCls} onClick={() => setLoading(true)}>إرسال الطلب</button>
    </div>
  );
}
