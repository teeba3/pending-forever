# Pending Forever (معلّق للأبد)

**UR-Portal Hell Edition** — a Next.js + React + Tailwind parody of a frustrating government portal.
It reproduces real UX failures; each one can be switched to its *fixed* version from the in-app **Bug Detector**.

## Run
```
npm install
npm run dev      # http://localhost:3000
```
Production build is a static export (`npm run build` → `out/`), deployed to GitHub Pages by `.github/workflows/pages.yml`.

## The bugs
State wipe on one error · Back-button logout · Eternal loader · Governorate teleport (every 15s) ·
OTP time machine · Ghost account activation · Silent password rules · Contradictory Arabic marquee banner.
Plus a sarcastic HelpBot that taunts you.

## Structure
- `src/bugs/registry.js` — list of all bugs (add new ones here)
- `src/bugs/BugsContext.jsx` — on/off switches, trigger log, toast
- `src/lib/PortalContext.jsx` — session, step, form state (localStorage), back/teleport logic
- `src/components/steps/` — one file per form step
- `src/components/` — banner, HelpBot, Bug Detector, shell

## Adding a bug
1. Add an entry to `src/bugs/registry.js`.
2. Gate the behaviour with `isOn('your-id')` (buggy) / else (fixed).
3. Call `trigger('your-id', 'what happened')` so the Bug Detector shows it.
