# Pending Forever (معلّق للأبد)

A deliberately broken website that recreates real UX failures common on government portals.
Each scenario ships with the bug **and** its fix — flip "Show fixed version" in the header to compare.

## Run
No build step. `python3 -m http.server` then open http://localhost:8000 (ES modules need http, not file://).

## Scenarios
Password reset ignored · OTP expires before arrival · Account active before verification · Back logs you out ·
Form wipes on one error · Endless loading / no confirmation · Governorate switches · Password rejected silently

## Structure
- `js/core/` — registry, helpers, shared state
- `js/scenarios/` — one file per scenario
- `docs/ADDING_A_SCENARIO.md` — how to add more

## Deploy
GitHub Pages: Settings → Pages → deploy from `main` / root.
