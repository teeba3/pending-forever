export function Field({ label, error, hint, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-bold text-slate-700 mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-500 mt-1">{hint}</span>}
      {error && <span className="block text-sm text-red-600 mt-1">{error}</span>}
    </label>
  );
}
export const inputCls = 'w-full border border-slate-400 bg-white px-3 py-2 rounded-sm focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700';
export const btnCls = 'bg-green-800 hover:bg-green-900 text-white font-bold px-6 py-2 rounded-sm disabled:opacity-50';
export const btn2Cls = 'bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-6 py-2 rounded-sm border border-slate-400';
