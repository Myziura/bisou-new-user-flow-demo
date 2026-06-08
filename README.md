# Bisou — New User Flow Demo

Interactive demo of the redesigned Bisou onboarding flow (Vue 3 + Vite, no backend).

## What's included

- **Phase 1 — The Hook:** framing → birth date (with micro-reveal) → birth place/time → scanning → full chart reveal
- **Phase 2 — Conversion:** signup wall → email verify → "Almost there"
- **Phase 3 — Today:** home feed with daily reading, highlights, stories, Connect teaser
- **Phase 4 — Connect:** intro → setup (intent → identity → photo → preference → location) → profile strength ladder → swipe deck
- **You tab:** profile page with strength meter and nudges to fill optional fields

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Demo notes

- State persists in `localStorage` so you can refresh mid-flow
- Use the **↺** button on Today to restart the demo
- Chart/sign calculations are mocked for demo purposes (no real ephemeris)
- Styled after Bisou-mobile: Inter + Instrument Serif, blue/orange palette

## Flow map

```
Splash → Hook → Birth Date → Birth Place → Scanning → Reveal
  → Signup → (Verify) → Almost There → Notifications → Today
  → Connect Intro → Connect Intent
```
