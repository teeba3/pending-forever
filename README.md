# Pending Forever (معلّق للأبد)

A realistic-looking Iraqi e-government services portal (think "Ur") packed with the UX problems citizens actually hit.
Arabic-first (RTL), Next.js + React + Tailwind, static export on GitHub Pages.

Every problem is a switch: open the small **🛠 Bugs** button (top-right) to flip any of them to the fixed behaviour,
see what triggered, or force the session to expire.

## Run
```
npm install
npm run dev     # http://localhost:3000
```

## What's in it
24 services on one grid (you can't tell which ones work): real 5-step application wizard, "under maintenance",
"visit the office", external ministry site that needs a new account, and Sun–Thu 8–2 only services.
Problems include: desktop hamburger menu, 5-minute session, Back/refresh destroys progress, one mistake = empty form,
CAPTCHA from hell, OTP late/wrong number, Arabic digits rejected, date picker from 1900, cryptic upload rules,
"Invalid user name or password", secret password rules, "activated" before email, login forgets your service,
language switch resets everything, no reference number, tracker stuck on "قيد المعالجة", governorate teleport,
popups (cookie/survey/dead chat), contradictory marquee.

## Structure
- `src/bugs/registry.js` — list of problems (add new ones here)
- `src/bugs/BugsContext.jsx` — switches + trigger log
- `src/lib/AppContext.jsx` — session, Back handling, persistence, navigation
- `src/data/services.js` — the services list (add a service = one line)
- `src/components/views/`, `src/components/wizard/` — screens and wizard steps

## Adding a problem
1. Add to `src/bugs/registry.js`. 2. Branch on `isOn('id')` (buggy) / else (fixed). 3. Call `trigger('id', 'detail')`.
