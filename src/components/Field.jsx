export function Field({ label, error, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-semibold text-amber-300 mb-1">{label}</span>
      {children}
      {error && <span className="block text-sm text-red-400 mt-1">⚠ {error}</span>}
    </label>
  );
}
export const inputCls = 'w-full bg-slate-900 border-2 border-slate-600 focus:border-amber-400 outline-none px-3 py-2 text-slate-100';
export const btnCls = 'bg-amber-400 text-slate-900 font-bold px-5 py-2 border-2 border-amber-600 hover:bg-amber-300 disabled:opacity-50';
export const btn2Cls = 'bg-slate-700 text-slate-100 font-bold px-5 py-2 border-2 border-slate-500 hover:bg-slate-600';
