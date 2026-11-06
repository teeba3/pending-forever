// Single source of truth for every "feature" (bug). To add one:
//   1. add an entry here  2. check `isOn('your-id')` where it applies
//   3. call `trigger('your-id')` when it fires so the user sees the Bug Detector light up.
export const BUGS = [
  { id: 'state-wipe',   title: 'One-Field Disaster',     fix: 'Keep data, show per-field errors' },
  { id: 'back-logout',  title: 'Back-Button Logout',     fix: 'Back goes to the previous step' },
  { id: 'eternal-load', title: 'Eternal Loader',         fix: 'Show a confirmation number' },
  { id: 'teleport',     title: 'Governorate Teleport',   fix: 'Selection never changes by itself' },
  { id: 'otp-time',     title: 'OTP Time Machine',       fix: 'Fresh code, working timer' },
  { id: 'ghost-active', title: 'Ghost Activation',       fix: 'Pending until email verified' },
  { id: 'silent-pass',  title: 'Silent Password Paradox', fix: 'Explain the rules' },
  { id: 'generic-login', title: 'Generic Login Error',   fix: 'Say which field is wrong' },
  { id: 'chaos-banner', title: 'Chaos Banner',           fix: 'Hide the contradictory notice' },
];

export const GOVERNORATES = ['Baghdad','Basra','Erbil','Najaf','Karbala','Nineveh','Anbar','Diyala','Kirkuk','Sulaymaniyah','Dohuk','Maysan','Dhi Qar','Wasit','Babil','Muthanna','Qadisiyyah','Saladin'];
