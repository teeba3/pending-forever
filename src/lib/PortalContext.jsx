'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useBugs } from '@/bugs/BugsContext';
import { GOVERNORATES } from '@/bugs/registry';
import { EVENTS } from './taunts';

const Ctx = createContext(null);
export const usePortal = () => useContext(Ctx);

const KEY = 'pf-state';
export const EMPTY_FORM = { name: '', nationalId: '', email: '', phone: '', birthdate: '', employment: '', password: '', governorate: '', address: '', document: '' };
export const STEPS = ['Personal Info', 'Create Account', 'Verification', 'Address & Documents', 'Review & Submit'];

export function PortalProvider({ children }) {
  const { isOn, trigger } = useBugs();
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState('login');   // login | active | terminated
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [bot, setBot] = useState(null);               // latest event taunt
  const [flashGov, setFlashGov] = useState(0);

  // load
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s) { setSession(s.session); setStep(s.step); setForm({ ...EMPTY_FORM, ...s.form }); }
    } catch {}
    setReady(true);
  }, []);
  // save
  useEffect(() => {
    if (ready) try { localStorage.setItem(KEY, JSON.stringify({ session, step, form })); } catch {}
  }, [ready, session, step, form]);

  const say = useCallback((k) => setBot({ text: EVENTS[k], at: Date.now() }), []);
  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const wipeForm = () => { setForm(EMPTY_FORM); setStep(0); trigger('state-wipe', 'All fields erased after one error'); say('wipe'); };

  const terminate = useCallback(() => {
    // BUG: wipes every key except the bug switches, then ejects you.
    try { Object.keys(localStorage).filter((k) => k !== 'pf-bugs').forEach((k) => localStorage.removeItem(k)); } catch {}
    setForm(EMPTY_FORM); setStep(0); setSession('terminated');
    trigger('back-logout', 'Session terminated, storage cleared'); say('logout');
  }, [trigger, say]);

  const login = () => { setSession('active'); setStep(0); };
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = useCallback(() => {
    if (isOn('back-logout')) return terminate();
    setStep((s) => Math.max(s - 1, 0));
  }, [isOn, terminate]);

  // intercept the browser Back button
  useEffect(() => {
    if (session !== 'active') return;
    history.pushState({ pf: 1 }, '');
    const onPop = () => { history.pushState({ pf: 1 }, ''); back(); };
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, [session, back]);

  // Governorate Teleport: every 15s silently swap the selection
  const formRef = useRef(form); formRef.current = form;
  useEffect(() => {
    if (session !== 'active' || !isOn('teleport')) return;
    const t = setInterval(() => {
      const cur = formRef.current.governorate;
      if (!cur) return;
      const others = GOVERNORATES.filter((g) => g !== cur);
      const pick = others[Math.floor(Math.random() * others.length)];
      setForm((f) => ({ ...f, governorate: pick }));
      setFlashGov((n) => n + 1);
      trigger('teleport', `${cur} → ${pick}`); say('teleport');
    }, 15000);
    return () => clearInterval(t);
  }, [session, isOn, trigger, say]);

  return (
    <Ctx.Provider value={{ ready, session, step, form, update, wipeForm, terminate, login, next, back, bot, say, flashGov, setStep }}>
      {children}
    </Ctx.Provider>
  );
}
