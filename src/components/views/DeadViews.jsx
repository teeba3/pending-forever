'use client';
import { useApp } from '@/lib/AppContext';
import { btnCls } from '../ui';

const Box = ({ children }) => <div className="bg-white border border-slate-300 p-8 max-w-xl mx-auto text-center">{children}</div>;

export function DeadView() {
  const { view, go } = useApp();
  const { kind, s } = view;
  const home = <button className={`${btnCls} mt-6`} onClick={() => go('home')}>العودة للرئيسية</button>;
  if (kind === 'maintenance') return <Box><div className="text-5xl">🛠️</div><h2 className="text-xl font-bold mt-3">{s.ar}</h2><p className="mt-2">هذه الخدمة قيد الصيانة حالياً. يرجى المحاولة لاحقاً.</p>{home}</Box>;
  if (kind === 'office') return <Box><div className="text-5xl">🏢</div><h2 className="text-xl font-bold mt-3">{s.ar}</h2><p className="mt-2">لإكمال هذه الخدمة يرجى مراجعة الدائرة المختصة مع الأوليات الثبوتية الأصلية وصور ملونة منها.</p>{home}</Box>;
  if (kind === 'hours') return <Box><div className="text-5xl">🕑</div><h2 className="text-xl font-bold mt-3">{s.ar}</h2><p className="mt-2">الخدمة متاحة من الأحد إلى الخميس، من الساعة 8 صباحاً حتى 2 ظهراً فقط.</p>{home}</Box>;
  return <External s={s} go={go} />;
}

function External({ s, go }) {
  return (
    <div className="bg-slate-200 border-2 border-slate-500 p-4 max-w-xl mx-auto font-serif" style={{ fontFamily: 'Times New Roman, serif' }}>
      <p className="text-xs text-slate-600">تم تحويلك إلى موقع {s.ministry} (النسخة القديمة)</p>
      <h2 className="text-lg font-bold underline mt-2">{s.ministry}</h2>
      <p className="mt-3">لاستخدام هذه الخدمة يجب <b>إنشاء حساب جديد</b> في هذا الموقع (حسابك في البوابة الموحدة غير صالح هنا).</p>
      <p className="mt-2"><a href="#" onClick={(e) => e.preventDefault()} className="text-blue-700 underline">اضغط هنا للتسجيل</a> — <span className="text-red-700">Error 404: الصفحة غير موجودة</span></p>
      <button className="mt-4 border border-slate-700 px-3" onClick={() => go('home')}>رجوع</button>
    </div>
  );
}

export function ExpiredView() {
  const { view, go } = useApp();
  const session = view.reason === 'session';
  return (
    <Box>
      <div className="text-5xl">⌛</div>
      <h2 className="text-xl font-bold mt-3 text-red-700">{session ? 'انتهت الجلسة' : 'انتهت صلاحية الصفحة'}</h2>
      <p className="mt-2">{session ? 'لقد انتهت جلستك. يرجى تسجيل الدخول مرة أخرى وإعادة إدخال جميع البيانات.' : 'يرجى عدم استخدام زر الرجوع أو تحديث الصفحة أثناء تقديم الطلب. تم حذف جميع بياناتك.'}</p>
      <button className={`${btnCls} mt-6`} onClick={() => go(session ? 'login' : 'home')}>{session ? 'تسجيل الدخول' : 'العودة للرئيسية'}</button>
    </Box>
  );
}
