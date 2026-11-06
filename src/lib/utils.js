const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
export const toLatin = (s = '') => s.replace(/[٠-٩]/g, (d) => AR_DIGITS.indexOf(d));
export const hasArabicDigits = (s = '') => /[٠-٩]/.test(s);
export const rand = (n) => Math.floor(Math.random() * n);
export const code6 = () => String(100000 + rand(900000));
export const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
