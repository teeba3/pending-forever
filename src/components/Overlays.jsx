'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useBugs } from '@/bugs/BugsContext';
import { btnCls, inputCls } from './ui';

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
      {survey && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 w-96 relative">
            <button className="absolute top-1 left-2 text-[10px] text-slate-300" onClick={() => setSurvey(false)}>x</button>
            <h3 className="font-bold text-lg mb-2">قيّم تجربتك معنا!</h3>
            <p className="text-sm mb-4">هل أنت راضٍ عن خدماتنا الإلكترونية؟ (استبيان من 28 سؤالاً)</p>
            <button className={btnCls} onClick={() => setSurvey(false)}>ابدأ الاستبيان</button>
          </div>
        </div>
      )}
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
