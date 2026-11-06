'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { BUGS } from './registry';

const Ctx = createContext(null);
export const useBugs = () => useContext(Ctx);
const KEY = 'pf-bugs'; // survives every wipe on purpose

export function BugsProvider({ children }) {
  const [off, setOff] = useState([]);
  const [log, setLog] = useState([]);
  const [toast, setToast] = useState(null);
  const [alerts, setAlerts] = useState(false); // pop a red toast on each trigger (off = stays realistic)

  useEffect(() => { try { setOff(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch {} }, []);
  const persist = (v) => { setOff(v); try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} };
  const isOn = useCallback((id) => !off.includes(id), [off]);
  const toggle = (id) => persist(off.includes(id) ? off.filter((x) => x !== id) : [...off, id]);
  const setAll = (on) => persist(on ? [] : BUGS.map((b) => b.id));

  const trigger = useCallback((id, detail = '') => {
    const bug = BUGS.find((b) => b.id === id);
    const entry = { id, title: bug?.title || id, detail, at: new Date().toLocaleTimeString() };
    setLog((l) => [entry, ...l].slice(0, 40));
    setToast(entry);
    setTimeout(() => setToast((t) => (t === entry ? null : t)), 3500);
  }, []);

  return <Ctx.Provider value={{ isOn, toggle, setAll, trigger, log, toast, alerts, setAlerts }}>{children}</Ctx.Provider>;
}
