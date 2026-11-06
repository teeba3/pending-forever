'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useBugs } from '@/bugs/BugsContext';
import { btnCls, btn2Cls, inputCls } from './ui';
import { SURVEY, RATE_LABELS } from '@/data/survey';

export function NoticeModal() {
  const { notice, setNotice } = useApp();
  if (!notice) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white border-t-4 border-red-600 p-6 w-80 text-center shadow-xl">
        <p className="font-bold text-red-700 mb-4">⚠ {notice}</p>
        <button className={btnCls} onClick={() => setNotice(null)}>موافق</button>
      </div>
    </div>
  );
}

export function SessionWarn() {
  const { warn, extend } = useApp();
  if (!warn) return null;
  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 bg-yellow-100 border border-yellow-600 px-4 py-2 text-sm shadow">
      ستنتهي جلستك خلال دقيقة. <button className="underline font-bold" onClick={extend}>تمديد الجلسة</button>
    </div>
  );
}

/** Cookie bar + survey + dead chat widget. */
export function Popups() {
  const { isOn } = useBugs();
  const [cookie, setCookie] = useState(true);
  const [survey, setSurvey] = useState(false);
  const [chat, setChat] = useState(false);
  const [sent, setSent] = useState(false);
  useEffect(() => { const id = setTimeout(() => setSurvey(true), 12000); return () => clearTimeout(id); }, []);
  if (!isOn('popups')) return null;
  return (
    <>
      {cookie && (
        <div className="fixed bottom-0 inset-x-0 z-30 bg-slate-900 text-white text-sm px-4 py-3 flex justify-between items-center">
          <span>نستخدم ملفات تعريف الارتباط لتحسين تجربتك. باستمرارك فإنك توافق على جميع الشروط.</span>
          <button className="bg-yellow-500 text-black px-4 py-1 font-bold" onClick={() => setCookie(false)}>موافق</button>
        </div>
      )}
      {survey && <SurveyModal onClose={() => setSurvey(false)} />}
      <button onClick={() => setChat(!chat)} className="fixed bottom-16 left-4 z-30 bg-green-700 text-white rounded-full w-14 h-14 text-2xl shadow-lg" aria-label="الدعم">💬</button>
      {chat && (
        <div className="fixed bottom-32 left-4 z-30 w-72 bg-white border border-slate-400 shadow-xl p-3 text-sm">
          <b>الدعم الفني</b> <span className="text-red-600">● غير متصل</span>
          {sent ? <p className="mt-2 text-red-700">البريد الإلكتروني غير صالح. (جميع الحقول مطلوبة)</p> : (
            <>
              <input className={`${inputCls} mt-2`} placeholder="الاسم" />
              <input className={`${inputCls} mt-2`} placeholder="رسالتك" />
              <button className={`${btnCls} mt-2`} onClick={() => setSent(true)}>إرسال</button>
            </>
          )}
        </div>
      )}
    </>
  );
}

const PER_PAGE = 7;

function SurveyModal({ onClose }) {
  const [started, setStarted] = useState(false);
  const [page, setPage] = useState(0);
  const [ans, setAns] = useState({});
  const [missing, setMissing] = useState([]);
  const [done, setDone] = useState(false);
  const pages = Math.ceil(SURVEY.length / PER_PAGE);
  const set = (i, v) => { setAns((a) => ({ ...a, [i]: v })); setMissing((m) => m.filter((x) => x !== i)); };

  const submit = () => {
    const miss = SURVEY.map((_, i) => i).filter((i) => !String(ans[i] ?? '').trim());
    if (miss.length) { setMissing(miss); setPage(Math.floor(miss[0] / PER_PAGE)); return; }
    setDone(true);
  };

  const shell = (children) => (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-3">
      <div className="bg-white w-full max-w-xl max-h-[92vh] overflow-auto p-6 relative">
        <button className="absolute top-1 left-2 text-[10px] text-slate-300" onClick={onClose}>x</button>
        {children}
      </div>
    </div>
  );

  if (!started) return shell(
    <>
      <h3 className="font-bold text-lg mb-2">قيّم تجربتك معنا!</h3>
      <p className="text-sm mb-4">هل أنت راضٍ عن خدماتنا الإلكترونية؟ (استبيان من 28 سؤالاً)</p>
      <button className={btnCls} onClick={() => setStarted(true)}>ابدأ الاستبيان</button>
    </>
  );
  if (done) return shell(
    <>
      <h3 className="font-bold text-lg mb-2">شكراً لمشاركتك! ✅</h3>
      <p className="text-sm mb-4">تم استلام إجاباتك وسيتم دراستها خلال 3–5 سنوات عمل.</p>
      <button className={btnCls} onClick={onClose}>إغلاق</button>
    </>
  );

  const items = SURVEY.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  return shell(
    <>
      <div className="flex justify-between text-xs text-slate-500 mb-1"><span>الصفحة {page + 1} من {pages}</span><span>{Object.values(ans).filter((v) => String(v).trim()).length} / {SURVEY.length}</span></div>
      <div className="h-2 bg-slate-200 mb-4"><div className="h-2 bg-green-700" style={{ width: `${((page + 1) / pages) * 100}%` }} /></div>
      {items.map(([type, q], k) => {
        const i = page * PER_PAGE + k;
        return (
          <div key={i} className={`mb-4 pb-3 border-b ${missing.includes(i) ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}>
            <p className="font-bold text-sm mb-2">{i + 1}. {q} <span className="text-red-600">*</span></p>
            {type === 'rate' && (
              <div className="flex flex-wrap gap-2">{RATE_LABELS.map((l, n) => (
                <label key={l} className="text-xs flex items-center gap-1"><input type="radio" name={`q${i}`} checked={ans[i] === n + 1} onChange={() => set(i, n + 1)} />{l}</label>
              ))}</div>
            )}
            {type === 'yn' && (
              <div className="flex gap-4 text-sm">{['نعم', 'لا'].map((l) => (
                <label key={l} className="flex items-center gap-1"><input type="radio" name={`q${i}`} checked={ans[i] === l} onChange={() => set(i, l)} />{l}</label>
              ))}</div>
            )}
            {type === 'text' && <input className={inputCls} value={ans[i] || ''} onChange={(e) => set(i, e.target.value)} />}
            {missing.includes(i) && <p className="text-xs text-red-600 mt-1">هذا الحقل مطلوب</p>}
          </div>
        );
      })}
      <div className="flex justify-between">
        <button className={btn2Cls} disabled={page === 0} onClick={() => setPage(page - 1)}>السابق</button>
        {page < pages - 1
          ? <button className={btnCls} onClick={() => setPage(page + 1)}>التالي</button>
          : <button className={btnCls} onClick={submit}>إرسال</button>}
      </div>
    </>
  );
}
