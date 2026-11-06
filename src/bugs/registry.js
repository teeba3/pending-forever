// Single source of truth for every UX problem. To add one:
//   1. add an entry here  2. branch on `isOn('id')` where it applies (else = fixed behaviour)
//   3. call `trigger('id', 'detail')` when it fires so the Bug Detector logs it.
export const BUGS = [
  { id: 'hamburger',      title: 'Hamburger menu on desktop',   fix: 'Visible navigation bar' },
  { id: 'session-5min',   title: 'Session expires in 5 min',    fix: 'Warning + draft is restored' },
  { id: 'back-destroys',  title: 'Back destroys progress',      fix: 'Back goes to previous step' },
  { id: 'refresh-logout', title: 'Refresh logs you out',        fix: 'State survives a refresh' },
  { id: 'state-wipe',     title: 'One mistake = empty form',    fix: 'Keep data, name the field' },
  { id: 'captcha',        title: 'CAPTCHA from hell',           fix: 'Readable, no wipe, no random rejects' },
  { id: 'otp',            title: 'OTP arrives expired / wrong number', fix: 'Fresh code, correct masked number' },
  { id: 'arabic-digits',  title: 'Arabic digits rejected',      fix: 'Digits are normalised' },
  { id: 'date-1900',      title: 'Date picker starts at 1900',  fix: 'Newest year first' },
  { id: 'upload',         title: 'Cryptic upload rules',        fix: 'Rules stated up front' },
  { id: 'generic-login',  title: '"Invalid user name or password"', fix: 'Say which field is wrong' },
  { id: 'silent-pass',    title: 'Secret password rules',       fix: 'Rules are shown' },
  { id: 'ghost-active',   title: 'Account "activated" before email', fix: 'Pending until verified' },
  { id: 'return-lost',    title: 'Login forgets the service you chose', fix: 'Return to the service' },
  { id: 'lang-reset',     title: 'Language switch resets everything', fix: 'Only the language changes' },
  { id: 'no-confirmation',title: 'Submit: no reference number', fix: 'Reference number + receipt' },
  { id: 'status-stuck',   title: 'Tracker stuck on "under processing"', fix: 'Real status steps' },
  { id: 'office-hours',   title: 'Online service closed after 2 PM', fix: 'Available 24/7' },
  { id: 'teleport',       title: 'Governorate silently changes', fix: 'Selection is stable' },
  { id: 'popups',         title: 'Cookie bar + survey + dead chat', fix: 'No interruptions' },
  { id: 'chaos-banner',   title: 'Contradictory marquee banner', fix: 'Hidden' },
];

export const GOVERNORATES = ['بغداد','البصرة','نينوى','أربيل','النجف','كربلاء','الأنبار','ديالى','كركوك','السليمانية','دهوك','ميسان','ذي قار','واسط','بابل','المثنى','القادسية','صلاح الدين'];
