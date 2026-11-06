import './globals.css';

export const metadata = { title: 'Pending Forever | بوابة الخدمات الإلكترونية', description: 'A parody of frustrating government portals.' };

export default function RootLayout({ children }) {
  return (<html lang="ar" dir="rtl"><body>{children}</body></html>);
}
