# Bisou — New Today Page: Full Product & Technical Spec

## Table of Contents

0. [Quick Reference — All Blocks at a Glance](#quick-reference--all-blocks-at-a-glance)
1. [User Data We Have](#1-user-data-we-have)
2. [Today Page Layout](#2-today-page-layout)
3. [Dynamic Background](#3-dynamic-background)
4. [Block-by-Block Technical Spec](#4-block-by-block-technical-spec)
   - [Block 0: Header & Streak Badge](#block-0-header--streak-badge)
   - [Block 1: Day Headline](#block-1-day-headline)
   - [Block 2: Today's Energy](#block-2-todays-energy-6-categories)
   - [Block 3: Energy Check-In](#block-3-energy-check-in)
   - [Block 4: Do / Avoid](#block-4-do--avoid)
   - [Block 6: Today's Vibe](#block-6-todays-vibe)
   - [Block 7: Your Day (Morning / Afternoon / Evening)](#block-7-your-day-morning--afternoon--evening)
   - [Block 8: Power Windows](#block-8-power-windows)
   - [Block 9: Cosmic Body Map](#block-9-cosmic-body-map)
   - [Block 10: Daily Oracle](#block-10-daily-oracle)
   - [Block 11: Moon Streak (modal)](#block-11-moon-streak--progress-ring)
   - [Block 12: Achievements](#block-12-achievements)
   - [Block 13: Compatibility Pulse](#block-13-compatibility-pulse)
   - [Block 15: Ask the Stars](#block-15-ask-the-stars)
   - [Block 16: Vedic Dice](#block-16-vedic-dice)
   - [Block 18: Stories Carousel](#block-18-stories-carousel)
5. [Achievement System — Full Spec](#5-achievement-system--full-spec)
6. [Dynamic Background System](#6-dynamic-background-system) _(see Section 3)_
7. [Caching & Performance](#7-caching--performance)
8. [AI Usage Summary](#8-ai-usage-summary)

---

## Quick Reference — All Blocks at a Glance

15 blocks total (0–18, excluding removed: 5, 14, 17, 17i) + dynamic background covering the full page.

| Block        | Name                    | How calculated                                                                                     | AI  | Options / Variants                                                                                       |
| ------------ | ----------------------- | -------------------------------------------------------------------------------------------------- | --- | -------------------------------------------------------------------------------------------------------- |
| BG           | Dynamic Background      | Priority rules + panchang + scores                                                                 | ❌  | **20** base themes × **3** time-of-day tints = up to **60** visual states                                |
| 0            | Header                  | Date, name, streak, grace day flag                                                                 | ❌  | **3** greetings (Morning / Afternoon / Evening); optional 🛡️ if grace day used                           |
| 1            | Day Headline            | panchang + avg score, priority tree                                                                | ❌  | **8** headline types × **8** moon phase labels + social proof line                                       |
| 2            | Today's Energy          | Formula: tithi + vaara + nakshatra modifiers                                                       | ❌  | **6** categories × **0–100** score × **3** labels                                                        |
| 2 _(on tap)_ | Category explanation    | AI (lazy, cached per day)                                                                          | ✅  | 1 fixed text per category per day after cache                                                            |
| **3**        | **Energy Check-In**     | User picks mood emoji → compared to predicted energy band                                          | ❌  | **5** mood options × **3** predicted levels = **15** outcome messages                                    |
| 4            | Do / Avoid              | Tag-matching: **60 do** + **60 avoid** tips against today's signals                                | ❌  | Pool of 120 tips; same signals always return same 3+3                                                    |
| **5**        | **Daily Cosmic Pull**   | (nakshatra_idx × 3 + slot_idx) % 54 → card from 54-entry bank                                      | ❌  | **54** cards across **9** qualities; **3 pulls per day** (morning / afternoon / evening); flip animation |
| 6            | Today's Vibe            | AI (pre-generated nightly, cached)                                                                 | ✅  | 1 fixed text per user per day after cache                                                                |
| 7            | Your Day                | Lookup table: vaara × slot × energy_band                                                           | ❌  | **63** unique texts (7 vaara × 3 slots × 3 energy bands)                                                 |
| **8**        | **Power Windows**       | Hora cycle (Chaldean order from sunrise) + low-energy window by weekday + midday peak window       | ❌  | **5** windows per day × **7** weekdays = **35** fixed windows; current slot highlighted                  |
| **9**        | **Cosmic Body Map**     | Fixed 27-entry lookup: nakshatra → body area + awareness tip                                       | ❌  | **27** unique entries (one per nakshatra); read-only display                                             |
| **10**       | **Daily Oracle**        | 3 face-down cards derived from nakshatra group; user picks one                                     | ❌  | **3** cards per day; each nakshatra has a fixed set of 3 messages (deterministic)                        |
| 11           | Moon Streak             | Check-in count + panchang tithi for icons + grace day rule                                         | ❌  | Streak **0–∞**; progress ring **1–30** (lunar cycle); max 1 grace/7 days                                 |
| 12           | Achievements            | Rules evaluated on each check-in                                                                   | ❌  | **~30** badge types; repeatable ones stack; **View All** opens full modal                                |
| **13**       | **Compatibility Pulse** | Connect onboarding check → partner chart comparison (tithi + vaara + nakshatra delta per category) | ❌  | CTA if not onboarded; otherwise **1–3** match cards with daily score                                     |
| 14           | Reflect on Today        | User-entered text, stored as journal entry                                                         | ❌  | Free text input; saved to user_reflections table                                                         |
| **15**       | **Ask the Stars**       | User types question → deterministic answer from **50-entry bank** keyed to nakshatra × tithi       | ❌  | (nakshatra_index × 3 + tithi) % 50 — same sky = same answer all day                                      |
| **16**       | **Vedic Dice**          | (nakshatra_idx + tithi − 1) % 9 + 1 → number 1–9 with fixed meaning                                | ❌  | **9** numbers × **9** meanings; **1 roll per day** (resets midnight); die-roll animation                 |
| 17           | Tomorrow's Preview      | panchang tomorrow + fixed templates (after 21:00 only)                                             | ❌  | **10** templates                                                                                         |
| 17i          | Tomorrow's Intention    | User-entered text tied to tomorrow's preview headline                                              | ❌  | Free text input; shown next morning as "Your intention for today"                                        |
| 18           | Stories                 | Scheduled via admin + nakshatra/moon lookup                                                        | ❌  | **4–6** cards per day (admin-controlled)                                                                 |

**External Vedic API: not used on Today.** All astronomical calculations are local (Swiss Ephemeris).
**AI calls per user per day: max 7** — 1 vibe text (pre-generated) + up to 6 category explanations (on first tap only, then cached until midnight). Everything else is deterministic: same birth data + same date always returns the same result.
**Interactive blocks (3, 8–10, 13, 15, 16) are user-initiated** — they require a tap/action and are never auto-shown. Block 13 requires Connect onboarding to be completed; users who haven't done it see a CTA instead. Block 16 allows 1 roll per day. Block 10 (Oracle) allows 1 tap per day.

---

## 1. User Data We Have

```
birth_date:     YYYY-MM-DD
birth_place:    lat, lon, timezone_offset
birth_time:     HH:MM  (default 12:00 if unknown)
gender:         string
pronouns:       string[]
name:           string
```

Derived once at registration and stored in `astro_data`:

```
natal_nakshatra, natal_moon_sign, natal_rising,
natal_sun_sign, natal_tithi, natal_vaara
```

---

## 2. Today Page Layout

```
┌─────────────────────────────────────────────────┐
│  [DYNAMIC BACKGROUND — changes with energy]     │
│                                                 │
│  Thu, June 11                 🔔   🔥 14-day   │  ← BLOCK 0
│  Good Morning, Sofia                            │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  BLOCK 1: DAY HEADLINE                  │    │
│  │  ⚡ High Energy Day                     │    │
│  │  The stars are working for you today    │    │
│  │  Thursday · Waxing Moon · Full Moon     │    │
│  │  tomorrow 🌕                            │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
  │  BLOCK 2: TODAY'S ENERGY                        │
  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
  │  │  Love    │ │ Career   │ │  Health  │        │
  │  │   84%    │ │   61%    │ │   77%    │        │
  │  │High Nrgy │ │ Moderate │ │High Nrgy │        │
  │  └──────────┘ └──────────┘ └──────────┘        │
  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
  │  │  Money   │ │  Social  │ │  Family  │        │
  │  │   72%    │ │   90%    │ │   55%    │        │
  │  │High Nrgy │ │High Nrgy │ │ Moderate │        │
  │  └──────────┘ └──────────┘ └──────────┘        │
  │                                                 │
  │  ★ BLOCK 11: ENERGY CHECK-IN                     │
  │  The stars say High Energy. How do you feel?   │
  │  [😴][😐][😊][⚡][🌟]                          │
  │                                                 │
  │  BLOCK 11: DO / AVOID + [Share →]               │
  │                                                 │
  │  ★ BLOCK 12: DAILY COSMIC PULL                │
  │  [face-down card]  ↑ Pull your morning card     │
  │                                                 │
  │  BLOCK 11: TODAY'S VIBE                          │
  │                                                 │
  │  BLOCK 12: YOUR DAY (Morning / Afternoon /       │
  │           Evening — all shown)                  │
  │                                                 │
  │  ★ BLOCK 17: POWER WINDOWS                      │
  │  ☀️ High energy start  7:00–8:30 AM  ● peak    │
  │  ✦  Best decision window 11:48–12:24 ✦ golden  │
  │  ⚠️ Low energy zone    1:30–3:00 PM  ✗ avoid   │
  │  [tap any row for why]                          │
  │                                                 │
  │  ★ BLOCK 18: COSMIC BODY MAP                    │
  │  🫁  PUSHYA DAY                                 │
  │  Body focus: chest, lungs, stomach              │
  │  "Digestive energy is sensitive today…"         │
  │                                                 │
  │  ★ BLOCK 10: DAILY ORACLE                       │
  │  [✦ face-down card — tap once to reveal]        │
  │                                                 │
  │  [🔥 14-day → opens streak modal on tap]         │  ← BLOCK 11 (header pill)
  │                                                 │
  │  BLOCK 12: ACHIEVEMENTS (recent badges)          │
  │  [View all →]                                   │
  │                                                 │
  │  ★ BLOCK 13: TODAY'S COMPATIBILITY             │
  │  [If not onboarded: Complete Connect →]         │
  │  [If onboarded: Marcus 91% · Liam 68%]          │
  │                                                 │
  │  ★ BLOCK 15: ASK THE STARS                       │
  │  [What's on your mind today?            ]       │
  │  [Should I take this opportunity?       ]       │
  │                          [ Ask the stars → ]    │
  │  → Reading Pushya nakshatra… (animation)        │
  │  → "The path you want and the path that's..."   │
  │                                                 │
  │  ★ BLOCK 16: VEDIC DICE                        │
  │  ┌───────┐                                      │
  │  │   7   │  COSMIC NUMBER: WISDOM               │
  │  └───────┘  [Roll]  (once per day)              │
  │                                                 │
  │  BLOCK 18: STORIES CAROUSEL                      │
└─────────────────────────────────────────────────┘
```

---

## 3. Dynamic Background

Like weather apps — the entire Today page background changes based on the day's energy and special events. Selected deterministically, no runtime generation. The system picks an asset key; design creates the assets.

**20 distinct themes** × **3 time-of-day tints** = up to **60 visual states** per day. The base theme changes once per day at midnight. The tint layer shifts automatically with local time (morning / afternoon / evening overlay) — no extra design work, just a CSS-style color filter on the existing asset.

### Background selection (priority order — first match wins)

```javascript
function resolveBackgroundKey(context) {
  const {
    stars_align,
    is_eclipse,
    is_purnima,
    is_amavasya,
    is_nakshatra_birthday,
    is_tithi_birthday,
    is_vaara_birthday,
    is_solstice,
    today_vaara,
    scores,
    average_score,
  } = context;

  const { love, career, health, money, social, family } = scores;

  // ── Priority 1: Rarest cosmic events ──────────────────────────────
  if (stars_align) return "celestial_event"; // nakshatra+tithi+vaara all match natal
  if (is_eclipse) return "eclipse";
  if (is_purnima) return "full_moon";
  if (is_amavasya) return "new_moon";

  // ── Priority 2: Personal special days ─────────────────────────────
  if (is_nakshatra_birthday) return "star_day";
  if (is_tithi_birthday) return "lunar_birthday";
  if (is_vaara_birthday) return "your_day";
  if (is_solstice) return "solar_gate";

  // ── Priority 3: Vaara themes — conditional on ruling category High ─
  // Each vaara only gets its special background when the category
  // it rules is actually High (≥71). Otherwise falls through to score.
  if (today_vaara === "Friday" && love >= 71) return "venus_evening";
  if (today_vaara === "Monday" && family >= 71) return "moon_embrace";
  if (today_vaara === "Thursday" && money >= 71) return "jupiter_abundance";
  if (today_vaara === "Wednesday" && (social >= 71 || career >= 71))
    return "mercury_mind";
  if (today_vaara === "Tuesday" && (health >= 71 || career >= 71))
    return "mars_fire";
  if (today_vaara === "Sunday" && health >= 71) return "sun_radiance";
  if (today_vaara === "Saturday" && career >= 71) return "saturn_clarity";

  // ── Priority 4: Score-based fallback ──────────────────────────────
  if (average_score >= 80) return "golden_hour";
  if (average_score >= 65) return "clear_sky";
  if (average_score >= 50) return "overcast";
  if (average_score >= 35) return "cloudy";
  return "deep_night";
}
```

### Full asset list (20 themes — design creates these)

**Cosmic events (4)**

| Key               | Visual description                                               | Mood                 |
| ----------------- | ---------------------------------------------------------------- | -------------------- |
| `celestial_event` | Shimmering aurora — gold, magenta, teal light rays on deep space | Rare / magical       |
| `eclipse`         | Blood-orange corona ring on black, dramatic shadow gradient      | Intense / rare       |
| `full_moon`       | Silver-white glow bleeding into deep blue-purple                 | Luminous / emotional |
| `new_moon`        | Near-black sky, minimal star scatter, one faint crescent         | Quiet / reset        |

**Personal days (4)**

| Key              | Visual description                                                     | Mood           |
| ---------------- | ---------------------------------------------------------------------- | -------------- |
| `star_day`       | Deep cosmic purple, scattered star bursts, one bright star focal point | Personal peak  |
| `lunar_birthday` | Moonlit silver-blue gradient, soft glow, intimate                      | Reflective     |
| `your_day`       | Warm sunrise gradient, amber-to-rose, gentle rays                      | Celebratory    |
| `solar_gate`     | Prismatic white-gold light beams, clean and radiant                    | Transformative |

**Vaara themes (7 — conditional)**

| Key                 | Planet    | Visual description                                  | Mood               |
| ------------------- | --------- | --------------------------------------------------- | ------------------ |
| `venus_evening`     | Venus ♀   | Rose-pink to warm gold, soft bokeh, romantic        | Warm / romantic    |
| `moon_embrace`      | Moon ☽    | Cool silver mist, blue-white gradient, soft glow    | Nurturing / calm   |
| `jupiter_abundance` | Jupiter ♃ | Royal deep blue with gold veining, expansive        | Optimistic / grand |
| `mercury_mind`      | Mercury ☿ | Electric teal and mint green, crisp lines           | Alert / clever     |
| `mars_fire`         | Mars ♂    | Deep red-orange ember glow, dark edges              | Driven / intense   |
| `sun_radiance`      | Sun ☀     | Bright white-gold, radiant sunburst, energizing     | Vital / clear      |
| `saturn_clarity`    | Saturn ♄  | Midnight blue, fine crystalline texture, structured | Disciplined / cool |

**Score-based fallback (5)**

| Key           | Trigger   | Visual description                        | Mood               |
| ------------- | --------- | ----------------------------------------- | ------------------ |
| `golden_hour` | avg ≥ 80  | Warm amber and soft orange, sun-glow      | Peak energy        |
| `clear_sky`   | avg 65–79 | Soft blue to lavender, gentle and open    | Positive / flowing |
| `overcast`    | avg 50–64 | Light grey-blue with soft light diffusion | Neutral / steady   |
| `cloudy`      | avg 35–49 | Muted cool grey tones, subdued            | Cautious / muted   |
| `deep_night`  | avg < 35  | Dark navy to indigo, minimal              | Low / restful      |

### Time-of-day tint layer

On top of the base background, apply a lightweight color overlay that shifts with local time. This gives continuous visual change through the day at zero design cost.

```
Morning   (midnight – noon)   → warm amber overlay   opacity 0.12
Afternoon (noon – sunset)     → neutral / no tint     opacity 0.00
Evening   (sunset – midnight) → deep indigo overlay   opacity 0.15
```

### Rules

- Base background key determined **once per day** at midnight, stored in `today_summary_cache`.
- Time-of-day tint is applied client-side based on current local time — no cache needed.
- Transition: 0.8s fade when app opens and background key has changed since last visit.
- Tint shift (morning → afternoon → evening): 1.5s slow fade so the user notices the change gradually.

---

## 4. Block-by-Block Technical Spec

---

### Block 0: Header & Streak Badge

**AI: NO** — pure data display.

```
"{weekday}, {Month} {day}"                   ← from today_date
"Good {Morning|Afternoon|Evening}, {name}"   ← from local time + user name
🔔  ← notification bell
🛡️  ← shown only when grace day was used in the current 7-day period
🔥 {streak}-day  ← from user_checkins table
```

Check-in is recorded automatically when user opens the Today page. No action required.

#### Grace Day Rule

A user gets **one grace day per 7-day rolling period**. If they miss a single day:

```
grace_available = (grace_used_count_in_last_7_days == 0)

If grace_available AND days_missed == 1:
  → streak is NOT reset
  → grace_used = true for this period
  → 🛡️ icon appears in header and Moon Streak block
  → text: "Your streak was protected yesterday. One grace day used this week."

If grace_not_available OR days_missed > 1:
  → streak resets to 0 (or 1 on today's check-in)
```

Grace status is stored in `user_checkins.grace_used_at`. The 7-day window is a rolling window (not calendar week).

---

### Block 1: Day Headline

**AI: NO** — fully deterministic.

#### Algorithm

```
1. Compute average_score = mean of 6 category scores (see Block 2)

2. Select headline_type by priority:

   stars_align              → "🌟 Your Special Day"
   is_purnima               → "🌕 Full Moon Day"
   is_amavasya              → "🌑 New Moon Day"
   is_nakshatra_birthday    → "⭐ Your Star Day"
   is_tithi_birthday        → "🎂 Lunar Birthday"
   average_score >= 75      → "⚡ High Energy Day"
   average_score >= 50      → "🌊 Flow With It"
   else                     → "🌙 Rest & Reflect"

3. Subtitle — fixed template map:

   "High Energy Day"   → "The stars are working for you today"
   "Flow With It"      → "A steady day — go with the current"
   "Rest & Reflect"    → "A quiet day. Good for inner work"
   "Full Moon Day"     → "Peak energy. Emotions run high"
   "New Moon Day"      → "Time to set new intentions"
   "Your Star Day"     → "Today's sky matches your birth sky"
   "Your Special Day"  → "A rare alignment — happens only a few times a year"
   "Lunar Birthday"    → "The moon returns to your birth phase"

4. Info line — constructed from parts:
   "{today_vaara} · {moon_phase_label} · {countdown_label}"

5. Social proof line — shown below the info pill:
   "🌍 {n} people are having a {label} day today"

   n is derived deterministically:
     average_score >= 75 → base 8400 + (tithi × 187)
     average_score 50–74 → base 14200 + (tithi × 231)
     average_score < 50  → base 4100 + (tithi × 93)

   label:
     average_score >= 75 → "High Energy"
     average_score 50–74 → "flowing"
     average_score < 50  → "quiet"

   This number is the same for all users with similar scores on the same day.
   It creates a sense of community without requiring real-time data.

   moon_phase_label:
     tithi 1–7   → "Waxing Crescent"
     tithi 8     → "First Quarter"
     tithi 9–14  → "Waxing Gibbous"
     tithi 15    → "Full Moon"
     tithi 16–22 → "Waning Gibbous"
     tithi 23    → "Last Quarter"
     tithi 24–29 → "Waning Crescent"
     tithi 30    → "New Moon"

   countdown_label (show only when ≤ 3 days away):
     "Full Moon tomorrow"
     "Full Moon in 2 days"
     "New Moon tomorrow"
     etc.
```

---

### Block 2: Today's Energy (6 categories)

**AI: NO** — deterministic scoring algorithm.

Same input → always same output.

#### Categories and their Vedic house mapping (shown only in expanded tap view)

| Category | Vedic ruler     | House |
| -------- | --------------- | ----- |
| Love     | Venus (Shukra)  | 7th   |
| Career   | Saturn (Shani)  | 10th  |
| Health   | Sun (Surya)     | 1st   |
| Money    | Jupiter (Guru)  | 2nd   |
| Social   | Mercury (Budha) | 11th  |
| Family   | Moon (Chandra)  | 4th   |

#### Score formula

```
raw_score = 50 + tithi_modifier + vaara_modifier + nakshatra_modifier + birthday_bonus
final_score = clamp(raw_score, 0, 100)
```

#### Tithi modifiers (Shukla paksha / waxing half)

| Tithi            | Love | Career | Health | Money | Social | Family |
| ---------------- | ---- | ------ | ------ | ----- | ------ | ------ |
| Pratipada (1)    | 0    | +10    | 0      | +5    | 0      | 0      |
| Dwitiya (2)      | +5   | 0      | 0      | 0     | +10    | +10    |
| Tritiya (3)      | 0    | +15    | +10    | 0     | 0      | 0      |
| Chaturthi (4)    | 0    | −10    | 0      | −10   | 0      | 0      |
| Panchami (5)     | 0    | +15    | 0      | +10   | 0      | 0      |
| Shashthi (6)     | +5   | 0      | 0      | +15   | 0      | 0      |
| Saptami (7)      | +10  | 0      | 0      | 0     | +15    | 0      |
| Ashtami (8)      | −5   | +5     | +10    | 0     | 0      | 0      |
| Navami (9)       | 0    | −10    | 0      | 0     | 0      | 0      |
| Dashami (10)     | 0    | 0      | 0      | +15   | 0      | +10    |
| Ekadashi (11)    | 0    | +10    | +15    | 0     | 0      | 0      |
| Dwadashi (12)    | +10  | 0      | 0      | 0     | +5     | 0      |
| Trayodashi (13)  | 0    | 0      | +5     | 0     | 0      | +10    |
| Chaturdashi (14) | −5   | −5     | −5     | −5    | −5     | −5     |
| Purnima (15)     | +15  | +15    | +15    | +15   | +15    | +15    |

**Krishna paksha (waning, tithi 16–30):** use the same tithi name as the Shukla table above, but apply a −5 adjustment to every non-zero modifier. Specifically: a +15 becomes +10, a +10 becomes +5, a +5 becomes 0, a 0 stays 0, and a −5 stays −5 (do not make negatives more negative). Exception — Amavasya (tithi 30): Social −15, Love −5, Health +5 (fixed values, not derived from the Shukla table).

Example: Saptami (7) in Shukla has Love +10. Saptami in Krishna → Love +10 − 5 = +5.

#### Vaara (weekday) modifiers

| Vaara     | Planet  | Love | Career | Health | Money | Social | Family |
| --------- | ------- | ---- | ------ | ------ | ----- | ------ | ------ |
| Sunday    | Sun     | 0    | +5     | +10    | 0     | 0      | 0      |
| Monday    | Moon    | +10  | 0      | 0      | 0     | +5     | +15    |
| Tuesday   | Mars    | −5   | +10    | +15    | 0     | 0      | 0      |
| Wednesday | Mercury | 0    | +15    | 0      | +5    | +10    | 0      |
| Thursday  | Jupiter | 0    | +10    | 0      | +15   | 0      | +5     |
| Friday    | Venus   | +20  | 0      | 0      | +5    | +15    | 0      |
| Saturday  | Saturn  | −10  | +5     | 0      | −5    | 0      | 0      |

#### Nakshatra modifiers (today's Moon nakshatra)

| Nakshatra         | Love | Career | Health | Money | Social | Family |
| ----------------- | ---- | ------ | ------ | ----- | ------ | ------ |
| Ashwini           | 0    | 0      | +15    | 0     | 0      | 0      |
| Bharani           | +10  | +10    | 0      | 0     | 0      | 0      |
| Krittika          | 0    | +15    | 0      | 0     | −5     | 0      |
| Rohini            | +15  | 0      | 0      | +10   | 0      | 0      |
| Mrigashira        | 0    | +5     | 0      | 0     | +10    | 0      |
| Ardra             | 0    | −5     | −5     | 0     | +5     | 0      |
| Punarvasu         | 0    | 0      | +10    | 0     | 0      | +15    |
| Pushya            | +15  | 0      | 0      | 0     | +10    | +15    |
| Ashlesha          | −5   | +10    | 0      | 0     | 0      | 0      |
| Magha             | 0    | +15    | 0      | 0     | +5     | 0      |
| Purva Phalguni    | +15  | 0      | 0      | +5    | +15    | 0      |
| Uttara Phalguni   | 0    | +15    | 0      | 0     | 0      | +10    |
| Hasta             | 0    | +10    | 0      | +15   | 0      | 0      |
| Chitra            | +10  | +15    | 0      | 0     | +10    | 0      |
| Swati             | 0    | 0      | 0      | +15   | +10    | 0      |
| Vishakha          | +10  | +15    | 0      | 0     | 0      | 0      |
| Anuradha          | +15  | 0      | 0      | 0     | +15    | 0      |
| Jyeshtha          | 0    | +10    | 0      | 0     | −5     | 0      |
| Mula              | 0    | −5     | −5     | 0     | 0      | 0      |
| Purva Ashadha     | +5   | +10    | 0      | 0     | 0      | 0      |
| Uttara Ashadha    | 0    | +15    | +10    | 0     | 0      | 0      |
| Shravana          | 0    | 0      | 0      | 0     | +15    | +10    |
| Dhanishtha        | 0    | +10    | 0      | +15   | 0      | 0      |
| Shatabhishak      | 0    | +5     | +15    | 0     | 0      | 0      |
| Purva Bhadrapada  | −5   | +5     | 0      | 0     | 0      | 0      |
| Uttara Bhadrapada | 0    | 0      | +10    | 0     | 0      | +15    |
| Revati            | +15  | 0      | 0      | 0     | +15    | 0      |

#### Birthday bonuses

```
is_nakshatra_birthday   → all categories +10
is_tithi_birthday       → Love +15, Family +10
is_vaara_birthday       → Career +10, Social +10
stars_align             → all categories +20
```

#### Score → Label

```
score >= 71  → "High Energy"   (green)
score 41–70  → "Moderate"      (yellow)
score <= 40  → "Low Energy"    (red)
```

#### Category detail view (on tap) — AI: YES, cached

```
INPUT:
  category, score, label, vaara, vaara_planet,
  tithi_name, nakshatra, birthday_flags, pronouns

SYSTEM PROMPT:
  "Write 2 sentences explaining why {category} energy
   is {label} ({score}%) today. Mention the planetary
   and lunar influences naturally. Warm and practical.
   No Sanskrit jargon in main text. Use {pronouns}."

CACHE: per user per day per category (6 calls/day/user).
       Stored in today_summary_cache until next midnight.
```

---

### Block 3: Energy Check-In

**AI: NO** — fully deterministic comparison between predicted energy band and user-selected mood.
**Placement:** Directly below Block 2 (Energy).
**Purpose:** Makes the page interactive immediately after the energy section; builds a personal accuracy log over time; increases daily return motivation.

#### Behaviour

1. The block shows the predicted energy label (High / Moderate / Low) derived from Block 2's average score.
2. Five mood buttons are displayed face-up: 😴 Drained · 😐 Flat · 😊 Okay · ⚡ Energized · 🌟 Electric.
3. User taps one mood — the buttons are replaced with a result card.
4. The result card shows a match label + one sentence based on the alignment between predicted and actual.
5. A small footer shows the running accuracy streak ("Building your accuracy score · N days tracked").
6. User can tap ↩ to reset their pick for the same session (does not affect stored data).

#### Outcome matrix

| Predicted | Actual mood             | Label       | Message                                                        |
| --------- | ----------------------- | ----------- | -------------------------------------------------------------- |
| High      | Energized / Electric    | In sync ⚡  | Your inner state matched the cosmic forecast today.            |
| High      | Flat / Drained          | Off today   | The stars promised more. Your body had other plans. Noted.     |
| Low       | Drained / Flat          | Confirmed   | A quiet day — the stars read you right.                        |
| Low       | Energized / Electric    | Surprise 🌟 | Stronger than predicted. Something is shifting in your favour. |
| Moderate  | Flat / Okay / Energized | Right on    | Steady alignment between forecast and reality.                 |
| Any       | Okay (middle)           | Close       | Small gap between forecast and reality — that's normal.        |

#### Storage

```
user_checkins table (existing) → add column:
  mood_key:    ENUM('drained','flat','okay','energized','electric')  nullable
  mood_picked_at: TIMESTAMP  nullable
```

No separate table needed. If `mood_key` is null the block shows the picker; if set it shows the result card.

---

### Block 4: Do / Avoid

**AI: NO** — fully deterministic. Same input always returns the same 3 Do and 3 Avoid items.

#### How it works

Each tip in the content set has a fixed list of **tags** — conditions under which it is relevant. The selection algorithm scores every tip against today's active signals and picks the top 3 by match count. When two tips have the same score, the one that appears earlier in the fixed-order content list wins (stable sort). No randomness is involved at any stage.

#### Step 1 — Tag vocabulary (full list)

All tags used in the content set. No other tag names are allowed.

```
Vaara tags (7):
  Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday

Paksha tags (2):
  Shukla       ← waxing moon (tithi 1–14)
  Krishna      ← waning moon (tithi 16–29)

Special tithi tags (2):
  Purnima      ← Full Moon (tithi 15)
  Amavasya     ← New Moon (tithi 30)
  Chaturdashi  ← 14th tithi (intense, day before Full/New Moon)

Nakshatra quality tags (2 — group the 27 nakshatras, don't tag individually):
  Nakshatra_Dev      ← benevolent nakshatras: Ashwini, Mrigashira, Punarvasu,
                        Pushya, Hasta, Swati, Anuradha, Shravana, Revati
  Nakshatra_Intense  ← demanding nakshatras: Bharani, Krittika, Ardra,
                        Ashlesha, Magha, Vishakha, Jyeshtha, Mula, Shatabhishak,
                        Dhanishtha, Chaturdashi-linked ones

Category energy tags (12 — only High and Low; Moderate has no tag):
  Love_High, Love_Low
  Career_High, Career_Low
  Health_High, Health_Low
  Money_High, Money_Low
  Social_High, Social_Low
  Family_High, Family_Low

Personal special day tags (4):
  NakshatraBirthday  ← today nakshatra == natal nakshatra
  TithiBirthday      ← today tithi == natal tithi
  VaaraBirthday      ← today vaara == natal vaara
  StarsAlign         ← all three match simultaneously
```

#### Step 2 — Build today's active signals

Signals are derived entirely from panchang and natal comparison. Same for every user with the same birth data on the same day.

```
Active signals = union of:
  → today's vaara tag
  → paksha tag (Shukla or Krishna)
  → Purnima and/or Amavasya if applicable
  → Chaturdashi if tithi is 14 or 29
  → Nakshatra_Dev or Nakshatra_Intense based on today's moon nakshatra
  → category tags where score is High (≥71) or Low (≤40) for each of 6 categories
  → NakshatraBirthday / TithiBirthday / VaaraBirthday / StarsAlign if true
```

#### Step 3 — Score and select

Every tip carries a `tags` list. Score = number of active signals that appear in the tip's tags. Select top 3 by score. Ties broken by fixed position in content set (earlier wins).

```
Example tip:
  text: "Reach out to someone you've been meaning to reconnect with"
  type: do
  tags: [Love_High, Social_High, Friday, Nakshatra_Dev]

  Active signals today: [Friday, Nakshatra_Dev, Love_High, Social_High, ...]
  Score: 4 matches → ranked high
```

#### Step 4 — Fallback hierarchy (coverage guarantee)

If fewer than 3 tips score above 0 after full matching, relax the filter:

```
1. Full match  — use all active signals as above
2. Vaara only  — if <3 results, filter to tips tagged with today's vaara alone
3. Paksha only — if <3 results, filter to tips tagged Shukla or Krishna only
4. Universal   — if <3 results, fill remaining slots from tips tagged with no
                 category or special signals (generic always-relevant tips)
```

Every vaara must have at least 3 Do and 3 Avoid tips tagged to it alone (minimum coverage rule). Content team must verify this before publishing.

#### Step 5 — Determinism guarantee

Because signals are derived from panchang (no randomness) and tie-breaking is by fixed position (not insertion order or time), the same birth data + same date always produces the same 3 Do and 3 Avoid items.

#### Step 6 — Display tags under each tip (UI)

Each tip renders a row of 2–3 small pill-tags that explain _why_ this tip was selected. These are user-friendly translations of the internal tags — not the raw tag names.

```
Internal tag → Display tag
─────────────────────────────
Friday          → "Friday"
Love_High       → "Love ↑"
Love_Low        → "Love ↓"
Career_High     → "Career ↑"
Purnima         → "Full Moon"
Amavasya        → "New Moon"
Chaturdashi     → "Chaturdashi"
Shukla          → "Waxing Moon"
Krishna         → "Waning Moon"
Nakshatra_Dev   → "{nakshatra_name}"  (e.g. "Pushya")
Eclipse         → "Eclipse"
StarsAlign      → "Rare Alignment"
NakshatraBirthday → "Star Day"
```

Show maximum 2–3 tags per tip. Priority: special event tags > category energy tags > vaara/paksha tags.
Do tips use green pills; Avoid tips use amber pills.

---

#### Full content set — DO tips (60 tips)

Each tip is shown with its `tags` array. Tags are from the vocabulary above only.

**Love & Relationships**

```
1.  "Send an unexpected kind message to someone you care about"
    tags: [Love_High, Friday, Nakshatra_Dev]

2.  "Plan a date or quality time with your partner today"
    tags: [Love_High, Friday, Shukla]

3.  "Tell someone directly what you appreciate about them"
    tags: [Love_High, Friday, Social_High]

4.  "Forgive a small tension from the past week — the timing is right"
    tags: [Love_High, Monday, Family_High]

5.  "Spend quality time with a loved one — no phones"
    tags: [Love_High, Monday, Family_High, Shukla]

6.  "Start a conversation you've been avoiding — the energy supports honesty"
    tags: [Love_High, Wednesday, Shukla]

7.  "Reach out to someone you've been meaning to reconnect with"
    tags: [Love_High, Social_High, Wednesday, Nakshatra_Dev]
```

**Career & Productivity**

```
8.  "Start the day with your most important task — energy is with you"
    tags: [Career_High, Tuesday, Saturday]

9.  "Schedule the meeting or conversation you've been postponing"
    tags: [Career_High, Wednesday, Thursday]

10. "Write down your top 3 goals and review your progress"
    tags: [Career_High, Thursday, Saturday, Shukla]

11. "Pitch your idea today — your words carry extra clarity"
    tags: [Career_High, Wednesday, Social_High]

12. "Block 2 hours of deep, uninterrupted work this morning"
    tags: [Career_High, Wednesday, Saturday]

13. "Apply for the opportunity you've been researching"
    tags: [Career_High, Thursday, Money_High, Shukla]

14. "Ask for feedback from someone whose opinion you trust"
    tags: [Career_High, Wednesday, Thursday]

15. "Update your resume, portfolio, or professional profile"
    tags: [Career_High, Saturday, Shukla]

16. "Tackle the task you've been avoiding most — today you have the energy"
    tags: [Career_High, Tuesday, Shukla, Nakshatra_Dev]
```

**Health & Wellness**

```
17. "Get outside for at least 30 minutes — sun energy is high"
    tags: [Health_High, Sunday, Tuesday]

18. "Start a new physical habit today — momentum is on your side"
    tags: [Health_High, Tuesday, Shukla]

19. "Drink an extra litre of water and notice the difference"
    tags: [Health_High, Sunday]

20. "Try a new healthy recipe or cook something nourishing"
    tags: [Health_High, Sunday, Monday]

21. "Book that health appointment you've been postponing"
    tags: [Health_High, Thursday, Saturday]

22. "Do a breathing or meditation session today — even 10 minutes"
    tags: [Health_High, Monday, Saturday]

23. "Take a walk after your next meal"
    tags: [Health_High, Sunday, Wednesday]

24. "Commit to one physical challenge for the next 30 days — start today"
    tags: [Health_High, Tuesday, Shukla]
```

**Money & Finance**

```
25. "Review your monthly budget today — clarity is available"
    tags: [Money_High, Thursday, Shukla]

26. "Transfer to savings today — small consistent acts build wealth"
    tags: [Money_High, Thursday, Saturday]

27. "Research an investment or financial opportunity you've been curious about"
    tags: [Money_High, Thursday, Career_High, Shukla]

28. "Cancel subscriptions you haven't used in 30 days"
    tags: [Money_High, Saturday, Wednesday]

29. "Negotiate something today — a bill, a deal, a rate"
    tags: [Money_High, Career_High, Wednesday, Thursday]
```

**Social & Community**

```
30. "Host an impromptu gathering or invite someone for coffee"
    tags: [Social_High, Friday, Monday, Love_High]

31. "Reply to messages you've been sitting on"
    tags: [Social_High, Wednesday, Friday]

32. "Accept the social invitation you've been debating"
    tags: [Social_High, Friday, Shukla]

33. "Introduce two people who should know each other"
    tags: [Social_High, Wednesday, Thursday]

34. "Post something creative or meaningful online today"
    tags: [Social_High, Friday, Wednesday]

35. "Check in on a friend who might be struggling"
    tags: [Social_High, Monday, Family_High, Nakshatra_Dev]
```

**Family & Home**

```
36. "Call or visit a parent or elder family member today"
    tags: [Family_High, Monday]

37. "Cook a meal for your family or household"
    tags: [Family_High, Monday, Thursday]

38. "Share a memory or old photo with a family member"
    tags: [Family_High, Monday, Shukla]

39. "Create or revive a small family ritual or tradition"
    tags: [Family_High, Monday, Sunday, Shukla]
```

**Special events**

```
40. "Set a powerful new intention during this New Moon — write it down"
    tags: [Amavasya, Shukla]

41. "Release something that no longer serves you on this Full Moon"
    tags: [Purnima]

42. "Celebrate your Star Day — do something meaningful for yourself"
    tags: [NakshatraBirthday]

43. "Journal about your emotional journey on this lunar birthday"
    tags: [TithiBirthday]

44. "Share this rare alignment with someone close — it won't happen again for months"
    tags: [StarsAlign, Love_High, Social_High]

45. "Use this rare alignment day for the decision you've been putting off"
    tags: [StarsAlign, Career_High]
```

**Waxing moon (Shukla paksha)**

```
46. "Begin something new today — the waxing moon supports new starts"
    tags: [Shukla, Career_High, Health_High]

47. "Plant seeds of what you want to grow — literally or metaphorically"
    tags: [Shukla, Monday]

48. "Expand your network this week — outreach lands well under a waxing moon"
    tags: [Shukla, Social_High, Wednesday]

49. "Say yes to the first good opportunity that comes your way today"
    tags: [Shukla, Social_High, Career_High]
```

**General high-energy / universal**

```
50. "Invest in learning something new today — curiosity compounds"
    tags: [Wednesday, Thursday, Career_High, Shukla]

51. "Clean and organize your workspace or home environment"
    tags: [Saturday, Wednesday, Career_High]

52. "Express gratitude to three people who supported you recently"
    tags: [Thursday, Monday, Family_High, Social_High]

53. "Treat yourself to something beautiful today"
    tags: [Friday, Love_High, Health_High]

54. "Prioritize one relationship that matters over work today"
    tags: [Love_High, Family_High, Friday, Monday]

55. "Take a cold shower or contrast bath for an energy reset"
    tags: [Tuesday, Health_High, Sunday]

56. "Start the creative project you've been sketching in your head"
    tags: [Friday, Wednesday, Love_High, Shukla]

57. "Do one thing today that future-you will thank you for"
    tags: [Career_High, Shukla, Thursday]

58. "Take one meaningful step toward a long-term goal"
    tags: [Career_High, Thursday, Shukla, Saturday]

59. "Write down three things you're grateful for this morning"
    tags: [Monday, Sunday, Thursday, Shukla]

60. "Practice saying no to one thing that drains your energy"
    tags: [Saturday, Krishna, Health_High]
```

---

#### Full content set — AVOID tips (60 tips)

**Love & Relationships**

```
1.  "Avoid bringing up old arguments — energy today amplifies conflict"
    tags: [Love_Low, Tuesday, Nakshatra_Intense, Krishna]

2.  "Don't make assumptions about others' feelings — ask instead"
    tags: [Love_Low, Wednesday]

3.  "Skip the passive-aggressive comment you're considering"
    tags: [Love_Low, Tuesday, Chaturdashi]

4.  "Don't send emotionally charged messages late at night"
    tags: [Love_Low, Krishna, Saturday]

5.  "Avoid discussing major relationship decisions today"
    tags: [Love_Low, Amavasya, Saturday, Chaturdashi]

6.  "Don't withdraw emotionally from people who care about you"
    tags: [Family_Low, Monday, Love_Low]

7.  "Don't ghost someone waiting on your reply — clear the air today"
    tags: [Love_Low, Social_Low, Wednesday]
```

**Career & Work**

```
8.  "Don't launch a new project or send a proposal today"
    tags: [Career_Low, Amavasya, Chaturdashi, Krishna]

9.  "Avoid aggressive negotiations — conditions don't favour you"
    tags: [Career_Low, Tuesday, Saturday]

10. "Don't send that critical email before rereading it twice"
    tags: [Career_Low, Wednesday]

11. "Avoid committing to deadlines you can't realistically meet"
    tags: [Career_Low, Saturday, Amavasya]

12. "Don't start job applications or sign contracts today"
    tags: [Career_Low, Chaturdashi, Saturday, Amavasya]

13. "Avoid multitasking — scattered focus will cost you more than it saves"
    tags: [Career_Low, Wednesday, Nakshatra_Intense]

14. "Avoid long meetings that could have been emails today"
    tags: [Career_Low, Wednesday]

15. "Don't skip the details on anything financial today"
    tags: [Money_Low, Saturday, Career_Low]

16. "Avoid second-guessing decisions you've already made well"
    tags: [Career_High, Wednesday, Monday]
```

**Health & Wellness**

```
17. "Avoid overexerting yourself physically — injury risk is elevated"
    tags: [Health_Low, Tuesday, Nakshatra_Intense, Chaturdashi]

18. "Don't skip your meals to power through work"
    tags: [Health_Low, Career_High, Saturday]

19. "Avoid alcohol or stimulants today — your system is more sensitive"
    tags: [Health_Low, Monday, Amavasya, Krishna]

20. "Don't ignore a recurring pain or symptom — act on it today"
    tags: [Health_Low, Saturday]

21. "Avoid staying up past midnight — your recovery window matters tonight"
    tags: [Health_Low, Saturday, Krishna, Amavasya]

22. "Skip intense workouts and opt for stretching or walking instead"
    tags: [Health_Low, Krishna, Chaturdashi]

23. "Avoid heavy or fried meals today — digestion is weakened"
    tags: [Health_Low, Amavasya, Chaturdashi]

24. "Don't take on someone else's emotional burden as your own"
    tags: [Family_High, Monday, Health_Low]
```

**Money & Finance**

```
25. "Don't make impulsive purchases today — the urge will pass"
    tags: [Money_Low, Friday, Love_High]

26. "Avoid lending money today — it rarely comes back under this energy"
    tags: [Money_Low, Saturday, Amavasya]

27. "Don't invest in anything you don't fully understand right now"
    tags: [Money_Low, Amavasya, Chaturdashi]

28. "Avoid signing contracts without legal review"
    tags: [Money_Low, Career_Low, Saturday]

29. "Don't make financial decisions based on pressure or urgency"
    tags: [Money_Low, Saturday, Career_Low]

30. "Skip the retail therapy — fix the root, not the symptom"
    tags: [Money_Low, Love_Low, Friday, Krishna]

31. "Don't trust overly good-to-be-true opportunities today"
    tags: [Money_Low, Career_Low, Amavasya]
```

**Social & Community**

```
32. "Avoid large social gatherings that drain rather than energize you"
    tags: [Social_Low, Amavasya, Krishna]

33. "Don't over-explain yourself to people who won't listen"
    tags: [Social_Low, Saturday, Career_Low]

34. "Avoid gossip — it will reflect back on you under this energy"
    tags: [Social_Low, Nakshatra_Intense, Chaturdashi]

35. "Skip the confrontation — it's not the right time or place"
    tags: [Social_Low, Tuesday, Love_Low]

36. "Don't force social plans on yourself — rest is more valuable tonight"
    tags: [Social_Low, Saturday, Krishna]

37. "Avoid social media arguments or public disputes today"
    tags: [Social_Low, Chaturdashi, Nakshatra_Intense]

38. "Don't make your problems someone else's emergency"
    tags: [Social_Low, Family_Low, Saturday]
```

**Family & Home**

```
39. "Avoid bringing unsolved family tensions into work today"
    tags: [Family_Low, Monday, Career_High]

40. "Don't make promises to family you know you can't keep right now"
    tags: [Family_Low, Thursday, Money_Low]

41. "Avoid comparing your family dynamics to others' — it breeds resentment"
    tags: [Family_Low, Monday, Love_Low]

42. "Don't skip family commitments for social plans tonight"
    tags: [Family_Low, Friday, Social_High]
```

**Waning moon (Krishna paksha)**

```
43. "Avoid starting anything new today — the waning moon favours completion, not initiation"
    tags: [Krishna, Amavasya]

44. "Don't hoard or cling to outcomes — let things resolve naturally"
    tags: [Krishna, Saturday]

45. "Avoid overthinking future plans — the waning phase calls for presence"
    tags: [Krishna, Monday, Love_Low]

46. "Don't hold grudges today — the moon's pull makes them heavier than they need to be"
    tags: [Krishna, Family_Low, Love_Low]

47. "Don't start tasks you can't finish today — completion beats initiation"
    tags: [Krishna, Career_Low, Chaturdashi]
```

**Chaturdashi (14th tithi — intense day)**

```
48. "Avoid all major decisions today — tomorrow's energy is significantly clearer"
    tags: [Chaturdashi]

49. "Don't confront difficult people today — wait for the moon to shift"
    tags: [Chaturdashi, Nakshatra_Intense]

50. "Skip risky or extreme activities today — this is a high-tension tithi"
    tags: [Chaturdashi, Health_Low, Tuesday]

51. "Don't make permanent decisions under temporary pressure today"
    tags: [Chaturdashi, Career_Low, Love_Low]
```

**General / universal**

```
52. "Avoid comparing your progress to others — your path moves at its own speed"
    tags: [Social_Low, Career_Low, Saturday]

53. "Don't suppress what you're feeling — the emotion will demand attention later"
    tags: [Monday, Love_Low, Family_Low]

54. "Avoid the temptation to take on more than you can finish"
    tags: [Career_Low, Thursday, Shukla]

55. "Skip the self-criticism spiral — it changes nothing and drains everything"
    tags: [Health_Low, Saturday]

56. "Avoid rushing important conversations — slow down and listen first"
    tags: [Love_Low, Wednesday, Tuesday]

57. "Don't suppress a creative idea because it feels too bold — note it down"
    tags: [Career_Low, Wednesday, Friday]

58. "Avoid mindless scrolling when you should be resting"
    tags: [Health_Low, Saturday, Krishna]

59. "Don't skip a planned commitment without notice — it affects trust"
    tags: [Career_Low, Social_Low, Saturday]

60. "Avoid dramatic conversations late at night — mornings are always clearer"
    tags: [Love_Low, Monday, Krishna]
```

---

#### Share card

```
Today, {Date}
DO:    tip1 · tip2 · tip3
AVOID: tip1 · tip2 · tip3
#Bisou
```

---

### Block 6: Today's Vibe

**AI: YES** — generated once per day, cached until midnight.

```
INPUT (structured):
  vaara, vaara_planet, tithi_name, nakshatra,
  average_score, headline_type, top_category,
  name, pronouns, birthday_flags

SYSTEM PROMPT:
  "Write a 2-3 sentence daily energy summary for an astrology
   app. Base it only on the facts provided. Warm, friendly,
   practical tone. Mention the weekday and moon phase naturally.
   Do not use Sanskrit terms in the main text. Use {pronouns}."

OUTPUT: 2–3 sentences. Cached in today_summary_cache.
```

---

### Block 7: Your Day (Morning / Afternoon / Evening)

**AI: NO** — fully deterministic. All three sections are always visible. Same input always returns the same text.

#### How it works

Each time slot (Morning, Afternoon, Evening) has one text determined by two inputs:

1. **today_vaara** — the weekday (Sunday through Saturday) — primary key
2. **energy_band** — derived from average category score: `High` (≥71) / `Moderate` (41–70) / `Low` (≤40)

The lookup is: `text = TEMPLATES[vaara][slot][energy_band]`

There is exactly **one text** per combination. No arrays, no random pick. Every day of the week has its own distinct set of texts, so even with the same energy level, Monday reads differently from Friday. A user on High-energy Tuesday always sees the same Tuesday High-energy texts — deterministic and personal.

#### Full lookup table (63 texts)

---

**Sunday (Sun)**

| Slot      | High                                                                                                                    | Moderate                                                                                       | Low                                                                                      |
| --------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Morning   | Sun's energy is at its peak. Ideal for physical activity, self-care rituals, and setting clear intentions for the week. | A calm Sunday morning. Good for gentle movement, reflection, and preparing for the week ahead. | The Sun is gentle today. Rest in the morning and let energy build naturally before noon. |
| Afternoon | Sun's vitality shines through the afternoon. A great time to pursue health goals and express yourself.                  | A steady Sunday afternoon. Good for personal projects and anything that nourishes you.         | Keep the afternoon light. Napping or slow walks serve you better than ambitious plans.   |
| Evening   | Bright Sunday evening — social energy is unexpectedly high. Connect with people who energize you.                       | Wind down gently tonight. Prepare mentally for the week ahead.                                 | Rest is the best use of this evening. Early to bed and tomorrow opens better.            |

---

**Monday (Moon)**

| Slot      | High                                                                                                     | Moderate                                                                                   | Low                                                                                       |
| --------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Morning   | Moon energy is at its strongest this morning. Let feeling lead your decisions — your intuition is sharp. | A reflective Monday morning. Set your emotional tone for the week and don't rush.          | The Moon is waning in strength this morning. Take it slow and avoid confrontations early. |
| Afternoon | Emotional intelligence is your superpower this afternoon. Family and connection conversations go well.   | Moon's midday phase — good for nurturing tasks and checking in with people you care about. | Low moon energy in the afternoon. Stick to routine; creative or emotional work can wait.  |
| Evening   | Moon evenings are made for family and close connection. Reach out to someone you love tonight.           | A gentle Monday night. Good for journaling or quiet conversation.                          | Rest tonight. The Moon needs to recover, and so do you.                                   |

---

**Tuesday (Mars)**

| Slot      | High                                                                                               | Moderate                                                                               | Low                                                                       |
| --------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Morning   | Mars gives you an early burst of power. Tackle the hardest task on your list before 10 AM.         | Some Mars energy available — good for physical activity and focused work this morning. | Mars is subdued today. Don't force early intensity — pace yourself.       |
| Afternoon | Mars energy stays strong. Good for athletic effort, direct conversations, and getting things done. | A decent work afternoon. Push through the medium-difficulty tasks on your list.        | Low energy Tuesday afternoon. Avoid confrontation and rest between tasks. |
| Evening   | Mars evening — good for assertive decisions you've been postponing. Act on what you already know.  | Wind down well. Light exercise helps process today's drive before sleep.               | Low Mars evening. Rest and let the drive return tomorrow.                 |

---

**Wednesday (Mercury)**

| Slot      | High                                                                                            | Moderate                                                                                 | Low                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Morning   | Mercury sharpens your mind this morning. Write, plan, communicate — ideas flow easily today.    | A decent morning for organized thinking. Handle correspondence and planning before noon. | Mercury is quiet this morning. Re-read before sending and avoid important negotiations. |
| Afternoon | Mental energy peaks. Best time for strategy sessions, deep writing, or complex problem-solving. | A steady afternoon for methodical work. Good for following up and tying loose ends.      | Mercury slows this afternoon. Short tasks over deep work.                               |
| Evening   | Mercury evening — excellent for clever conversation, pitching ideas, and social wit.            | A decent evening for casual connection and light reading.                                | Mercury is tired tonight. Rest your mind and return to complex topics tomorrow.         |

---

**Thursday (Jupiter)**

| Slot      | High                                                                                               | Moderate                                                                                       | Low                                                                                      |
| --------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Morning   | Jupiter expands everything it touches today. Morning decisions carry long-term weight — think big. | Jupiter's optimism is available but mild. Good for practical planning and financial decisions. | Jupiter is restrained this morning. Hold off on large commitments — better timing comes. |
| Afternoon | Jupiter's afternoon energy is excellent for growth conversations, teaching, and financial moves.   | A good Thursday for routine work and steady progress toward larger goals.                      | Low Jupiter energy this afternoon. Avoid overcommitting or expanding plans today.        |
| Evening   | Jupiter evenings are generous. Good for hosting, gifting, and abundant thinking.                   | A pleasant Thursday evening. Good for gratitude practice and light social plans.               | Low expansion energy tonight. Keep it simple and rest.                                   |

---

**Friday (Venus)**

| Slot      | High                                                                                                           | Moderate                                                                             | Low                                                                                   |
| --------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Morning   | Venus day starts beautifully. Good morning for self-care, beauty routines, and sending affectionate messages.  | A pleasant Friday morning. Treat yourself — even a small luxury sets the right tone. | Venus is subtle this morning. Light self-care over social effort.                     |
| Afternoon | Venus energy strengthens through the day. Creative work, beauty projects, and relationship effort all go well. | A decent Friday afternoon for aesthetic and creative tasks.                          | Low Venus energy in the afternoon. Quiet your social battery and rest before evening. |
| Evening   | Venus evening — the best time of the week for romance, connection, and pleasure. Go out or invite someone in.  | A pleasant Friday night. Good for relaxed social plans and gentle romance.           | Low energy Venus evening. Stay in and create something beautiful for yourself.        |

---

**Saturday (Saturn)**

| Slot      | High                                                                                                      | Moderate                                                                                         | Low                                                                          |
| --------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Morning   | Saturn rewards discipline today. Start with your hardest, most delayed task — you have the will for it.   | A capable Saturday morning. Good for deep cleaning, long-deferred admin, and structure-building. | Saturn's heaviness is real this morning. One small, useful task is enough.   |
| Afternoon | Saturn afternoon — persistent, focused effort pays off today. Finish what you started this week.          | Steady progress Saturday. Not inspiring, but productive.                                         | A slow Saturn afternoon. Rest without guilt — this too is part of the cycle. |
| Evening   | Saturn evening: good for honest reflection, letting go of what isn't working, and planning the next week. | A decent Saturday night for journaling and reviewing the week.                                   | Saturn's evening calls for rest and silence. Tomorrow will be lighter.       |

---

#### Timing labels

The slot names shown in the UI are time-anchored to the user's local sunrise/sunset from panchang:

```
Morning   → from local midnight until noon (or sunrise + 6h, whichever is later)
Afternoon → from noon until sunset
Evening   → from sunset onward
```

The time boundaries are displayed next to each slot label (e.g., "Morning · until 12:30") so the user knows when each section applies.

---

### Block 8: Power Windows

**AI: NO** — fully deterministic. Calculated from the Vedic hora cycle (60-minute planetary hours from sunrise) + one fixed "avoid" window per weekday + a midday peak window. All derived from weekday and local sunrise time.
**Placement:** Directly below Block 7 (Your Day in Three Parts).
**Purpose:** Answers the question "WHEN should I do this today?" — the most actionable question a user can have. Creates a reason to check the app in the morning and reference it throughout the day.

#### What is displayed

Each day shows **4–5 time windows** with plain-English titles:

| Window type                    | User-facing title                                                          | Source                                                                  | Quality          |
| ------------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------- |
| Peak hora (high-energy planet) | "High energy start", "Deep focus window", "Growth window", etc.            | First hora matching Jupiter, Mercury, Venus, or Sun from sunrise        | ✅ peak (green)  |
| Best decision window           | "Best decision window"                                                     | Fixed calculation: ~11:48 AM – 12:24 PM (adjusts slightly with sunrise) | ✨ golden        |
| Low energy window              | "Low energy zone"                                                          | Fixed table by weekday (approx. 1.5-hour block)                         | ⚠️ avoid (red)   |
| Medium hora                    | Context-specific name ("Communication window", "Gut feeling window", etc.) | 2nd or 3rd useful hora of the day                                       | ✓ medium (amber) |
| Rest / wind-down               | "Wind-down time", "Evening reflection"                                     | Moon hora in evening                                                    | 🌙 rest (blue)   |

**Naming rule:** Window titles must always be plain English — no planetary terms in titles. Technical source (hora planet, Vedic period name) may appear only in the expanded hint text, and even then should be followed by a simple explanation.

The window matching the current time of day (morning / afternoon / evening) is highlighted with a **"Now"** tag and a brighter border.

Tapping a window expands it to show a plain-English explanation of why this window is favorable or unfavorable.

#### Hora calculation algorithm

```
Chaldean order: Sun → Venus → Mercury → Moon → Saturn → Jupiter → Mars → (repeat)

1. Find the planet ruling today's weekday:
     Sunday=Sun, Monday=Moon, Tuesday=Mars, Wednesday=Mercury,
     Thursday=Jupiter, Friday=Venus, Saturday=Saturn
2. That planet rules Hora 1, starting at local sunrise
3. Each subsequent hora lasts exactly 60 minutes
4. Cycle through Chaldean order continuously for all 24 hours
5. For each pre-defined window time, find which hora is active
```

#### Low energy window table (approximate, sunrise ~6:30 AM)

_Internally this is known as "Rahu Kaal" — a standard Vedic calculation for the least favorable daily window. Never shown to users by this name._

| Weekday   | Low energy window   |
| --------- | ------------------- |
| Sunday    | 4:30 – 6:00 PM      |
| Monday    | 7:30 – 9:00 AM      |
| Tuesday   | 3:00 – 4:30 PM      |
| Wednesday | 12:00 – 1:30 PM     |
| Thursday  | 1:30 – 3:00 PM      |
| Friday    | 10:30 AM – 12:00 PM |
| Saturday  | 9:00 – 10:30 AM     |

In production: the low energy window is calculated as `(sunrise_to_sunset / 8) × rahu_kaal_index_by_weekday`. This is a standard Vedic formula requiring actual sunrise/sunset times.

#### Storage

No storage needed. Computed at render time from `vaara` + local sunrise time. Pre-computed into `today_summary_cache` alongside other daily data.

---

### Block 9: Cosmic Body Map

**AI: NO** — fully deterministic. Nakshatra-to-body-part mapping is a fixed lookup table (standard Vedic system).
**Placement:** After Block 8 (Power Windows), before Block 10 (Daily Oracle).
**Purpose:** Shows users where today's cosmic energy lands in their body. Unique — no competitor has this. Creates a moment of self-awareness that bridges astrology and wellbeing. Read-only block; no interaction required.

#### What is displayed

A two-part block:

1. **Body focus line:** The nakshatra-governed body area for today, plain English.
2. **Awareness tip:** A single practical sentence — what to notice, protect, or nurture in that area today.

**Visual:** A simple schematic body outline (SVG) with the governed area highlighted in the day's accent colour. On the right: the text description. Tapping the highlighted zone shows the full tip.

```
🫁  PUSHYA DAY
Body focus: chest, lungs, stomach
"Digestive energy is more sensitive today —
 eat lighter and avoid skipping meals"
```

#### Nakshatra → body part mapping (full 27-entry table)

| Nakshatra         | Body area                    | Awareness tip                                                                    |
| ----------------- | ---------------------------- | -------------------------------------------------------------------------------- |
| Ashwini           | head, brain                  | Sharp starts today — protect against headaches from over-exertion                |
| Bharani           | head, forehead               | Mental load is heavy today — step outside and breathe                            |
| Krittika          | eyes, neck, shoulders        | Screen fatigue hits harder — take visual breaks every 45 min                     |
| Rohini            | throat, mouth, face          | Communication energy is high — use your voice deliberately                       |
| Mrigashira        | throat, upper arms           | Shoulders carry today's tension — stretch before bed                             |
| Ardra             | shoulders, chest             | Emotional weight sits in the upper body today — notice tightness                 |
| Punarvasu         | fingers, lungs, ears         | Breathing is shallower on Punarvasu days — slow inhales help                     |
| Pushya            | chest, stomach, lungs        | Digestive energy is sensitive — eat lighter and avoid skipping meals             |
| Ashlesha          | lungs, joints, knees         | Joints need movement — sitting for long periods will slow you down               |
| Magha             | spine, heart                 | Heart energy is amplified — check in with what you're carrying emotionally       |
| Purva Phalguni    | heart, back, spine           | Posture affects your mood today more than usual — stand tall                     |
| Uttara Phalguni   | hands, intestines, digestion | Gut feelings are literally physical today — trust abdominal signals              |
| Hasta             | hands, bowels                | Detail work with hands is energised — good day for crafting, writing, or cooking |
| Chitra            | forehead, kidneys            | Kidney energy benefits from hydration — drink more water than usual              |
| Swati             | skin, chest, kidneys         | Skin is more reactive today — avoid irritants and get fresh air                  |
| Vishakha          | lower abdomen, thighs        | Lower body needs movement — walk, stretch legs, avoid sitting still              |
| Anuradha          | lower back, hips, thighs     | Lower back tension accumulates — notice and release before evening               |
| Jyeshtha          | neck, tongue, right side     | Speaking clearly matters more today — slow down before you respond               |
| Mula              | feet, lower back             | Grounding energy sits in the feet — walk barefoot or get outside                 |
| Purva Ashadha     | thighs, hips                 | Hip flexibility and movement ease the day's energy                               |
| Uttara Ashadha    | thighs, knees, skin          | Knees and thighs carry today's drive — move them to feel the flow                |
| Shravana          | ears, legs                   | Listening is your strongest sense today — hear before speaking                   |
| Dhanishtha        | ankles, back                 | Ankles and calves need gentle movement — stretch before long walks               |
| Shatabhisha       | ankles, calves, circulatory  | Circulation benefits from movement — avoid sitting for more than 1 hr            |
| Purva Bhadrapada  | feet, calves                 | Feet ground you on Purva Bhadrapada — a short walk resets your state             |
| Uttara Bhadrapada | feet, immune system          | Rest supports your immune energy today — don't push through tiredness            |
| Revati            | feet, digestive system       | A gentle walk and a lighter evening meal serve you well today                    |

#### Storage

No storage needed. Computed from `nakshatra` (today's value from panchang). Pre-included in `today_summary_cache` payload alongside other daily data.

---

### Block 10: Daily Oracle

**AI: NO** — fully deterministic. One card is shown per day, assigned deterministically by nakshatra.
**Placement:** Between Block 9 (Cosmic Body Map) and Block 11 (Moon Streak).
**Purpose:** A daily ritual — one meaningful message revealed once. No choice anxiety, no FOMO from unchosen cards. The single-card format makes each message feel more significant.

#### Behaviour

1. A single face-down card is shown with "Tap to reveal" and "Your message is waiting".
2. The card flips with a CSS 3D animation (Y-axis rotation, ~550ms) when tapped.
3. The revealed face shows: icon, card name, message text, attribution (nakshatra · tithi).
4. **Once per day only** — after flip, the card cannot be reset until midnight.
5. Below the card: "Tap the card to receive today's message" → "✓ Your message for today" after reveal.

#### Card assignment (deterministic)

```
nakshatra_index = index of nakshatra in canonical 27-nakshatra list (0–26)
card            = ORACLE_CARDS[nakshatra_index]
```

**27 unique cards** — one per nakshatra. Each nakshatra has a single fixed message. Same nakshatra always returns the same card, every day that nakshatra is active.

Cards are stored in a `ORACLE_CARDS` constant (27 entries). No database lookup needed for selection.

#### Storage

```
user_checkins table → add column:
  oracle_revealed:  BOOLEAN   not null default false
  oracle_revealed_at: TIMESTAMP nullable
```

---

### Block 11: Moon Streak (modal)

**AI: NO** — fully deterministic.

#### Check-in logic

A check-in is recorded automatically when the user opens the Today page. One check-in per calendar day per user, based on the user's local date (derived from their timezone). No action required from the user.

#### Streak calculation

The streak is the number of consecutive calendar days (in the user's local timezone) on which the user opened the app, ending today. If a day is missed, the streak resets to 1 on the next check-in.

#### Where it appears

The streak is **not a separate page block**. It lives in two places:

1. **Header pill** (always visible): `🔥 Day {N}` — tapping this pill opens the streak modal.
2. **Streak modal** (tap to open): shows **Day N of M** progress toward the next milestone, a day-by-day track (Day 1 → Day N → Day M), progress bar, grace day status, and the simple rule.

#### Streak modal content

```
You're on
🔥  Day 14
of 29 · Full Cycle 🌕

[Day track: 1 ● ● ● … ● ○ ○ … ○ 29]
Day 1 → Day 14 → Day 29

[████████████░░░░░░]  48% to next milestone

{N} more days to unlock Full Cycle 🌕

Miss a day and your streak resets.
One grace day allowed per week.
```

The day track shows completed days (gold), today (larger gold dot), and upcoming days (empty). For long streaks, the track scrolls and shows `···` between segments. Milestone days (3, 7, 14, 29, 90, 180, 365) are highlighted in purple on the track.

Simple. No progress ring, no moon phase strip. **Day N of M** is the point.

#### Milestones (shown in modal goal line)

| Streak | Goal message |
|--------|-------------|
| < 7    | "{7 - N} more days to unlock First Week 🔥🔥" |
| 7–13   | "{14 - N} more days to unlock Moonwalker 🌙" |
| 14–28  | "{29 - N} more days to unlock Full Lunar Cycle 🌕" |
| 29–89  | "{90 - N} more days to unlock Three Moons ✨" |
| ≥ 90   | "✨ Legendary — {N}-day streak" |

#### Grace Day display

When a grace day was used in the current 7-day rolling period, the modal shows:

```
🛡️ Streak protected yesterday
```

See Block 0 for the grace day algorithm and storage details.

---

### Block 12: Achievements

**AI: NO**

Shows the 3 most recently earned badges as a horizontal row, plus a **"View all →"** button that opens the full achievements modal.

#### View All Achievements Modal

A full-screen overlay on the Today page showing all badges organised by category. No navigation away from the page required — modal slides up inside the phone frame.

**Structure:**

```
┌──────────────────────────────────────┐
│  All Achievements          [✕ Close] │
│  ──────────────────────────────────  │
│  [Cosmic Events] [Streak] [Loyalty]  │  ← category tabs (scroll)
│  [Social] [Events]                   │
│  ──────────────────────────────────  │
│  🌕  Full Moon Witness               │
│      Check in on Purnima     ✓ ×3    │  ← earned: ✓ + count if repeatable
│  ──────────────────────────────────  │
│  🌑  New Moon Keeper                 │
│      Check in on Amavasya   🔒       │  ← locked: 40% opacity + lock icon
│  ...                                 │
└──────────────────────────────────────┘
```

**Badge categories (5 tabs):**

| Category          | Badges                                                                                                                           | Repeatable |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Cosmic Events     | Full Moon Witness, New Moon Keeper, Star Day, Lunar Birthday, Your Day, Rare Alignment, Eclipse Chaser, Solstice Keeper          | Yes (all)  |
| Streak Milestones | First Spark (3d), First Week (7d), Moonwalker (14d), Full Cycle (29d), Three Moons (90d), Half Year (180d), Year of Stars (365d) | No         |
| Loyalty           | First Steps (3d), One Week (7d), One Month (30d), Three Months (90d), Half Year (180d), One Full Year (365d)                     | No         |
| Social            | First Connection, Rising Star (5 matches), Star Connector (20 matches), Sky Sharer (share card), Cosmic Invite (refer a friend)  | Partial    |
| Events            | Star Gatherer (event check-in), Event Match, Event Regular (3+ events)                                                           | Partial    |

**States:**

- **Earned, repeatable:** ✓ badge on right + "×{count}" if count > 1
- **Earned, one-time:** ✓ badge on right
- **Locked:** 40% opacity, 🔒 icon on right

---

### Block 13: Compatibility Pulse

**AI: NO** — fully deterministic score based on panchang delta between user and each match.
**Placement:** Between Block 12 (Achievements) and Block 14 (Reflect on Today).
**Purpose:** Bridges the Today page with the Connect tab; creates a daily reason to open Connect; gives matched users a shared topic of conversation.

#### State A — Connect onboarding not completed

If `user.connect_onboarding_completed = false`, the block shows a CTA card:

```
┌─────────────────────────────────────────┐
│  💫                                     │
│  See your energy match with your        │
│  connections today                      │
│                                         │
│  Compatibility changes every day based  │
│  on your astrological alignment.        │
│  Complete your Connect profile to       │
│  unlock it.                             │
│                                         │
│  [ Complete Connect profile → ]         │
└─────────────────────────────────────────┘
```

The CTA button deep-links to the Connect onboarding flow.

#### State B — Connect onboarding completed

Shows 1–3 match cards (limited to current active matches in the Connect tab).

Each card displays:

- Avatar emoji + Name + Birth nakshatra
- Compatibility score (0–100) with colour-coded label
- Score label: **Strong match** (≥80) · **Good match** (≥60) · **Different energies** (≥40) · **Rough day for connection** (<40)
- Tap to expand → shows one-sentence insight explaining _why_ today's scores align or differ

#### Compatibility score algorithm

```
For user A and user B, on date D:

score_A  = average of A's 6 category scores for date D
score_B  = average of B's 6 category scores for date D
delta    = |score_A – score_B|

compat_score = 100 – round(delta * 0.8)   // clamp to [15, 99]
```

The one-sentence insight is selected from a fixed insight template bank:

```
templates keyed by (A_band, B_band):
  ('high', 'high')     → "Both at peak energy today — rare and powerful."
  ('high', 'moderate') → "{A_name}'s energy dominates today — a good listening day for {B_name}."
  ('high', 'low')      → "Strong pull from {A_name}, quiet from {B_name} — give space."
  ('moderate', 'high') → "Their energy is higher today — let them lead the conversation."
  ('moderate', 'moderate') → "Even energy — steady, comfortable day for connection."
  ('moderate', 'low')  → "Different rhythms today — keep interactions light."
  ('low', 'low')       → "Both in quiet energy — depth over activity."
  etc.
```

All templates are deterministic (same inputs → same output).

#### Storage

No new storage needed. Compatibility score is calculated at read time from today's cached scores for both users. Results are cached in `today_summary_cache` alongside the user's own daily data.

---

### Block 15: Ask the Stars

**AI: NO** — fully deterministic. User types any free-text question, receives a pre-written oracular answer from a fixed 50-entry bank, selected by nakshatra × tithi.
**Placement:** After Block 13 (Compatibility Pulse), before Block 16 (Vedic Dice).
**Purpose:** Creates the feeling of mystical guidance while requiring zero AI. The ritual — typing a real question, a brief "reading" animation, a meaningful answer — is emotionally resonant and highly shareable.

#### Behaviour

1. User sees: title + prompt ("What's on your mind today?") + text input.
2. User types any question and taps "Ask the stars →".
3. **1.7-second reading animation**: a pulsing orb with the ✦ symbol and text "Reading {nakshatra} nakshatra…"
4. Answer is revealed with attribution: nakshatra name + tithi number.
5. Once answered, the input is replaced — the user cannot re-ask today.
6. A small note reads: _"This answer is set by today's sky. It won't change until tomorrow."_

#### Answer selection algorithm

```
nakshatra_idx = canonical index of today's nakshatra (0–26)
answer_idx    = (nakshatra_idx × 3 + tithi) % 50
answer        = ANSWER_BANK[answer_idx]
```

The question text is **not used for selection** — the answer is purely astronomical. This is intentional: the same cosmic sky answers everyone the same way today, regardless of what they asked. This is philosophically coherent with Vedic astrology and creates the "the stars knew what I needed to hear" moment.

#### Answer bank

50 unique responses covering the full spectrum of oracle archetypes:

- Direct yes / no / not-yet
- Action nudges ("Move forward. The hesitation is fear, not wisdom.")
- Patience nudges ("Wait three days. The answer will be clearer after the moon shifts.")
- Reflective / reframe ("The answer is already inside you. You're asking the stars to confirm it.")
- Mystery / trust ("This is not a door you open. It opens itself when ready.")

The bank is stored as a constant array in the codebase — no database table needed.

#### Server-side input validation

Before looking up the answer, the backend runs two validation checks on the question text:

**1. Meaningfulness check (AI-powered, lightweight)**

The question is sent to a small classifier (GPT-4o-mini, ~10 tokens, <100ms) that determines whether the input is a genuine question. If the input is gibberish, keyboard spam, or clearly not a question (e.g. "asdaskdhas", "123abc", random characters), the API returns `{ valid: false }` and **no answer is shown**. The UI displays nothing — no error message, no fallback. The input is cleared silently.

```
Prompt: "Is this a genuine question a person would ask? Answer only: yes / no"
Input:  "{user_question}"
```

Cost: ~$0.000005 per request. Called only once per day per user (after first valid question, the result is cached).

**2. Safety override (rule-based, no AI)**

A hardcoded blocklist of patterns detects self-harm, harm to others, or crisis-level language (e.g. "should I jump", "end my life", "hurt someone"). If matched:
- The answer returned is always: **"No."** — unconditionally, regardless of nakshatra or tithi.
- The response also includes a support resource link (configurable per locale).
- This check runs **before** the meaningfulness check and cannot be bypassed.

```javascript
const SAFETY_PATTERNS = [
  /jump.*floor|roof|bridge/i,
  /end.*my.*life|kill.*myself/i,
  /hurt.*someone|harm.*person/i,
  // ... etc
]

function isSafetyOverride(question) {
  return SAFETY_PATTERNS.some(p => p.test(question))
}
```

**Validation flow:**

```
user submits question
        ↓
  safety check (rule-based)
  ├─ match → return "No." + support link
  └─ no match
        ↓
  meaningfulness check (AI)
  ├─ not meaningful → return { valid: false }, UI clears silently
  └─ meaningful
        ↓
  look up answer by (nakshatra_idx × 3 + tithi) % 50
  return answer
```

Note: The demo does not implement these validation steps. They are production-only server-side logic.

#### Storage

```
user_checkins → add column:
  star_question: TEXT  nullable   (the question text, stored for user's history)
  star_answer_idx: SMALLINT nullable  (the index used, for audit/analytics)
  star_asked_at: TIMESTAMP nullable
  star_was_safety_override: BOOLEAN not null default false
```

The stored answer index allows us to reconstruct the exact answer shown to the user, even if the bank order changes (we keep a versioned snapshot).

---

### Block 16: Vedic Dice

**AI: NO** — fully deterministic. Number derived from nakshatra index + tithi modulo 9, mapped to Vedic number meanings.
**Placement:** After Block 15 (Ask the Stars), before Block 18 (Stories).
**Purpose:** A tactile, one-tap daily ritual. User gets their cosmic number for the day — a number 1–9 with a short meaning. The satisfying dice-roll animation creates a habit loop. Earns an achievement on first use. **One roll per day only** (resets at midnight); this scarcity drives daily return.

#### What is displayed

- A stylised die showing today's Vedic number (1–9)
- A one-word quality for that number (e.g. "Clarity", "Strength", "Expansion")
- A two-sentence interpretation personalised to today's sky (nakshatra + number quality)
- A note: _"Your cosmic number resets at midnight"_

```
  ┌───────────┐
  │     7     │  COSMIC NUMBER
  │  ● ● ● ●  │  ANALYSIS
  │  ● ● ●    │
  └───────────┘
  Quality: WISDOM
  "Seven is the number of deep knowing. Today's
   Pushya sky amplifies this — trust what you
   already understand, even if you can't explain it."
```

#### Roll animation

1. User taps "Roll" button (large, tactile)
2. Die face cycles rapidly through 1–9 (300ms, 9 frames at 33ms each)
3. Slows and **lands on the cosmic number** (~400ms deceleration)
4. Number face freezes; quality word fades in; interpretation slides up
5. After reveal: "Roll" button becomes "Rolled ✓" and is disabled for the day

Total animation: ~700ms — feels magical, runs entirely in CSS/JS, no network call.

#### Number selection algorithm

```
nakshatra_idx = canonical nakshatra index (0–26)
cosmic_number = ((nakshatra_idx + tithi - 1) % 9) + 1
```

This produces a number 1–9. Same sky = same number all day. Changes daily.

#### Vedic number meanings (the 9-entry lookup table)

| Number | One-word quality | Full interpretation template                                                                                                            |
| ------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | New Beginnings   | "One is the number of first steps. Today is favoured for starting — an action taken now carries more force than one taken later."       |
| 2      | Balance          | "Two is the number of partnership. What needs to be weighed, shared, or aligned? Today responds well to cooperation over solo effort."  |
| 3      | Expression       | "Three is the number of creativity and communication. Say what needs saying. Create what wants to be made. Today amplifies your voice." |
| 4      | Foundation       | "Four is the number of structure and stability. Build something that will last — plans made today have staying power."                  |
| 5      | Movement         | "Five is the number of change and momentum. Expect movement in situations that felt stuck. Stay adaptable — the shift is real."         |
| 6      | Harmony          | "Six is the number of beauty and care. Relationships and your environment respond to attention today. Small acts of kindness carry."    |
| 7      | Wisdom           | "Seven is the number of deep knowing. Trust what you already understand, even if you can't fully explain it yet."                       |
| 8      | Power            | "Eight is the number of authority and results. Today is for decisions, leadership, and completing what you started."                    |
| 9      | Completion       | "Nine is the number of endings that clear the path. Something finishing today is making space. Let it go cleanly."                      |

#### Storage

```
user_checkins → add column:
  dice_rolled_at: TIMESTAMP nullable   (null = not rolled today)
  dice_number: SMALLINT nullable        (1–9, for analytics/history)
```

The rolled state persists per calendar day (reset at midnight local time). If user rolls, closes app, and returns — they see their result, not a new roll.

---

### Block 18: Stories Carousel

No changes from current implementation. Stories are scheduled via admin panel and personalized by nakshatra / moon_sign lookup.

---

## 5. Achievement System — Full Spec

Achievements are earned automatically on check-in. All checks run server-side in `POST /checkin`.

### Types

- **One-time badges:** earned once, live permanently.
- **Repeatable badges:** can be earned multiple times (accumulate count). Show `× N` on the badge.
- **Milestone badges:** earned at specific streak thresholds, one-time per threshold.

---

### Category 1: Cosmic Events (repeatable)

| Badge ID            | Icon | Name              | Trigger                             | Notes              |
| ------------------- | ---- | ----------------- | ----------------------------------- | ------------------ |
| `full_moon_witness` | 🌕   | Full Moon Witness | Checked in on Purnima               | Once per Full Moon |
| `new_moon_keeper`   | 🌑   | New Moon Keeper   | Checked in on Amavasya              | Once per New Moon  |
| `star_day`          | ⭐   | Star Day          | Checked in on Nakshatra Birthday    | ~once/27 days      |
| `lunar_birthday`    | 🎂   | Lunar Birthday    | Checked in on Tithi Birthday        | ~once/29 days      |
| `vaara_birthday`    | 📅   | Your Day          | Checked in on Vaara Birthday        | Weekly             |
| `rare_alignment`    | 🌟   | Rare Alignment    | Nakshatra + Tithi + Vaara all match | A few times/year   |
| `eclipse_chaser`    | 🌒   | Eclipse Chaser    | Checked in during lunar eclipse     | Very rare          |
| `solar_event`       | ☀️   | Solstice Keeper   | Checked in on solstice or equinox   | 4 times/year       |

---

### Category 2: Streak Milestones (one-time per threshold)

| Badge ID     | Icon | Name          | Trigger                              |
| ------------ | ---- | ------------- | ------------------------------------ |
| `streak_3`   | 🔥   | First Spark   | 3-day streak                         |
| `streak_7`   | 🔥🔥 | First Week    | 7-day streak                         |
| `streak_14`  | 🌙   | Moonwalker    | 14-day streak                        |
| `streak_29`  | 🌕   | Full Cycle    | 29-day streak (one full lunar cycle) |
| `streak_90`  | ✨   | Three Moons   | 90-day streak                        |
| `streak_180` | 🌠   | Half Year     | 180-day streak                       |
| `streak_365` | 🏆   | Year of Stars | 365-day streak                       |

---

### Category 3: Time in App — Loyalty Milestones (one-time)

Triggered by `account_age_days` (days since registration), not streak.

| Badge ID       | Icon | Name          | Trigger                |
| -------------- | ---- | ------------- | ---------------------- |
| `loyalty_3d`   | 🌱   | First Steps   | 3 days since joining   |
| `loyalty_7d`   | 🌿   | First Week    | 1 week since joining   |
| `loyalty_30d`  | 🌳   | One Month     | 30 days since joining  |
| `loyalty_90d`  | 🌲   | Three Months  | 90 days since joining  |
| `loyalty_180d` | 🏔️   | Half Year     | 180 days since joining |
| `loyalty_365d` | 🌌   | One Full Year | 365 days since joining |

---

### Category 4: Social & Matching (one-time or repeatable)

| Badge ID               | Icon | Name             | Trigger                     | Type       |
| ---------------------- | ---- | ---------------- | --------------------------- | ---------- |
| `first_match`          | 💫   | First Connection | First mutual match          | One-time   |
| `five_matches`         | 💫💫 | Rising Star      | 5 matches total             | One-time   |
| `twenty_matches`       | 🌟   | Star Connector   | 20 matches total            | One-time   |
| `compatibility_reader` | 🔭   | Cosmic Reader    | Viewed compatibility report | One-time   |
| `invited_friend`       | 🤝   | Cosmic Invite    | Invited a friend who joined | Repeatable |
| `shared_today`         | 📲   | Sky Sharer       | Shared Today card to social | Repeatable |

---

### Category 5: Events (repeatable per event)

| Badge ID        | Icon | Name          | Trigger                     |
| --------------- | ---- | ------------- | --------------------------- |
| `event_checkin` | 🎪   | Star Gatherer | Checked in at a Bisou event |
| `event_matched` | 🎯   | Event Match   | Got a match at an event     |
| `event_series`  | 🏅   | Event Regular | Attended 3+ events          |

Events are flagged via the existing event check-in system. Badge is awarded when `event_attendance` record is created for a user.

---

### Badge stacking (repeatable badges)

Repeatable badges show count and optionally change appearance at milestones:

```
Full Moon Witness ×1   → 🌕 standard
Full Moon Witness ×3   → 🌕 silver glow
Full Moon Witness ×6   → 🌕 gold glow
Full Moon Witness ×12  → 🌕 with crown (full year)
```

Visual tiers: Standard → Silver → Gold → Crown (at 1×, 3×, 6×, 12+×).

---

### Award logic (runs on every check-in)

```javascript
async function awardBadges(userId, context) {
  const {
    today_tithi,
    is_nakshatra_birthday,
    is_tithi_birthday,
    is_vaara_birthday,
    stars_align,
    is_eclipse,
    streak,
    account_age_days,
    match_count,
    events_attended,
  } = context;

  const rules = [
    {
      id: "full_moon_witness",
      check: () => today_tithi.number === 15,
      repeatable: true,
      dedupe_key: `full_moon_${today_date}`, // one per lunar cycle
    },
    {
      id: "new_moon_keeper",
      check: () => today_tithi.number === 30,
      repeatable: true,
      dedupe_key: `new_moon_${today_date}`,
    },
    {
      id: "star_day",
      check: () => is_nakshatra_birthday,
      repeatable: true,
      dedupe_key: `star_day_${today_date}`,
    },
    {
      id: "lunar_birthday",
      check: () => is_tithi_birthday,
      repeatable: true,
      dedupe_key: `lunar_bday_${today_date}`,
    },
    {
      id: "rare_alignment",
      check: () => stars_align,
      repeatable: true,
      dedupe_key: `alignment_${today_date}`,
    },
    {
      id: "eclipse_chaser",
      check: () => is_eclipse,
      repeatable: true,
      dedupe_key: `eclipse_${today_date}`,
    },
    {
      id: "streak_7",
      check: () => streak === 7,
      repeatable: false,
    },
    {
      id: "streak_14",
      check: () => streak === 14,
      repeatable: false,
    },
    {
      id: "streak_29",
      check: () => streak === 29,
      repeatable: true,
      dedupe_key: `full_cycle_${lunar_cycle_id}`, // unique per lunar cycle
    },
    {
      id: "streak_365",
      check: () => streak === 365,
      repeatable: false,
    },
    // loyalty badges
    {
      id: "loyalty_7d",
      check: () => account_age_days === 7,
      repeatable: false,
    },
    {
      id: "loyalty_30d",
      check: () => account_age_days === 30,
      repeatable: false,
    },
    {
      id: "loyalty_180d",
      check: () => account_age_days === 180,
      repeatable: false,
    },
    {
      id: "loyalty_365d",
      check: () => account_age_days === 365,
      repeatable: false,
    },
  ];

  for (const rule of rules) {
    if (!rule.check()) continue;

    const already = rule.repeatable
      ? await hasEarnedWithKey(userId, rule.id, rule.dedupe_key)
      : await hasEarned(userId, rule.id);

    if (!already) {
      await awardBadge(userId, rule.id, rule.dedupe_key);
    }
  }
}
```

---

## 6. Dynamic Background System

See [Section 3 — Dynamic Background](#3-dynamic-background) for the full spec, all 20 asset keys, the time-of-day tint system, and the selection algorithm. The background key is stored in `today_summary_cache.background_key` and resolved once per day at midnight.

---

## 7. Caching & Performance

### Cache strategy

All expensive content is pre-generated nightly at **00:00 local time** for active users via the existing `today-page-pregen` job.

```
today_summary_cache stores per user per day:
  - background_key          (deterministic, instant)
  - headline_type           (deterministic, instant)
  - category_scores [6]     (deterministic, instant)
  - category_labels [6]     (deterministic, instant)
  - do_tips [3]             (deterministic, instant)
  - avoid_tips [3]          (deterministic, instant)
  - vibe_text               (AI — 1 call, cached)
  - category_explanations   (AI — 6 calls, cached)
  - morning_text            (template, instant)
  - afternoon_text          (template, instant)
  - evening_text            (template, instant)
  - tomorrow_preview        (deterministic, instant — rebuilt nightly)
```

### AI calls per user per day

| Call                                 | Count | Model       |
| ------------------------------------ | ----- | ----------- |
| Vibe text                            | 1     | gpt-4o-mini |
| Category explanation (on-demand tap) | 0–6   | gpt-4o-mini |
| **Max total**                        | **7** |             |

Category explanations are lazy-loaded: generated only when user taps a category for the first time that day, then cached.

### Response time target

- Today page initial load: **< 200ms** (all from cache)
- Category tap explanation (first time): **< 2s** (AI call)
- Category tap explanation (cached): **< 50ms**

---

## 8. AI Usage Summary

| Block                         | AI  | When generated         | Cached until |
| ----------------------------- | --- | ---------------------- | ------------ |
| Day Headline                  | ❌  | —                      | —            |
| Energy Scores                 | ❌  | —                      | —            |
| Energy Labels                 | ❌  | —                      | —            |
| Category Explanation (on tap) | ✅  | On first tap that day  | Midnight     |
| Do / Avoid selection          | ❌  | —                      | —            |
| Do / Avoid texts              | ❌  | Fixed content set      | —            |
| Today's Vibe                  | ✅  | Nightly pre-generation | Midnight     |
| Morning / Afternoon / Evening | ❌  | Fixed template lookup  | —            |
| Moon Streak                   | ❌  | —                      | —            |
| Badge award logic             | ❌  | —                      | —            |
| Tomorrow's Preview            | ❌  | Fixed template lookup  | —            |
| Background key                | ❌  | —                      | —            |
| Stories                       | ❌  | Scheduled content      | —            |

**Summary: 2 AI touch points per day per user** — one vibe text (pre-generated nightly) and up to 6 category explanations (generated lazily on first tap, then cached). Everything else is deterministic and requires no AI call.

---

## Appendix: Determinism Guarantee

Every block that is marked **AI: NO** is fully deterministic:

> **Given the same `birth_data`, `today_date`, and `user_id`, the output is always identical.**

This is ensured by:

- No `Math.random()` anywhere in scoring or selection
- Do/Avoid tie-breaking is by fixed position in the content set (stable sort, earlier entry wins)
- Block 5 texts are selected by a direct two-key lookup: `TEMPLATES[vaara][slot][energy_band]` — no arrays, no index arithmetic
- All panchang calculations via Swiss Ephemeris with fixed Lahiri ayanamsa

AI-generated fields (Vibe text, Category explanations) are generated once and cached, so they also become deterministic after first generation for that day.
