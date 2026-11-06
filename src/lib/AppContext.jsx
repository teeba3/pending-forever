'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useBugs } from '@/bugs/BugsContext';
import { GOVERNORATES } from '@/bugs/registry';
import { byId, isOpenNow } from '@/data/services';
import { AR, EN } from './i18n';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export const EMPTY_FORM = { name: '', nid: '', d: '', m: '', y: '', phone: '', email: '', gov: '', address: '', doc: '' };
export const SESSION_MS = 5 * 60 * 1000;
const KEY = 'pf-state';

export function AppProvider({ children }) {
  const { isOn, trigger } = useBugs();
  const [ready, setReady] = useState(false);
  const [lang, setLangState] = useState('ar');
  const [user, setUser] = useState(null);
  const [view, setView] = useState({ name: 'home' });
  const [wiz, setWiz] = useState(null);            // { serviceId, step, form }
  const [pending, setPending] = useState(null);    // service chosen before login
  const [submissions, setSubmissions] = useState([]);
  const [notice, setNotice] = useState(null);
  const [sessionEnd, setSessionEnd] = useState(0);
  const [warn, setWarn] = useState(false);

  const t = (k) => (lang === 'en' && EN[k]) || AR[k] || k;

  // ---- persistence: only in "fixed" mode. In bug mode a refresh loses everything. ----
  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) { setUser(s.user); setView(s.view); setWiz(s.wiz); setSubmissions(s.submissions || []); setSessionEnd(s.sessionEnd || 0); } } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      if (isOn('refresh-logout')) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, JSON.stringify({ user, view, wiz, submissions, sessionEnd }));
    } catch {}
  }, [ready, isOn, user, view, wiz, submissions, sessionEnd]);

  const go = useCallback((name, params = {}) => setView({ name, ...params }), []);
  const setStep = (step) => setWiz((w) => w && { ...w, step });
  const setForm = (patch) => setWiz((w) => w && { ...w, form: { ...w.form, ...patch } });

  const wipe = useCallback((msg = 'بيانات غير صحيحة') => {
    setWiz((w) => w && { ...w, step: 0, form: EMPTY_FORM });
    setNotice(msg);
    trigger('state-wipe', 'All fields erased after one error');
  }, [trigger]);

  const startWizard = useCallback((serviceId) => {
    setWiz({ serviceId, step: 0, form: EMPTY_FORM });
    go('wizard');
  }, [go]);

  const openService = (s) => {
    if (s.type === 'maintenance') return go('dead', { kind: 'maintenance', s });
    if (s.type === 'office') return go('dead', { kind: 'office', s });
    if (s.type === 'external') return go('dead', { kind: 'external', s });
    if (s.type === 'hours' && isOn('office-hours') && !isOpenNow()) return go('dead', { kind: 'hours', s });
    if (!user) { setPending(s.id); return go('login', { msg: 'يرجى تسجيل الدخول للمتابعة' }); }
    startWizard(s.id);
  };

  // ---- session ----
  const login = (u) => {
    setUser(u); setSessionEnd(Date.now() + SESSION_MS); setWarn(false);
    if (wiz && !isOn('session-5min')) return go('wizard');                 // fixed: draft restored
    if (pending && !isOn('return-lost')) { const p = pending; setPending(null); return startWizard(p); }
    setPending(null);
    go('home');
  };
  const logout = () => { setUser(null); go('home'); };
  const expire = useCallback(() => {
    setUser(null); setWarn(false);
    if (isOn('session-5min')) { setWiz(null); trigger('session-5min', 'Session expired, no warning, progress lost'); go('expired', { reason: 'session' }); }
    else go('login', { msg: 'انتهت جلستك. تم حفظ بياناتك وستستعيدها بعد تسجيل الدخول.' });
  }, [isOn, trigger, go]);
  const extend = () => { setSessionEnd(Date.now() + SESSION_MS); setWarn(false); };
  const expireNow = () => { if (user) expire(); };

  useEffect(() => {
    if (!user) return;
    const left = Math.max(0, sessionEnd - Date.now());
    const t1 = setTimeout(expire, left);
    const t2 = !isOn('session-5min') && left > 60000 ? setTimeout(() => setWarn(true), left - 60000) : null;
    return () => { clearTimeout(t1); t2 && clearTimeout(t2); };
  }, [user, sessionEnd, expire, isOn]);

  // ---- language ----
  const setLang = (l) => {
    setLangState(l);
    if (isOn('lang-reset')) { setWiz(null); setUser(null); go('home'); trigger('lang-reset', 'Language switch reset session and form'); }
  };

  // ---- Back button ----
  const ref = useRef({}); ref.current = { view, wiz, user, isOn, trigger };
  const back = useCallback(() => {
    const { view: v, wiz: w, isOn: on, trigger: tr } = ref.current;
    if (v.name === 'wizard' && w) {
      if (on('back-destroys')) { setWiz(null); tr('back-destroys', 'Back wiped the application'); return go('expired', { reason: 'back' }); }
      return w.step > 0 ? setStep(w.step - 1) : go('home');
    }
    if (v.name !== 'home') go('home');
  }, [go]);
  useEffect(() => {
    history.pushState({ pf: 1 }, '');
    const onPop = () => { history.pushState({ pf: 1 }, ''); back(); };
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, [back]);

  // ---- Governorate teleport ----
  const gov = wiz?.form.gov;
  useEffect(() => {
    if (view.name !== 'wizard' || !gov || !isOn('teleport')) return;
    const id = setInterval(() => {
      setWiz((w) => {
        if (!w?.form.gov) return w;
        const pick = GOVERNORATES.filter((g) => g !== w.form.gov)[Math.floor(Math.random() * (GOVERNORATES.length - 1))];
        trigger('teleport', `${w.form.gov} → ${pick}`);
        return { ...w, form: { ...w.form, gov: pick } };
      });
    }, 15000);
    return () => clearInterval(id);
  }, [view.name, gov, isOn, trigger]);

  return (
    <Ctx.Provider value={{ ready, t, lang, setLang, user, login, logout, view, go, wiz, setStep, setForm, wipe, startWizard, openService, pending, submissions, setSubmissions, notice, setNotice, warn, extend, expireNow, back, setWiz }}>
      {children}
    </Ctx.Provider>
  );
}
