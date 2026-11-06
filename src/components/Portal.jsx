'use client';
import { BugsProvider, useBugs } from '@/bugs/BugsContext';
import { PortalProvider, usePortal, STEPS } from '@/lib/PortalContext';
import Banner from './Banner';
import HelpBot from './HelpBot';
import BugPanel from './BugPanel';
import LoginScreen from './LoginScreen';
import Step1Personal from './steps/Step1Personal';
import Step2Account from './steps/Step2Account';
import Step3Otp from './steps/Step3Otp';
import Step4Address from './steps/Step4Address';
import Step5Submit from './steps/Step5Submit';
import { btn2Cls } from './Field';

const VIEWS = [Step1Personal, Step2Account, Step3Otp, Step4Address, Step5Submit];

function Shell() {
  const { ready, session, step, back } = usePortal();
  if (!ready) return null;
  const View = VIEWS[step];
  return (
    <div className="min-h-screen">
      <Banner />
      <header className="bg-slate-950 border-b-4 border-amber-400 px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-black text-amber-400">UR-PORTAL <span className="text-red-500">HELL EDITION</span></h1>
        <span className="text-xs text-slate-400">Ministry of Everything · v0.0.1-beta-final-FINAL</span>
      </header>
      <main className="max-w-2xl mx-auto p-4">
        {session !== 'active' ? <LoginScreen /> : (
          <>
            <ol className="flex flex-wrap gap-2 mb-4 text-xs">
              {STEPS.map((s, i) => (
                <li key={s} className={`px-2 py-1 border ${i === step ? 'bg-amber-400 text-slate-900 border-amber-600 font-bold' : 'border-slate-600 text-slate-400'}`}>{i + 1}. {s}</li>
              ))}
            </ol>
            <section className="bg-slate-800 border-2 border-slate-600 p-5">
              <h2 className="text-lg font-bold mb-4">{STEPS[step]}</h2>
              <View />
            </section>
            {step > 0 && <button onClick={back} className={`${btn2Cls} mt-4`}>← Back</button>}
          </>
        )}
      </main>
      <HelpBot />
      <BugPanel />
    </div>
  );
}

export default function Portal() {
  return (<BugsProvider><PortalProvider><Shell /></PortalProvider></BugsProvider>);
}
