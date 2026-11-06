'use client';
import { useBugs } from '@/bugs/BugsContext';

export default function Banner() {
  const { isOn } = useBugs();
  if (!isOn('chaos-banner')) return null;
  return (
    <div className="bg-red-500 text-white font-bold overflow-hidden py-1 border-b-2 border-red-900" dir="rtl">
      <span className="animate-marquee animate-flash">
        ⚠️ تنبيه: نظام المرور الجديد لا يعمل، يرجى استخدام النظام القديم (الذي لا يعمل أيضاً).
      </span>
    </div>
  );
}
