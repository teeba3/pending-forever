'use client';
// "Verify you are human" checkbox. Only a real Iraqi patriot can pass.
export default function HumanCheck({ checked, onChange, error }) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-3 border border-slate-400 bg-slate-50 px-3 py-3 cursor-pointer">
        <input type="checkbox" className="w-5 h-5" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="font-bold">أنا أحب وطني العراق 🇮🇶</span>
        <span className="mr-auto text-[10px] text-slate-400">تحقق: لست روبوتاً</span>
      </label>
      {error && <span className="block text-sm text-red-600 mt-1">{error}</span>}
    </div>
  );
}
