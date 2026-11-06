// type: ok = real wizard | maintenance | office | external | hours (wizard, but only Sun–Thu 8–14)
// Every tile looks identical on the home page — you only find out what happens after clicking.
export const SERVICES = [
  { id: 'id-card', ar: 'طلب البطاقة الوطنية الموحدة', icon: '🪪', type: 'ok' },
  { id: 'nationality', ar: 'شهادة الجنسية العراقية', icon: '📜', type: 'ok' },
  { id: 'passport', ar: 'إصدار جواز السفر', icon: '🛂', type: 'external', ministry: 'وزارة الداخلية' },
  { id: 'driving', ar: 'إجازة السوق', icon: '🚗', type: 'hours' },
  { id: 'vehicle', ar: 'تسجيل مركبة', icon: '🚙', type: 'office' },
  { id: 'birth', ar: 'وثيقة ولادة', icon: '👶', type: 'ok' },
  { id: 'marriage', ar: 'عقد زواج', icon: '💍', type: 'office' },
  { id: 'ration', ar: 'البطاقة التموينية', icon: '🍚', type: 'maintenance' },
  { id: 'property', ar: 'سند عقاري', icon: '🏠', type: 'external', ministry: 'دائرة التسجيل العقاري' },
  { id: 'tax', ar: 'براءة ذمة ضريبية', icon: '🧾', type: 'ok' },
  { id: 'electricity', ar: 'دفع فاتورة الكهرباء', icon: '💡', type: 'maintenance' },
  { id: 'water', ar: 'شكوى مياه', icon: '🚰', type: 'office' },
  { id: 'health', ar: 'حجز موعد في مستشفى', icon: '🏥', type: 'hours' },
  { id: 'vaccine', ar: 'شهادة تلقيح', icon: '💉', type: 'ok' },
  { id: 'edu', ar: 'تصديق شهادة دراسية', icon: '🎓', type: 'external', ministry: 'وزارة التعليم العالي' },
  { id: 'admission', ar: 'القبول المركزي', icon: '🏫', type: 'maintenance' },
  { id: 'pension', ar: 'الاستعلام عن الراتب التقاعدي', icon: '👴', type: 'ok' },
  { id: 'social', ar: 'الحماية الاجتماعية', icon: '🤝', type: 'external', ministry: 'وزارة العمل' },
  { id: 'complaint', ar: 'تقديم شكوى', icon: '📣', type: 'ok' },
  { id: 'company', ar: 'إجازة تأسيس شركة', icon: '🏢', type: 'office' },
  { id: 'customs', ar: 'تخليص كمركي', icon: '📦', type: 'maintenance' },
  { id: 'police', ar: 'وثيقة عدم محكومية', icon: '👮', type: 'ok' },
  { id: 'lost', ar: 'بلاغ مفقودات', icon: '🔍', type: 'hours' },
  { id: 'internet', ar: 'اشتراك الإنترنت', icon: '🌐', type: 'maintenance' },
];
export const byId = (id) => SERVICES.find((s) => s.id === id);
export const isOpenNow = () => { const d = new Date(), day = d.getDay(), h = d.getHours(); return day !== 5 && day !== 6 && h >= 8 && h < 14; };
