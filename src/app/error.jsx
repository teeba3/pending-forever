'use client';
import { useEffect } from 'react';

// If anything ever crashes (e.g. stale saved state), wipe it and recover instead of a dead page.
export default function Error({ reset }) {
  useEffect(() => { try { ['pf-state', 'pf2-state'].forEach((k) => localStorage.removeItem(k)); } catch {} }, []);
  return (
    <div dir="rtl" style={{ padding: 40, textAlign: 'center', fontFamily: 'Tahoma' }}>
      <h2>حدث خطأ غير متوقع</h2>
      <button onClick={() => reset()} style={{ padding: '8px 20px', marginTop: 12 }}>إعادة المحاولة</button>
    </div>
  );
}
