'use client';
import { useEffect, useState } from 'react';
import { WARNINGS } from '@/data/warnings';
import { useApp } from '@/lib/AppContext';
import { useBugs } from '@/bugs/BugsContext';
import { SERVICES, byId } from '@/data/services';
import { btnCls } from './ui';

export function Crest({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="22" fill="#fff" stroke="#b8923b" strokeWidth="3" />
      <path d="M24 8l4 9h9l-7 6 3 9-9-6-9 6 3-9-7-6h9z" fill="#1b5e3a" />
    </svg>
  );
}

export function Banner() {
  const { isOn } = useBugs();
  if (!isOn('chaos-banner')) return null;
  return (
    <div className="bg-red-700 text-white text-sm overflow-hidden py-1" dir="rtl">
      <span className="animate-marquee">⚠️ تنبيه: نظام المرور الجديد لا يعمل، يرجى استخدام النظام القديم (الذي لا يعمل أيضاً).</span>
    </div>
  );
}

export function TopStrip() {
  const { t, lang, setLang } = useApp();
  return (
    <div className="bg-green-900 text-green-50 text-xs px-4 py-1 flex justify-between items-center">
      <span suppressHydrationWarning>{new Date().toLocaleDateString('ar-IQ')}</span>
      <span className="flex gap-3">
        <button onClick={() => {}}>A+</button><button onClick={() => {}}>A-</button>
        <button onClick={() => {}}>خريطة الموقع</button>
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="font-bold underline">{t('lang')}</button>
      </span>
    </div>
  );
}

const MENU = [
  { label: 'الرئيسية', go: 'home' },
  { label: 'الخدمات', children: [
    { label: 'الأحوال المدنية', children: [
      { label: 'البطاقة الوطنية', svc: 'id-card' }, { label: 'شهادة الجنسية', svc: 'nationality' }, { label: 'وثيقة ولادة', svc: 'birth' } ] },
    { label: 'الصحة', children: [{ label: 'شهادة تلقيح', svc: 'vaccine' }, { label: 'حجز موعد', svc: 'health' }] },
    { label: 'الدوائر الأخرى', children: [{ label: 'تقديم شكوى', svc: 'complaint' }, { label: 'براءة ذمة', svc: 'tax' }] },
  ] },
  { label: 'متابعة طلب', go: 'track' },
  { label: 'اتصل بنا', go: 'dead-contact' },
];

function MenuItem({ item, close }) {
  const { go, openService } = useApp();
  const [open, setOpen] = useState(false);
  const click = () => {
    if (item.children) return setOpen(!open);
    close();
    if (item.svc) return openService(byId(item.svc));
    if (item.go === 'dead-contact') return go('dead', { kind: 'maintenance', s: { ar: 'اتصل بنا' } });
    go(item.go);
  };
  return (
    <li>
      <button onClick={click} className="w-full text-right px-3 py-3 border-b border-green-800 hover:bg-green-800">
        {item.children ? (open ? '▾ ' : '◂ ') : ''}{item.label}
      </button>
      {open && <ul className="pr-4 bg-green-950">{item.children.map((c) => <MenuItem key={c.label} item={c} close={close} />)}</ul>}
    </li>
  );
}

export function Header() {
  const { t, go, user, logout } = useApp();
  const { isOn } = useBugs();
  const [open, setOpen] = useState(false);
  const hamburger = isOn('hamburger');
  return (
    <>
      <header className="bg-white border-b-4 border-yellow-600 px-4 py-3 flex items-center gap-3">
        {hamburger
          ? <button onClick={() => setOpen(true)} className="text-3xl text-green-900 px-2" aria-label="القائمة">☰</button>
          : null}
        <button onClick={() => go('home')} className="flex items-center gap-3 text-right">
          <Crest />
          <span><b className="block text-xl text-green-900">{t('siteName')} <span className="align-middle text-[10px] bg-red-700 text-white px-1.5 py-0.5 tracking-widest">HELL EDITION</span></b><span className="block text-sm font-bold text-yellow-700">Ministry of Everything · وزارة كل شيء</span><span className="text-xs text-slate-600">{t('portal')}</span></span>
        </button>
        <span className="flex-1" />
        {user ? (
          <span className="text-sm">مرحباً <b>{user.name}</b> <button onClick={logout} className="underline text-green-800 mr-2">خروج</button></span>
        ) : (
          <span className="flex gap-2">
            <button className={btnCls} onClick={() => go('login')}>{t('login')}</button>
            <button className="border border-green-800 text-green-800 px-4 py-2 font-bold" onClick={() => go('register')}>{t('register')}</button>
          </span>
        )}
      </header>
      {!hamburger && (
        <nav className="bg-green-900 text-white flex flex-wrap text-sm">
          {[['الرئيسية', 'home'], ['الخدمات الإلكترونية', 'home'], ['متابعة طلب', 'track']].map(([l, g]) => (
            <button key={l} onClick={() => go(g)} className="px-5 py-2 hover:bg-green-800">{l}</button>
          ))}
        </nav>
      )}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)}>
          {/* BUG: the drawer closes the moment the mouse leaves it */}
          <aside className="absolute top-0 right-0 h-full w-72 bg-green-900 text-white overflow-auto" onClick={(e) => e.stopPropagation()}
            onMouseLeave={() => { setOpen(false); }}>
            <button className="p-3 text-2xl" onClick={() => setOpen(false)}>✕</button>
            <ul>{MENU.map((m) => <MenuItem key={m.label} item={m} close={() => setOpen(false)} />)}</ul>
          </aside>
        </div>
      )}
    </>
  );
}

export function Footer() {
  const [n, setN] = useState('0000----');
  useEffect(() => setN('0000' + Math.floor(Math.random() * 9000 + 1000)), []);
  return (
    <footer className="bg-slate-800 text-slate-300 text-xs mt-10 px-4 py-6 text-center">
      <p>عدد زوار الموقع: {n}</p>
      <p className="mt-2"><a href="#" onClick={(e) => e.preventDefault()}>سياسة الخصوصية</a> · <a href="#" onClick={(e) => e.preventDefault()}>شروط الاستخدام</a> · <a href="#" onClick={(e) => e.preventDefault()}>اتصل بنا</a></p>
      <p className="mt-2">© 2014 جميع الحقوق محفوظة — يعمل بشكل أفضل على Internet Explorer 8 بدقة 1024×768</p>
    </footer>
  );
}

export function WarningBar() {
  const { isOn } = useBugs();
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((n) => n + 1), 6000); return () => clearInterval(id); }, []);
  if (!isOn('warnings')) return null;
  return (
    <div className="bg-yellow-100 border-y border-yellow-600 text-yellow-900 text-sm px-4 py-1 text-center">
      ⚠️ {WARNINGS[i % WARNINGS.length]}
    </div>
  );
}
