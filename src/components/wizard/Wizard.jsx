'use client';
import { useApp } from '@/lib/AppContext';
import { byId } from '@/data/services';
import { btn2Cls } from '../ui';
import { useBugs } from '@/bugs/BugsContext';
import { STEP_WARNINGS } from '@/data/warnings';
import StepApplicant from './StepApplicant';
import StepDetails from './StepDetails';
import StepCaptcha from './StepCaptcha';
import StepOtp from './StepOtp';
import StepSubmit from './StepSubmit';

const STEPS = ['بيانات مقدم الطلب', 'تفاصيل الطلب', 'التحقق الأمني', 'رمز التأكيد', 'المراجعة والإرسال'];
const VIEWS = [StepApplicant, StepDetails, StepCaptcha, StepOtp, StepSubmit];

export default function Wizard() {
  const { wiz, back, go } = useApp();
  const { isOn } = useBugs();
  if (!wiz) { return <p className="text-center">لا يوجد طلب نشط. <button className="underline" onClick={() => go('home')}>الرئيسية</button></p>; }
  const s = byId(wiz.serviceId); const View = VIEWS[wiz.step];
  return (
    <div>
      <h2 className="text-xl font-bold text-green-900 mb-3">{s.icon} {s.ar}</h2>
      <ol className="flex flex-wrap gap-1 mb-3 text-xs">
        {STEPS.map((l, i) => <li key={l} className={`px-2 py-1 border ${i === wiz.step ? 'bg-green-800 text-white' : 'bg-white text-slate-500'}`}>{i + 1}. {l}</li>)}
      </ol>
      {isOn('warnings') && <p className="bg-yellow-50 border-r-4 border-yellow-600 text-sm p-2 mb-3">⚠️ {STEP_WARNINGS[wiz.step]}</p>}
      <section className="bg-white border border-slate-300 p-5"><View /></section>
      <button className={`${btn2Cls} mt-3`} onClick={back}>رجوع</button>
    </div>
  );
}
