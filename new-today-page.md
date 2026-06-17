# Bisou — Today Page: Full Product & Technical Spec

## UX Principle: Clarity Before Terminology

**This principle is mandatory for every block without exception.**

```
ALWAYS show first:   what it means for the user (plain language, no jargon)
ON TAP show:         why / where it comes from / Vedic terms / technical details
```

Vedic terms (Pushya, Dwadashi, Shukla Paksha, Rahu Kaal) **are never the headline** of a block.
They can appear as a label, tag, or part of the expanded view — but never as the first thing the user sees.

---

## Table of Contents

0. [Quick Reference — All Blocks at a Glance](#quick-reference)
1. [User Data We Have](#1-user-data-we-have)
2. [Today Page Layout](#2-today-page-layout)
3. [Dynamic Background](#3-dynamic-background)
4. [Block-by-Block Technical Spec](#4-block-by-block-technical-spec)
   - [Block 0: Header](#block-0-header)
   - [Block 1: Day Synthesis](#block-1-day-synthesis)
   - [Block 2: Today's Energy (3 categories)](#block-2-todays-energy-3-categories)
   - [Block 3: Nakshatra of the Day](#block-3-nakshatra-of-the-day)
   - [Block 4: Do / Avoid](#block-4-do--avoid)
   - [Block 5: Your Day in Three Parts](#block-5-your-day-in-three-parts)
   - [Block 6: Power Windows + Rahu Kaal](#block-6-power-windows--rahu-kaal)
   - [Block 7: Cosmic Body Map](#block-7-cosmic-body-map)
   - [Block 8: Daily Oracle](#block-8-daily-oracle)
   - [Block 9: Dasha / Antardasha Snapshot](#block-9-dasha--antardasha-snapshot)
   - [Block 10: Stories Carousel](#block-10-stories-carousel)
   - [Block 11: Compatibility Pulse](#block-11-compatibility-pulse)
   - [Block 12: Achievements](#block-12-achievements)
   - [Block 13: Explore Yourself](#block-13-explore-yourself)
   - [Moon Streak (header feature — not a page block)](#moon-streak-header-feature)
5. [Achievement System — Full Spec](#5-achievement-system--full-spec)
6. [Dynamic Background System](#6-dynamic-background-system)
7. [Caching & Performance](#7-caching--performance)
8. [AI Usage Summary](#8-ai-usage-summary)
9. [Determinism Guarantee](#9-determinism-guarantee)

---

## Quick Reference — All Blocks at a Glance

**14 blocks (0–13) + Dynamic Background + Moon Streak (header feature, outside blocks).**

| Block | Name                      | How calculated                                     | AI        | Notes                                                                    |
| ----- | ------------------------- | -------------------------------------------------- | --------- | ------------------------------------------------------------------------ |
| BG    | Dynamic Background        | Priority rules + panchang + scores                 | ❌        | 20 themes × 3 tints = 60 states                                          |
| 0     | Header                    | Date, name, streak pill                            | ❌        | 3 greeting variants; streak tap → modal (see Moon Streak)                |
| 1     | Day Synthesis             | panchang priority tree → 1 sentence                | ❌        | 9 synthesis types; moon transit line (if today); real social proof       |
| 2     | Today's Energy            | Health; avg(Love,Social,Family); avg(Career,Money) | ✅ on tap | 3 rows; level + phrase; on tap: word-only why (no numbers) + AI (cached) |
| 3     | Nakshatra of the Day      | 27-entry lookup (today's moon nakshatra)           | ❌        | Symbol + 1 practical sentence; on tap: devata, quality, full description |
| 4     | Do / Avoid                | Tag-matching: 60 do + 60 avoid tips                | ❌        | Same signals → same 3+3 tips                                             |
| 5     | Your Day in Three Parts   | vaara × slot × energy_band lookup                  | ❌        | 63 texts; replaces Today's Vibe (no AI)                                  |
| 6     | Power Windows + Rahu Kaal | Hora cycle + Rahu Kaal formula + Abhijit           | ❌        | Rahu Kaal properly named; calculated from sunrise/sunset                 |
| 7     | Cosmic Body Map           | 27-entry nakshatra → body area                     | ❌        | Fixed 27-entry lookup; on tap: Vedic body-nakshatra explanation          |
| 8     | Daily Oracle              | nakshatra_index → fixed card (27 cards)            | ❌        | 1 tap/day                                                                |
| 9     | Dasha Snapshot            | Vimshottari system from natal Moon longitude       | ❌        | 1 sentence + tap; requires birth time; accuracy warning if time unknown  |
| 10    | Stories Carousel          | Admin scheduled + nakshatra lookup                 | ❌        | Stories personalized by nakshatra / moon sign                            |
| 11    | Compatibility Pulse       | Energy score delta between matched users           | ❌        | Located near end of page                                                 |
| 12    | Achievements              | Rules evaluated on each check-in                   | ❌        | Second-to-last block                                                     |
| 13    | Explore Yourself          | Static entry points → Reports section              | ❌        | Last block; 5 report cards; no data computed on Today page               |
| —     | Moon Streak               | Check-in count; no grace day                       | ❌        | Header pill + modal only — not a numbered page block                     |

**AI calls per user per day: max 3** — up to 3 energy category explanations (on first tap only, then cached until midnight). Everything else is deterministic.

**External Vedic API: not used.** All astronomical calculations are local (Swiss Ephemeris + Lahiri ayanamsa).

---

## 1. User Data We Have

```
birth_date:     YYYY-MM-DD
birth_place:    lat, lon, timezone_offset
birth_time:     HH:MM  (default 12:00 if unknown — affects Dasha accuracy)
gender:         string
pronouns:       string[]
name:           string
```

Derived once at registration and stored in `astro_data`:

```
natal_nakshatra         (index 0–26)
natal_moon_longitude    (decimal degrees 0–360) ← NEW: needed for Dasha calculation
natal_moon_sign         (0–11)
natal_rising            (0–11)
natal_sun_sign          (0–11)
natal_tithi             (1–30)
natal_vaara             (0–6)
birth_time_known        (boolean — false if default 12:00 was used) ← NEW
```

---

## 2. Today Page Layout

```
┌─────────────────────────────────────────────────┐
│  [DYNAMIC BACKGROUND — changes with energy]     │
│                                                 │
│  Thu, June 11                  🔔   🔥 14-day  │  ← BLOCK 0
│  Good Morning, Sofia                            │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  BLOCK 1: DAY SYNTHESIS                 │   │
│  │  Jupiter's day. Favourable for growth,  │   │
│  │  learning, and important conversations. │   │
│  │                                         │   │
│  │  🌙 Moon enters Capricorn at 21:47      │   │  ← moon transit (if today)
│  │  🌍 842 people in Bisou have a similar  │   │  ← real social proof
│  │     day today                           │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  BLOCK 2: TODAY'S ENERGY (3 cards)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Health  │  │Relations │  │  Career  │      │
│  │  ▓▓▓▓▓   │  │  ▓▓▓░░   │  │  ▓▓▓▓░   │      │
│  │ Body is  │  │ Steady   │  │ Energy   │      │
│  │  on your │  │relations │  │for work  │      │
│  │  side    │  │          │  │    is    │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│                                                 │
│  ★ BLOCK 3: NAKSHATRA OF THE DAY               │
│  🌸  Today is Pushya                            │
│  The sky is tuned to nurturing and warmth.      │
│  [ What is Pushya? ]                            │
│                                                 │
│  BLOCK 4: DO / AVOID + [Share →]               │
│                                                 │
│  BLOCK 5: YOUR DAY IN THREE PARTS              │
│  ☀️ Morning · 🌤 Afternoon · 🌙 Evening        │
│                                                 │
│  ★ BLOCK 6: POWER WINDOWS                      │
│  ⚡ 07:00–08:30  Active start    ● Jupiter hora │
│  ✦  11:48–12:24  Abhijit Muhurta ✦ gold        │
│  ⚠️  14:45–16:30  Rahu Kaal       ✗ avoid       │
│  [tap → explanation]                            │
│                                                 │
│  BLOCK 7: COSMIC BODY MAP                      │
│  🫁  PUSHYA DAY · chest, lungs, stomach        │
│                                                 │
│  ★ BLOCK 8: DAILY ORACLE                       │
│  [✦ face-down card — tap once to reveal]       │
│                                                 │
│  BLOCK 9: DASHA SNAPSHOT                      │
│  🪐 You are in the Venus cycle                 │
│  Time of relationships, beauty, and joy        │
│  This cycle runs until February 2027           │
│  [ What does this mean? ]                      │
│                                                 │
│  BLOCK 10: STORIES CAROUSEL                    │
│                                                 │
│  ★ BLOCK 11: COMPATIBILITY PULSE               │
│  [Marcus 91% · Liam 68%]                       │
│                                                 │
│  BLOCK 12: ACHIEVEMENTS                        │
│  [recent badges]  [View all →]                 │
│                                                 │
│  BLOCK 13: EXPLORE YOURSELF                    │
│  💞 Synastry Report          ›                 │
│  📅 Best Day to Meet         ›                 │
│  🌊 Relationship Forecast    ›                 │
│  🪐 Group Compatibility      ›                 │
│  🌀 Past Relationship Reading ›                │
└─────────────────────────────────────────────────┘
```

---

## 3. Dynamic Background

Like weather apps — the entire Today page background changes based on the day's energy and special events. Selected deterministically, no runtime generation. The system picks an asset key; design creates the assets.

**20 distinct themes** × **3 time-of-day tints** = up to **60 visual states** per day. The base theme changes once per day at midnight. The tint layer shifts automatically with local time (morning / afternoon / evening overlay).

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
  if (stars_align) return "celestial_event";
  if (is_eclipse) return "eclipse";
  if (is_purnima) return "full_moon";
  if (is_amavasya) return "new_moon";

  // ── Priority 2: Personal special days ─────────────────────────────
  if (is_nakshatra_birthday) return "star_day";
  if (is_tithi_birthday) return "lunar_birthday";
  if (is_vaara_birthday) return "your_day";
  if (is_solstice) return "solar_gate";

  // ── Priority 3: Vaara themes — conditional on ruling category High ─
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

### Full asset list (20 themes)

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

```
Morning   (midnight – noon)   → warm amber overlay   opacity 0.12
Afternoon (noon – sunset)     → neutral / no tint     opacity 0.00
Evening   (sunset – midnight) → deep indigo overlay   opacity 0.15
```

**Rules:**

- Base background key resolved **once per day** at midnight, stored in `today_summary_cache`.
- Tint applied client-side from local time — no cache needed.
- Transition: 0.8s fade when background key changes since last visit.
- Tint shift (morning → afternoon → evening): 1.5s slow fade.

---

## 4. Block-by-Block Technical Spec

---

### Block 0: Header

**AI: NO**

```
"{Weekday}, {Month} {day}"                   ← from today_date
"Good {Morning|Afternoon|Evening}, {name}"   ← from local time + user.name
🔔  ← notification bell
🔥 {streak}-day
```

Check-in is recorded automatically when user opens the Today page. No user action required.

#### Streak Rule

```
If user checked in yesterday:  streak = yesterday_streak + 1
If user missed yesterday:      streak = 1  (today is day 1)
```

Missing a day resets the streak to 1 on next visit.

Streak pill and modal details: see [Moon Streak (header feature)](#moon-streak-header-feature).

---

### Block 1: Day Synthesis

**AI: NO** — fully deterministic.

#### Purpose

Transform today's panchang into **one plain-language sentence** that communicates what kind of day it is. Users must not need to know any Vedic terms to understand the main message.

#### Required inputs

```
today_date, today_vaara (weekday string), average_score (number 0–100),
is_purnima, is_amavasya, is_eclipse, stars_align,
is_nakshatra_birthday, is_tithi_birthday, is_vaara_birthday,
today_nakshatra (index 0–26), today_tithi (1–30),
moon_nakshatra_at_start_of_day, moon_nakshatra_at_end_of_day,
moon_sign_at_start_of_day, moon_sign_at_end_of_day,
transit_time (if applicable), sign_transit_time (if applicable),
user_energy_band ('high' | 'moderate' | 'low'),
social_proof_count (from today_summary_cache)
```

#### Step 1 — Compute average_score

```
average_score = mean of all 6 individual category scores
(love, career, health, money, social, family — calculated in Block 2)
```

#### Step 2 — Select synthesis_type by priority

```
if stars_align:           synthesis_type = "stars_align"
elif is_eclipse:          synthesis_type = "eclipse"
elif is_purnima:          synthesis_type = "purnima"
elif is_amavasya:         synthesis_type = "amavasya"
elif is_nakshatra_birthday: synthesis_type = "nakshatra_birthday"
elif is_tithi_birthday:   synthesis_type = "tithi_birthday"
elif is_vaara_birthday:   synthesis_type = "vaara_birthday"
else:                     synthesis_type = "regular_day"
```

#### Step 3 — Build synthesis sentence

For special days (types 1–7), use fixed strings:

```javascript
const SPECIAL_DAY_SENTENCES = {
  stars_align:
    "A rare day — three Vedic cycles align with your birth. Uniquely yours.",
  eclipse: "Eclipse day. Time to release the old and prepare for renewal.",
  purnima:
    "Full Moon. Energy at its peak — good for completing things and celebrating.",
  amavasya: "New Moon. A quiet day, ideal for new intentions and inner work.",
  nakshatra_birthday:
    "Today's sky matches your birth sky. One of the most personal days of the month.",
  tithi_birthday:
    "The Moon has returned to its birth phase. Good for relationships and self-care.",
  vaara_birthday:
    "Your birth planet rules today. Your natural energy is amplified.",
};
```

For `regular_day`, combine vaara base + energy band suffix:

```javascript
const VAARA_BASE = {
  Sunday: "Sun's day.",
  Monday: "Moon's day.",
  Tuesday: "Mars's day.",
  Wednesday: "Mercury's day.",
  Thursday: "Jupiter's day.",
  Friday: "Venus's day.",
  Saturday: "Saturn's day.",
};

const VAARA_SUFFIX = {
  // high = average_score >= 71
  Sunday: {
    high: "Favourable for health, clarity, and vitality.",
    moderate: "Energy is steady — go at your own pace.",
    low: "A quiet day. Rest matters more than achievement.",
  },
  Monday: {
    high: "Favourable for family, care, and intuition.",
    moderate: "A calm day. Good for home and domestic matters.",
    low: "Low energy — a good time for quiet recovery.",
  },
  Tuesday: {
    high: "Favourable for bold action and overcoming obstacles.",
    moderate: "Moderate energy — don't force it, but don't stop.",
    low: "Avoid conflict and overexertion today.",
  },
  Wednesday: {
    high: "Favourable for negotiation, learning, and planning.",
    moderate: "A good day for communication, without big decisions.",
    low: "Mercury is quiet. A day for observation, not action.",
  },
  Thursday: {
    high: "Favourable for growth, learning, and important decisions.",
    moderate: "A steady day — learning and spiritual practice will help.",
    low: "Jupiter is quiet. Rest and build your strength.",
  },
  Friday: {
    high: "Favourable for relationships, beauty, and joy.",
    moderate: "A calm Venus day — good for personal time.",
    low: "Venus asks for recovery. Time for yourself.",
  },
  Saturday: {
    high: "Favourable for structured work and discipline.",
    moderate: "A good day for routine and clearing your task list.",
    low: "Saturn in shadow. Rest without guilt.",
  },
};

// energy_band derived from average_score:
//   average_score >= 71 → 'high'
//   average_score 41–70 → 'moderate'
//   average_score <= 40 → 'low'

const sentence =
  VAARA_BASE[today_vaara] + " " + VAARA_SUFFIX[today_vaara][energy_band];
```

**Example:** Thursday, average_score = 78 → `"Jupiter's day. Favourable for growth, learning, and important decisions."`

#### Step 4 — Moon Transit Line

Shown **only** if the Moon changes nakshatra or sign today.

```
Calculation:
  moon_nakshatra_at_start = nakshatra of Moon at 00:00:00 local time (Swiss Ephemeris)
  moon_nakshatra_at_end   = nakshatra of Moon at 23:59:59 local time

  moon_sign_at_start = rashi of Moon at 00:00:00 local time
  moon_sign_at_end   = rashi of Moon at 23:59:59 local time

Priority: if sign changes, show sign change (encompasses nakshatra change).
          if only nakshatra changes (same sign), show nakshatra change.
          if neither changes, show nothing.

For sign change:
  sign_transit_time = binary search on ephemeris for exact crossing time
  display: "🌙 Moon enters {RASHI_EN_NAME[new_sign]} at {sign_transit_time} — {SIGN_TRANSIT_EFFECT[new_sign]}"

For nakshatra change only:
  transit_time = binary search on ephemeris for exact crossing time
  display: "🌙 Moon moves into {NAKSHATRA_EN_NAME[new_nakshatra]} at {transit_time}"
```

**Rashi names and transit effects (12 entries):**

| Rashi (EN)  | Transit effect                                |
| ----------- | --------------------------------------------- |
| Aries       | expect more initiative and decisiveness       |
| Taurus      | mood becomes more stable and sensual          |
| Gemini      | day becomes more dynamic, talkative mood      |
| Cancer      | emotions deepen, a pull toward home           |
| Leo         | energy rises and the urge to express yourself |
| Virgo       | attention to detail and practical matters     |
| Libra       | need for harmony and balance                  |
| Scorpio     | deep and intense mood                         |
| Sagittarius | optimism rises and a desire for movement      |
| Capricorn   | serious and structured mood                   |
| Aquarius    | independent mood, original ideas              |
| Pisces      | dreamy and intuitive mood                     |

#### Step 5 — Social Proof Line

**Real data.** Shown only if `count >= 10`.

`🌍 ${count} people in Bisou are having a ${day} day today`

`energy_band` for a user: `average_score >= 71 → 'high'`, `41–70 → 'moderate'`, `<= 40 → 'low'`.

---

### Block 2: Today's Energy (3 categories)

**AI: Optional on tap only** — max 3 AI calls per user per day, cached until midnight.

#### 3 categories and their aggregation

| Category       | Includes               | Formula                                                 |
| -------------- | ---------------------- | ------------------------------------------------------- |
| Health         | Health                 | `health_score`                                          |
| Relationships  | Love + Social + Family | `round((love_score + social_score + family_score) / 3)` |
| Career & Money | Career + Money         | `round((career_score + money_score) / 2)`               |

All 6 base scores are aggregated into 3 categories for display.

#### Formulas for 6 base scores

```
raw_score = 50 + tithi_modifier + vaara_modifier + nakshatra_modifier + birthday_bonus
final_score = clamp(raw_score, 0, 100)
```

**Tithi modifiers (Shukla paksha / waxing half):**

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

**Krishna paksha (waning, tithi 16–30):** use same table but subtract 5 from every non-zero positive modifier. A +15 becomes +10, +10 → +5, +5 → 0. Negatives don't go more negative. Exception — Amavasya (tithi 30): Social −15, Love −5, Health +5 (fixed values).

**Vaara (weekday) modifiers:**

| Vaara     | Planet  | Love | Career | Health | Money | Social | Family |
| --------- | ------- | ---- | ------ | ------ | ----- | ------ | ------ |
| Sunday    | Sun     | 0    | +5     | +10    | 0     | 0      | 0      |
| Monday    | Moon    | +10  | 0      | 0      | 0     | +5     | +15    |
| Tuesday   | Mars    | −5   | +10    | +15    | 0     | 0      | 0      |
| Wednesday | Mercury | 0    | +15    | 0      | +5    | +10    | 0      |
| Thursday  | Jupiter | 0    | +10    | 0      | +15   | 0      | +5     |
| Friday    | Venus   | +20  | 0      | 0      | +5    | +15    | 0      |
| Saturday  | Saturn  | −10  | +5     | 0      | −5    | 0      | 0      |

**Nakshatra modifiers (today's Moon nakshatra):**

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

**Birthday bonuses:**

```
is_nakshatra_birthday → all 6 categories +10
is_tithi_birthday     → Love +15, Family +10
is_vaara_birthday     → Career +10, Social +10
stars_align           → all 6 categories +20
```

#### Score → Label

```
score >= 71 → "High"     (green)
score 41–70 → "Moderate" (yellow)
score <= 40 → "Low"      (red/muted)
```

#### Display phrase per category + band

Shown on card directly below the level label:

| Category       | High                                  | Moderate               | Low                   |
| -------------- | ------------------------------------- | ---------------------- | --------------------- |
| Health         | "Body is on your side"                | "Listen to your body"  | "Time to rest"        |
| Relationships  | "A great day for the people you love" | "Steady relationships" | "Time for yourself"   |
| Career & Money | "Energy for work is here"             | "A steady workday"     | "Avoid big decisions" |

#### Visual indicator

Each card shows a horizontal bar or arc (no number):

- 🟢 Green → High
- 🟡 Yellow → Moderate
- 🔴 Muted → Low

Percentage and numeric scores are never shown to the user — only the level label (High / Moderate / Low) on the collapsed row.

#### On tap — expanded view

Tapping a category row expands an inline panel below it. Only one category may be open at a time.

**What the user sees:**

A short paragraph (2–3 sentences) explaining _why_ the level is what it is — in plain language, using Vedic terms (tithi, vaara, nakshatra, ruling planet) but **no numbers, percentages, or score tables**.

Example (Health · High):

> Health carries strong graha-shakti today. Surya governs the 1st house — the body, prana, and daily strength. Purnima tithi — Chandra at full brilliance in Shukla paksha (waxing Moon) — floods the chart with lunar shakti for physical vitality and ojas. Chandra in Pushya nakshatra — presided by Brihaspati, Tamas guna — nourishes physical vitality and ojas.

Each explanation weaves **panchang** elements (tithi, vara, paksha, nakshatra) with **graha** lords (Surya, Chandra, Shukra, Shani, Guru, Budha), **house** themes, and nakshatra **devata/guna** where relevant. No numbers in user-facing text.

**Interaction:**

```
onTap(category_key):
  if expanded == category_key → collapse
  else → expand category_key, collapse others

if explanation not in cache:
  call AI once (see below) — AI receives score internally but output must contain no numbers
  store in today_summary_cache.energy_explanations[category_key]
else:
  read from cache
```

**Implementation notes for programmers (internal — not shown in UI):**

```javascript
// Dominant component for merged categories (used to pick which modifiers drive the explanation)
dominant_relations  = argmax(love_score, social_score, family_score)
dominant_affairs    = career_score >= money_score ? 'career' : 'money'

function getCategoryBreakdown(user, category_key):
  underlying = resolve_underlying_category(category_key)
  idx = index of underlying in [love, career, health, money, social, family]
  tithi_mod     = lookup_tithi_modifier(today_tithi, today_paksha, idx)
  vaara_mod     = lookup_vaara_modifier(today_vaara, idx)
  nakshatra_mod = lookup_nakshatra_modifier(today_nakshatra, idx)
  birthday_mod  = lookup_birthday_bonus(user.birthday_flags, idx)
  raw = 50 + tithi_mod + vaara_mod + nakshatra_mod + birthday_mod
  return { tithi: tithi_mod, vaara: vaara_mod, nakshatra: nakshatra_mod, birthday: birthday_mod }

// Map modifier sign (+/−/0) → natural-language sentence per source (tithi, vaara, nakshatra, birthday)
// Pick top 2 non-zero influences + band intro sentence → user-facing paragraph
// merged_score used only for band label and AI input — never displayed
```

#### On tap — AI explanation (cached, max 3/day/user)

```
INPUT:
  category_name, merged_score, label, vaara, vaara_planet,
  tithi_name, nakshatra, birthday_flags, pronouns

  For merged categories:
    "Relationships": dominant component = whichever of love/social/family has highest individual score
    "Career & Money": dominant component = career if career_score > money_score, else money

SYSTEM PROMPT:
  "Write 2–3 sentences explaining why {category_name} energy
   is {label} today. Use Vedic astrology terms naturally: tithi, vara,
   paksha, nakshatra, graha names (Surya, Chandra, Shukra, Shani, Guru, Budha),
   relevant houses, and nakshatra deity where relevant. Warm and practical.
   No numbers, percentages, or score values in the output.
   No untranslated Sanskrit jargon — explain terms in context. Use {pronouns}."

CACHE: per user per day per category (3 calls max/day/user).
```

---

### Block 3: Nakshatra of the Day

**AI: NO** — deterministic 27-entry lookup.

#### Purpose

Shows today's Moon nakshatra as a practical, human-readable insight. The symbol and one-sentence meaning are immediately understandable without any Vedic knowledge. The term "nakshatra" is introduced only as context, never as the headline.

#### Data source

`today_nakshatra_idx` = index of the Moon's nakshatra at the time of local midnight (0–26), from Swiss Ephemeris. Same value used in Block 2 nakshatra modifiers.

#### Display

```
┌─────────────────────────────────────────────┐
│  {emoji}                                    │
│                                             │
│  Today is {nakshatra_name} day              │
│                                             │
│  {main_text}                                │
│                                             │
│  [ What is {nakshatra_name}? ]              │
└─────────────────────────────────────────────┘
```

If moon transit happens today (see Block 1 Step 4), add below the main text:

```
🌙 After {transit_time} → {new_nakshatra_name} day
```

#### On tap — Optional expanded view

```
{nakshatra_name}

Devata: {devata_name}
Symbol: {symbol_description}
Quality: {guna}

{extended_description}   ← 3–5 sentences, content team writes these
```

#### Full 27-entry lookup table

| #   | Nakshatra         | Emoji | Devata                              | Main text                                                                                 | Quality  |
| --- | ----------------- | ----- | ----------------------------------- | ----------------------------------------------------------------------------------------- | -------- |
| 0   | Ashwini           | 🐴    | Ashwins (celestial physicians)      | A day for new beginnings and healing. Act boldly — now is the right time to start.        | Deva     |
| 1   | Bharani           | 🌀    | Yama (god of dharma)                | A day of transformation. Release what no longer serves you — it clears space for the new. | Manushya |
| 2   | Krittika          | 🔥    | Agni (god of fire)                  | A day of strength and clarity. Time for decisive action and direct communication.         | Rakshasa |
| 3   | Rohini            | 🌹    | Brahma (the creator)                | A day of beauty and creativity. Good for art, love, and pleasure.                         | Manushya |
| 4   | Mrigashira        | 🦌    | Soma (the Moon)                     | A day of curiosity and seeking. Explore something new — it will surprise you.             | Deva     |
| 5   | Ardra             | 💧    | Rudra (Shiva)                       | A day of depth and change. Allow the transformation — it is already happening.            | Manushya |
| 6   | Punarvasu         | ✨    | Aditi (mother of the gods)          | A day of renewal. Return to what you set aside — now is the right time.                   | Deva     |
| 7   | Pushya            | 🌸    | Brihaspati (Jupiter)                | A day of nurturing and support. Care for those close to you — and yourself.               | Deva     |
| 8   | Ashlesha          | 🐍    | Nagas (serpents)                    | A day of perception. Intuition is strong — trust what you feel.                           | Rakshasa |
| 9   | Magha             | 👑    | Pitris (ancestors)                  | A day of respect and tradition. Good for official matters and honouring your roots.       | Rakshasa |
| 10  | Purva Phalguni    | 🛏️    | Bhaga (pleasure)                    | A day of rest and enjoyment. Allow yourself to do nothing — that is also a practice.      | Manushya |
| 11  | Uttara Phalguni   | 🤝    | Aryaman (partnership)               | A day of partnership and commitment. Good for agreements and shared endeavours.           | Manushya |
| 12  | Hasta             | ✋    | Savitar (creative force of the Sun) | A day of skill and detail. Handwork and small tasks come out especially well.             | Deva     |
| 13  | Chitra            | 💎    | Vishwakarma (architect of the gods) | A day of beauty and mastery. Create, adorn, pay attention to details.                     | Rakshasa |
| 14  | Swati             | 🌿    | Vayu (wind)                         | A day of independence. Follow your own path and don't cling to outcomes.                  | Deva     |
| 15  | Vishakha          | 🎯    | Indra and Agni                      | A day of focus. Staying on target brings results.                                         | Rakshasa |
| 16  | Anuradha          | 🪷    | Mitra (friendship)                  | A day of friendship and resilience. Support those around you — they will support you.     | Deva     |
| 17  | Jyeshtha          | ⚡    | Indra (king of gods)                | A day of strength and leadership. Take responsibility and show your power.                | Rakshasa |
| 18  | Mula              | 🌱    | Nirrti (dissolution)                | A day of deep inquiry. Good for meditation and exploring your roots.                      | Rakshasa |
| 19  | Purva Ashadha     | 🌊    | Apas (water goddesses)              | A day of purification and confidence. Stand firm despite doubts.                          | Manushya |
| 20  | Uttara Ashadha    | 🏔️    | Vishwedevas (all gods)              | A day of victory and reliability. What you begin today is stable and long-lasting.        | Manushya |
| 21  | Shravana          | 👂    | Vishnu (the preserver)              | A day of listening and learning. Listen more, speak less.                                 | Deva     |
| 22  | Dhanishtha        | 🥁    | Ashta Vasus (8 elements)            | A day of abundance and movement. A good time for physical activity.                       | Rakshasa |
| 23  | Shatabhishak      | 🔮    | Varuna (cosmic law)                 | A day of healing and mystery. Meditation and self-inquiry.                                | Rakshasa |
| 24  | Purva Bhadrapada  | 🌩️    | Aja Ekapada                         | A day of intensity. Strong emotions — channel them into creativity or physical activity.  | Manushya |
| 25  | Uttara Bhadrapada | 🌊    | Ahir Budhnya (depths of the ocean)  | A day of depth and wisdom. Calm on the surface, strength within.                          | Manushya |
| 26  | Revati            | 🐟    | Pushan (god of journeys)            | A day of completion and care. A good time for forgiveness and preparing for the new.      | Deva     |

**Extended descriptions (on tap)** — 3–5 sentences each — task for the content team. Structure provided above.

**Storage:** No storage needed. Computed from `today_nakshatra_idx` (already in `today_summary_cache`).

---

### Block 4: Do / Avoid

**AI: NO** — fully deterministic. Same input always returns the same 3 Do and 3 Avoid items.

#### How it works

Each tip has a fixed list of **tags** — conditions under which it is relevant. The algorithm scores every tip against today's active signals and picks the top 3 by match count. Ties broken by fixed position in content set (earlier wins). No randomness at any stage.

#### Tag vocabulary (full list)

```
Vaara tags (7):
  Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday

Paksha tags (2):
  Shukla  ← waxing moon (tithi 1–14)
  Krishna ← waning moon (tithi 16–29)

Special tithi tags (3):
  Purnima      ← Full Moon (tithi 15)
  Amavasya     ← New Moon (tithi 30)
  Chaturdashi  ← 14th tithi (intense, day before Full/New Moon)

Nakshatra quality tags (2):
  Nakshatra_Dev      ← benevolent: Ashwini, Mrigashira, Punarvasu, Pushya,
                        Hasta, Swati, Anuradha, Shravana, Revati
  Nakshatra_Intense  ← demanding: Bharani, Krittika, Ardra, Ashlesha, Magha,
                        Vishakha, Jyeshtha, Mula, Shatabhishak, Dhanishtha

Category energy tags (12 — only High and Low; Moderate has no tag):
  Love_High, Love_Low
  Career_High, Career_Low
  Health_High, Health_Low
  Money_High, Money_Low
  Social_High, Social_Low
  Family_High, Family_Low

Personal special day tags (4):
  NakshatraBirthday
  TithiBirthday
  VaaraBirthday
  StarsAlign
```

#### Build today's active signals

```
Active signals = union of:
  → today's vaara tag
  → paksha tag (Shukla or Krishna)
  → Purnima and/or Amavasya if applicable
  → Chaturdashi if tithi is 14 or 29
  → Nakshatra_Dev or Nakshatra_Intense based on today's moon nakshatra
  → category tags where individual score is High (≥71) or Low (≤40) for each of 6 categories
  → NakshatraBirthday / TithiBirthday / VaaraBirthday / StarsAlign if true
```

Note: category tags use the 6 **individual** scores (love, career, health, money, social, family), not the 3 merged scores from Block 2.

#### Score and select

```
tip_score = number of active signals that appear in the tip's tags
Select top 3 do tips by score (ties: earlier in content set wins)
Select top 3 avoid tips by score (same rule)
```

#### Fallback hierarchy

```
1. Full match  — use all active signals
2. Vaara only  — if <3 results, filter to tips tagged with today's vaara alone
3. Paksha only — if <3 results, filter to Shukla or Krishna only
4. Universal   — fill remaining slots from tips with no category/special signals
```

Every vaara must have at least 3 Do and 3 Avoid tips tagged to it alone (minimum coverage rule).

#### Display tags under each tip (UI)

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
StarsAlign      → "Rare Alignment"
NakshatraBirthday → "Star Day"
```

Show max 2–3 tags per tip. Priority: special event > category energy > vaara/paksha.
Do tips: green pills. Avoid tips: amber pills.

#### Share card

```
Today, {Date}
DO:    tip1 · tip2 · tip3
AVOID: tip1 · tip2 · tip3
#Bisou
```

#### Full content set — DO tips (60 tips)

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

### Block 5: Your Day in Three Parts

**AI: NO** — fully deterministic lookup table. No AI used.

#### Structure

All three parts shown simultaneously (not tabs, not collapsed):

```
┌─────────────────────────────────────────────┐
│  Your Day                                   │
│                                             │
│  ☀️ MORNING  · until {morning_end_time}     │
│  {morning_text}                             │
│                                             │
│  🌤 AFTERNOON  · {afternoon_start}–{end}    │
│  {afternoon_text}                           │
│                                             │
│  🌙 EVENING  · after {evening_start_time}   │
│  {evening_text}                             │
└─────────────────────────────────────────────┘
```

#### Algorithm

```
slot:         0 = morning, 1 = afternoon, 2 = evening
vaara_idx:    0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
energy_band:  0=Low, 1=Moderate, 2=High  (from average_score)

text_key = vaara_idx * 9 + slot * 3 + energy_band
text = YOUR_DAY_TEXTS[text_key]   // 63-entry array, 0-indexed
```

#### Timing labels

```
Morning   → local midnight until noon (or sunrise + 6h, whichever is later)
Afternoon → noon until sunset
Evening   → sunset onward
```

Times from Swiss Ephemeris (sunrise/sunset for user's location). Displayed next to slot label.

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

### Block 6: Power Windows + Rahu Kaal

**AI: NO** — fully deterministic.

#### Requires per-user per-day inputs

```
sunrise_time:    local time of sunrise (Swiss Ephemeris, user's lat/lon)
sunset_time:     local time of sunset  (Swiss Ephemeris, user's lat/lon)
today_vaara:     weekday string (Sunday…Saturday)
current_time:    user's local time (for highlighting current window)
```

#### Windows shown (up to 6 per day)

| #   | Type                   | User-facing title                 | Marker   | Shown when                        |
| --- | ---------------------- | --------------------------------- | -------- | --------------------------------- |
| 1   | High-energy hora       | "Active start" or "Power opening" | 🟢 peak  | morning hora if Jupiter/Sun/Venus |
| 2   | Abhijit Muhurta        | "Abhijit"                         | ✦ gold   | every day                         |
| 3   | Rahu Kaal              | "Rahu Kaal"                       | 🔴 avoid | every day                         |
| 4   | Current hora highlight | "Hora of {planet}"                | 🟡 now   | current 60-min window             |
| 5   | Low hora               | "Rest zone"                       | 🔵 rest  | Moon/Saturn hora if afternoon     |
| 6   | Evening rise           | "Evening rise"                    | 🟢       | evening high hora if applicable   |

The window matching current local time is highlighted with a **"Now"** tag.

#### Rahu Kaal calculation

```
Inputs: sunrise_time, sunset_time, today_vaara

day_duration_minutes  = (sunset_time - sunrise_time) in minutes
segment_duration_min  = day_duration_minutes / 8

Rahu Kaal segment index by vaara (1 = first segment after sunrise):
  Sunday:    8  (last segment of the day)
  Monday:    2
  Tuesday:   7
  Wednesday: 5
  Thursday:  6
  Friday:    4
  Saturday:  3

rahu_start = sunrise_time + (segment_index - 1) × segment_duration_min
rahu_end   = rahu_start + segment_duration_min
```

**Example** (sunrise 06:00, sunset 20:00, Thursday):

```
day_duration   = 840 min
segment        = 105 min (1h 45m)
Thursday index = 6
rahu_start     = 06:00 + 5 × 105 = 14:45
rahu_end       = 14:45 + 105 min = 16:30
→ Display: "⚠️ Rahu Kaal  14:45–16:30"
```

**On tap explanation:**

```
Rahu Kaal — a daily 1.75-hour period associated with Rahu
(the ascending lunar node). Considered inauspicious for starting
new ventures, signing agreements, travelling, and making
important decisions.

Does not apply to activities already in progress.
Calculated from sunrise time.
```

#### Abhijit Muhurta calculation

```
solar_noon    = sunrise_time + (sunset_time - sunrise_time) / 2

abhijit_start = solar_noon - 24 minutes
abhijit_end   = solar_noon + 24 minutes
```

**Example** (sunrise 06:00, sunset 20:00):

```
solar_noon    = 06:00 + 420 min = 13:00
abhijit_start = 12:36
abhijit_end   = 13:24
→ Display: "✦ Abhijit  12:36–13:24"
```

**On tap explanation:**

```
Abhijit Muhurta — the "victorious moment" of the day,
centred around solar noon. Neutralises even unfavourable
astrological positions.

Ideal for important beginnings, signing agreements,
key decisions, and anything meant to have a lasting effect.

Exception: Wednesday — Abhijit is considered weaker on this day.
```

#### Hora calculation (Chaldean order)

```
Chaldean planet order (index 0–6):
  0=Saturn, 1=Jupiter, 2=Mars, 3=Sun, 4=Venus, 5=Mercury, 6=Moon

Day ruler index (planet that rules Hora 1 = first hora of the day, starting at sunrise):
  Sunday:    Sun    (idx 3)
  Monday:    Moon   (idx 6)
  Tuesday:   Mars   (idx 2)
  Wednesday: Mercury (idx 5)
  Thursday:  Jupiter (idx 1)
  Friday:    Venus  (idx 4)
  Saturday:  Saturn (idx 0)

hora_index = floor((current_local_time - sunrise_time) / 60 minutes)
hora_planet_idx = (day_ruler_idx + hora_index) % 7
hora_planet = CHALDEAN_ORDER[hora_planet_idx]

hora_start = sunrise_time + hora_index × 60 min
hora_end   = hora_start + 60 min
```

**Storage:** no storage needed. Computed at render time from `vaara` + `sunrise_time`. Pre-computed into `today_summary_cache`.

---

### Block 7: Cosmic Body Map

**AI: NO**

Fixed 27-entry lookup: today's moon nakshatra → body area + awareness tip.

#### What is displayed

```
{body_icon}  {NAKSHATRA_NAME} DAY
Body focus: {body_area}
"{awareness_tip}"
```

Visual: SVG body outline with governed area highlighted. Tap highlighted zone for full tip.

#### On tap — Vedic details

Tapping the card expands an inline panel with a word-only Vedic explanation (no numbers). Built from:

- Today's Moon nakshatra (`today_nakshatra_idx`)
- Nakshatra devata, guna, and symbol (from Block 3 lookup)
- Body area from the 27-entry Kala Purusha mapping
- Current paksha (Shukla / Krishna)

Example (Pushya · chest, stomach & lungs):

> In the nakshatra–body correspondence (Kala Purusha), Chandra in Pushya activates the chest, stomach & lungs. Pushya is ruled by Brihaspati, carries Tamas guna, and is symbolised by Flower / circle — during Shukla paksha (waxing Moon), somatic sensitivity gathers in this region rather than spreading evenly through the body. Jupiter's own star — excellent for almost any positive activity. Today's practical focus: digestive energy is sensitive — eat lighter and avoid skipping meals.

```
onTap(body_map):
  toggle expanded panel
  explanation = deterministic template (no AI, no cache needed)
```

#### Full 27-entry lookup table

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

**Storage:** none. Computed from `today_nakshatra_idx`. Pre-included in `today_summary_cache`.

---

### Block 8: Daily Oracle

**AI: NO** — fully deterministic.

#### Card assignment

```
nakshatra_index = index of today's moon nakshatra (0–26)
card            = ORACLE_CARDS[nakshatra_index]
```

27 unique cards — one per nakshatra. Same nakshatra always returns the same card.

#### Behaviour

1. Single face-down card shown: "Tap to reveal" / "Your message is waiting".
2. Card flips with CSS 3D Y-axis animation (~550ms) on tap.
3. Revealed: icon + card name + message text + attribution (nakshatra · tithi).
4. **Once per day only** — card cannot be reset until midnight.
5. Below card: "Tap the card to receive today's message" → "✓ Your message for today" after reveal.

#### Storage

```
user_checkins → add columns (if not already):
  oracle_revealed:    BOOLEAN   not null default false
  oracle_revealed_at: TIMESTAMP nullable
```

---

### Block 9: Dasha / Antardasha Snapshot

**AI: NO** — fully deterministic Vimshottari calculation from natal Moon position.

#### Purpose

Shows the user's current planetary cycle in **one plain-language sentence**. Makes Vedic astrology personal without overwhelming beginners. Technical details available on tap only.

#### Display

```
┌─────────────────────────────────────────────┐
│  🪐 Your cycle now                          │
│                                             │
│  You are in the {planet_name} cycle         │
│  {planet_simple_meaning}                    │
│                                             │
│  This cycle runs until {mahadasha_end}      │
│                                             │
│  {birth_time_warning — if applicable}       │
│                                             │
│  [ What does this mean? ]                   │
└─────────────────────────────────────────────┘
```

`mahadasha_end_formatted`: month + year, e.g. "February 2027".

**Birth time warning** (shown if `birth_time_known == false`):

```
⚠️ Birth time unknown — calculation is approximate (margin of up to 6 months)
```

#### On tap

```
{planet_name} Mahadasha

Currently active: {antardasha_planet} Antardasha (until {antardasha_end})

{antardasha_combination_meaning}
```

---

#### Vimshottari Dasha — Full Algorithm

**Constants:**

```javascript
const PLANET_ORDER = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
];

const PLANET_YEARS = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
  // Total: 120 years
};

// Each nakshatra (0–26) is ruled by a planet in repeating sequence
const NAKSHATRA_RULERS = [
  "Ketu", // 0  Ashwini
  "Venus", // 1  Bharani
  "Sun", // 2  Krittika
  "Moon", // 3  Rohini
  "Mars", // 4  Mrigashira
  "Rahu", // 5  Ardra
  "Jupiter", // 6  Punarvasu
  "Saturn", // 7  Pushya
  "Mercury", // 8  Ashlesha
  "Ketu", // 9  Magha
  "Venus", // 10 Purva Phalguni
  "Sun", // 11 Uttara Phalguni
  "Moon", // 12 Hasta
  "Mars", // 13 Chitra
  "Rahu", // 14 Swati
  "Jupiter", // 15 Vishakha
  "Saturn", // 16 Anuradha
  "Mercury", // 17 Jyeshtha
  "Ketu", // 18 Mula
  "Venus", // 19 Purva Ashadha
  "Sun", // 20 Uttara Ashadha
  "Moon", // 21 Shravana
  "Mars", // 22 Dhanishtha
  "Rahu", // 23 Shatabhishak
  "Jupiter", // 24 Purva Bhadrapada
  "Saturn", // 25 Uttara Bhadrapada
  "Mercury", // 26 Revati
];
```

**Step 1 — Find birth planet and elapsed fraction:**

```javascript
function computeDashaStart(natalMoonLongitude) {
  const NAKSHATRA_SPAN = 360 / 27; // 13.3333... degrees

  const nakshatraIdx = Math.floor(natalMoonLongitude / NAKSHATRA_SPAN);
  const positionInNakshatra = natalMoonLongitude % NAKSHATRA_SPAN;
  const fractionCompleted = positionInNakshatra / NAKSHATRA_SPAN;
  const fractionRemaining = 1 - fractionCompleted;

  const birthPlanet = NAKSHATRA_RULERS[nakshatraIdx];
  const firstDashaYearsRemaining =
    PLANET_YEARS[birthPlanet] * fractionRemaining;

  return { birthPlanet, firstDashaYearsRemaining };
}
```

**Step 2 — Build full Mahadasha timeline:**

```javascript
function buildMahadashaTimeline(
  birthDate,
  birthPlanet,
  firstDashaYearsRemaining,
) {
  const timeline = [];
  let cursor = new Date(birthDate);

  // First (partial) dasha
  const firstEnd = addYears(cursor, firstDashaYearsRemaining);
  timeline.push({
    planet: birthPlanet,
    start: new Date(cursor),
    end: firstEnd,
  });
  cursor = firstEnd;

  // Remaining full dashas
  let planetIdx = (PLANET_ORDER.indexOf(birthPlanet) + 1) % 9;
  const maxDate = addYears(new Date(birthDate), 120);

  while (cursor < maxDate) {
    const planet = PLANET_ORDER[planetIdx];
    const end = addYears(cursor, PLANET_YEARS[planet]);
    timeline.push({ planet, start: new Date(cursor), end });
    cursor = end;
    planetIdx = (planetIdx + 1) % 9;
  }

  return timeline;
}
```

**Step 3 — Find current Mahadasha:**

```javascript
function getCurrentMahadasha(timeline, today) {
  return timeline.find(d => d.start <= today && today < d.end);
}
```

**Step 4 — Build Antardasha timeline within current Mahadasha:**

```javascript
function buildAntardashaTimeline(mahadasha) {
  const antardasha = [];
  let cursor = new Date(mahadasha.start);
  const mahaYears = PLANET_YEARS[mahadasha.planet];

  // Antardasha sequence starts with the Mahadasha planet itself
  let planetIdx = PLANET_ORDER.indexOf(mahadasha.planet);

  for (let i = 0; i < 9; i++) {
    const planet = PLANET_ORDER[(planetIdx + i) % 9];
    const durationYears = (mahaYears * PLANET_YEARS[planet]) / 120;
    const end = addYears(cursor, durationYears);
    antardasha.push({ planet, start: new Date(cursor), end });
    cursor = end;
  }

  return antardasha;
}
```

**Step 5 — Find current Antardasha:**

```javascript
function getCurrentAntardasha(antardashaTimeline, today) {
  return antardashaTimeline.find(a => a.start <= today && today < a.end);
}
```

**`addYears` helper** must handle fractional years accurately:

```javascript
function addYears(date, years) {
  const totalDays = years * 365.25; // Vimshottari uses 365.25 days/year
  return new Date(date.getTime() + totalDays * 24 * 60 * 60 * 1000);
}
```

---

#### Planet meanings (displayed on main view — simple language)

| Planet  | Mahadasha meaning (2 sentences, main view)                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------------- |
| Ketu    | A time of letting go and spiritual seeking. Material ambitions fade into the background — something deeper emerges. |
| Venus   | A time of relationships, beauty, and joy. Attention shifts to what brings pleasure and harmony.                     |
| Sun     | A time of self-expression and leadership. Your identity and reputation are in focus.                                |
| Moon    | A time of emotions, intuition, and family. The inner world matters more than the outer.                             |
| Mars    | A time of action and striving. Energy for achievement, but also a tendency toward conflict.                         |
| Rahu    | A time of transformation and ambition. A strong desire for change and new experience.                               |
| Jupiter | A time of wisdom and expansion. Growth, learning, and spiritual practice bear fruit.                                |
| Saturn  | A time of structure and lessons. Persistent work and patience yield lasting results.                                |
| Mercury | A time of communication and learning. Intellect, business, and connections are in focus.                            |

#### Antardasha combination meanings (9×9 = 81 entries)

Format: `ANTARDASHA_MEANINGS[mahadasha_planet][antardasha_planet] = "2–3 sentences"`

Sample entries (content team fills all 81):

```javascript
const ANTARDASHA_MEANINGS = {
  Venus: {
    Moon: "Deep emotional connections and care for the home space. Attention to domestic beauty and nurturing energy.",
    Jupiter:
      "Love, inspiration, and spiritual growth together. A favourable time for marriage and major personal decisions.",
    Saturn:
      "Relationships require responsibility and effort. Beauty is born through discipline.",
    Mercury:
      "A time for creative projects and communication in relationships. Art and business go hand in hand.",
    // ... etc.
  },
  Jupiter: {
    Saturn:
      "Growth through discipline. Jupiter expands, Saturn structures — time to build something lasting.",
    Mars: "Ambition and spirituality in tension. Act decisively, but do not forget wisdom.",
    // ... etc.
  },
  Saturn: {
    Mars: "A tense sub-period. Saturn slows, Mars rushes — patience is key.",
    // ... etc.
  },
  // ... all 81 combinations
};
```

#### Storage

```sql
-- Add to astro_data (if not already present):
ALTER TABLE astro_data ADD COLUMN natal_moon_longitude DECIMAL(10,6);
ALTER TABLE astro_data ADD COLUMN birth_time_known BOOLEAN NOT NULL DEFAULT FALSE;

-- Cache in today_summary_cache (update weekly — changes rarely):
-- current_mahadasha_planet   VARCHAR
-- current_mahadasha_end      DATE
-- current_antardasha_planet  VARCHAR
-- current_antardasha_end     DATE
```

---

### Block 10: Stories Carousel

**AI: NO** — stories scheduled via admin panel, personalized by nakshatra / moon_sign lookup.

---

### Block 11: Compatibility Pulse

**AI: NO** — fully deterministic.

#### State A — Connect onboarding not completed

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

#### State B — Connect onboarding completed

Shows 1–3 match cards. Each card:

- Avatar emoji + Name + Birth nakshatra
- Compatibility score (0–100) with colour-coded label
- **Strong match** (≥80) · **Good match** (≥60) · **Different energies** (≥40) · **Rough day** (<40)
- Tap to expand → one-sentence insight

#### Compatibility score algorithm

```
For users A and B on date D:

score_A      = average of A's 6 individual category scores for date D
score_B      = average of B's 6 individual category scores for date D
delta        = |score_A – score_B|
compat_score = clamp(100 – round(delta × 0.8), 15, 99)
```

#### Insight templates (keyed by (A_band, B_band))

```
('high', 'high')         → "Both at peak energy today — rare and powerful."
('high', 'moderate')     → "{A_name}'s energy dominates today — a good listening day for {B_name}."
('high', 'low')          → "Strong pull from {A_name}, quiet from {B_name} — give space."
('moderate', 'high')     → "Their energy is higher today — let them lead the conversation."
('moderate', 'moderate') → "Even energy — steady, comfortable day for connection."
('moderate', 'low')      → "Different rhythms today — keep interactions light."
('low', 'high')          → "You're the quiet one today. Let {B_name} carry the energy."
('low', 'moderate')      → "Different rhythms today — keep interactions light."
('low', 'low')           → "Both in quiet energy — depth over activity."
```

**Storage:** no new storage. Compat score computed at read time, cached in `today_summary_cache`.

---

### Block 12: Achievements

**AI: NO** — last block on the page.

Shows 3 most recently earned badges as a horizontal row + **"View all →"** button.

#### View All Modal

Full-screen overlay. 5 category tabs.

```
┌──────────────────────────────────────┐
│  All Achievements          [✕ Close] │
│  ──────────────────────────────────  │
│  [Cosmic Events] [Streak] [Loyalty]  │
│  [Social] [Events]                   │
│  ──────────────────────────────────  │
│  🌕  Full Moon Witness               │
│      Check in on Purnima     ✓ ×3    │
│  ──────────────────────────────────  │
│  🌑  New Moon Keeper                 │
│      Check in on Amavasya   🔒       │
│  ...                                 │
└──────────────────────────────────────┘
```

States: **Earned repeatable** (✓ + ×count) · **Earned one-time** (✓) · **Locked** (🔒, 40% opacity)

---

### Block 13: Explore Yourself

**AI: NO** — static entry points only. No data computed on the Today page.

#### Purpose

A permanent last block on the Today page that promotes the **Reports section**. Every card acts as a teaser with a title and one-sentence description. Tapping any card navigates to the corresponding report in the Reports section of the app.

This block does **not** require birth chart computation — it is the same for every user.

#### Layout

```
┌─────────────────────────────────────────┐
│  EXPLORE YOURSELF                       │
│  Go deeper — reports built from your   │
│  birth chart                            │
│                                         │
│  💞  Synastry Report              ›     │
│      How two birth charts fit           │
│      together across love, trust,       │
│      and growth                         │
│                                         │
│  📅  Best Day to Meet             ›     │
│      Find the best days this week       │
│      to connect with someone            │
│                                         │
│  🌊  Relationship Forecast        ›     │
│      What the next month looks like     │
│      for you and a partner              │
│                                         │
│  🪐  Group Compatibility          ›     │
│      Map the energy between             │
│      everyone in your circle            │
│                                         │
│  🌀  Past Relationship Reading    ›     │
│      Understand a past connection       │
│      through the lens of your charts   │
└─────────────────────────────────────────┘
```

#### Reports catalogue (linked destinations)

| Card | Destination | Inputs required |
| ---- | ----------- | --------------- |
| Synastry Report | Reports › Synastry | Birth date of one other person (time + place optional) |
| Best Day to Meet | Reports › Best Day | Birth date of one other person |
| Relationship Forecast | Reports › Forecast | Birth date of one other person |
| Group Compatibility | Reports › Group | Birth dates of 2–5 people |
| Past Relationship Reading | Reports › Past | Birth date of one other person |

#### Storage

None. No server calls on the Today page for this block.

---

### Moon Streak (header feature — not a page block)

**AI: NO**

Moon Streak is **not** a numbered Today page block. It lives in the **header** only: a `🔥 Day {N}` pill (Block 0) that opens a streak modal on tap.

#### Where it appears

1. **Header pill** (always visible): `🔥 Day {N}` — tap opens streak modal.
2. **Streak modal**: shows progress toward next milestone.

#### Streak calculation

```javascript
// On check-in:
const yesterday = await getCheckinDate(userId, today - 1 day);

if (yesterday !== null) {
  newStreak = yesterday.streak + 1;
} else {
  newStreak = 1; // streak resets; today is day 1
}

await upsertCheckin(userId, today, { streak: newStreak });
```

Missing a single day resets the streak to 1 on next visit. No exceptions.

#### Streak modal content

```
You're on
🔥  Day {N}
of {milestone} · {milestone_label}

[Day track: ● ● ● … ● ○ ○ … ○ {milestone}]
Day 1 → Day {N} → Day {milestone}

[████████░░░░░░░░░░]  {N}/{milestone} to next milestone

{N_remaining} more days to unlock {next_milestone_label}

Miss a day and your streak resets.
```

Milestone days (3, 7, 14, 29, 90, 180, 365) highlighted in purple on the day track.

#### Milestones

| Streak | Goal line                                          |
| ------ | -------------------------------------------------- |
| < 7    | "{7 − N} more days to unlock First Week 🔥🔥"      |
| 7–13   | "{14 − N} more days to unlock Moonwalker 🌙"       |
| 14–28  | "{29 − N} more days to unlock Full Lunar Cycle 🌕" |
| 29–89  | "{90 − N} more days to unlock Three Moons ✨"      |
| ≥ 90   | "✨ Legendary — {N}-day streak"                    |

#### Storage

```sql
-- user_checkins required columns:
--   user_id     UUID
--   date        DATE
--   streak      INTEGER
--   check_in_at TIMESTAMP
```

---

## 5. Achievement System — Full Spec

Achievements are evaluated automatically on every check-in. All checks run server-side in `POST /checkin`.

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
| `solar_event`       | ☀️   | Solstice Keeper   | Checked in on solstice or equinox   | 4×/year            |

### Category 2: Streak Milestones (one-time per threshold)

| Badge ID     | Icon | Name          | Trigger        |
| ------------ | ---- | ------------- | -------------- |
| `streak_3`   | 🔥   | First Spark   | 3-day streak   |
| `streak_7`   | 🔥🔥 | First Week    | 7-day streak   |
| `streak_14`  | 🌙   | Moonwalker    | 14-day streak  |
| `streak_29`  | 🌕   | Full Cycle    | 29-day streak  |
| `streak_90`  | ✨   | Three Moons   | 90-day streak  |
| `streak_180` | 🌠   | Half Year     | 180-day streak |
| `streak_365` | 🏆   | Year of Stars | 365-day streak |

### Category 3: Loyalty Milestones (one-time)

Triggered by `account_age_days` (days since registration).

| Badge ID       | Icon | Name          | Trigger  |
| -------------- | ---- | ------------- | -------- |
| `loyalty_3d`   | 🌱   | First Steps   | 3 days   |
| `loyalty_7d`   | 🌿   | First Week    | 7 days   |
| `loyalty_30d`  | 🌳   | One Month     | 30 days  |
| `loyalty_90d`  | 🌲   | Three Months  | 90 days  |
| `loyalty_180d` | 🏔️   | Half Year     | 180 days |
| `loyalty_365d` | 🌌   | One Full Year | 365 days |

### Category 4: Social & Matching

| Badge ID               | Icon | Name             | Trigger                     | Type       |
| ---------------------- | ---- | ---------------- | --------------------------- | ---------- |
| `first_match`          | 💫   | First Connection | First mutual match          | One-time   |
| `five_matches`         | 💫💫 | Rising Star      | 5 matches total             | One-time   |
| `twenty_matches`       | 🌟   | Star Connector   | 20 matches total            | One-time   |
| `compatibility_reader` | 🔭   | Cosmic Reader    | Viewed compatibility report | One-time   |
| `invited_friend`       | 🤝   | Cosmic Invite    | Referred friend who joined  | Repeatable |
| `shared_today`         | 📲   | Sky Sharer       | Shared Today card to social | Repeatable |

### Category 5: Events

| Badge ID        | Icon | Name          | Trigger                   |
| --------------- | ---- | ------------- | ------------------------- |
| `event_checkin` | 🎪   | Star Gatherer | Checked in at Bisou event |
| `event_matched` | 🎯   | Event Match   | Got a match at an event   |
| `event_series`  | 🏅   | Event Regular | Attended 3+ events        |

### Badge stacking (repeatable badges)

```
Full Moon Witness ×1  → 🌕 standard
Full Moon Witness ×3  → 🌕 silver glow
Full Moon Witness ×6  → 🌕 gold glow
Full Moon Witness ×12 → 🌕 with crown (full year)
```

Tiers: Standard → Silver → Gold → Crown (at 1×, 3×, 6×, 12+×).

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
      dedupe_key: `full_moon_${today_date}`,
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
    { id: "streak_3", check: () => streak === 3, repeatable: false },
    { id: "streak_7", check: () => streak === 7, repeatable: false },
    { id: "streak_14", check: () => streak === 14, repeatable: false },
    {
      id: "streak_29",
      check: () => streak === 29,
      repeatable: true,
      dedupe_key: `full_cycle_${lunar_cycle_id}`,
    },
    { id: "streak_90", check: () => streak === 90, repeatable: false },
    { id: "streak_180", check: () => streak === 180, repeatable: false },
    { id: "streak_365", check: () => streak === 365, repeatable: false },
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
      id: "loyalty_90d",
      check: () => account_age_days === 90,
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

See [Section 3 — Dynamic Background](#3-dynamic-background) for the full spec, all 20 asset keys, the time-of-day tint system, and the selection algorithm.

The background key is stored in `today_summary_cache.background_key` and resolved once per day at midnight.

---

## 7. Caching & Performance

### Pre-generation job

All deterministic content is pre-computed at **00:00 local time** for active users via `today-page-pregen` job.

### Cache table: `today_summary_cache` (per user per date)

| Field                       | Source                | TTL                     |
| --------------------------- | --------------------- | ----------------------- |
| `background_key`            | deterministic         | until midnight          |
| `synthesis_type`            | deterministic         | until midnight          |
| `synthesis_text`            | deterministic         | until midnight          |
| `moon_transit_line`         | ephemeris             | until midnight          |
| `category_scores_6`         | deterministic         | until midnight          |
| `energy_scores_3`           | derived from 6        | until midnight          |
| `energy_labels_3`           | derived               | until midnight          |
| `do_tips[3]`                | deterministic         | until midnight          |
| `avoid_tips[3]`             | deterministic         | until midnight          |
| `nakshatra_of_day_idx`      | ephemeris             | until midnight          |
| `your_day_texts[3]`         | template lookup       | until midnight          |
| `power_windows`             | hora + rahu + abhijit | until midnight          |
| `rahu_kaal_start`           | formula from sunrise  | until midnight          |
| `rahu_kaal_end`             | formula from sunrise  | until midnight          |
| `abhijit_start`             | formula from sunrise  | until midnight          |
| `abhijit_end`               | formula from sunrise  | until midnight          |
| `energy_ai_explanations[3]` | AI — on first tap     | until midnight          |
| `dasha_current`             | Vimshottari           | 7 days (rarely changes) |
| `social_proof_counts`       | real user count       | refreshed every 30 min  |

### AI calls per user per day

| Call                                 | Count | Model       | When                              |
| ------------------------------------ | ----- | ----------- | --------------------------------- |
| Energy category explanation (on tap) | 0–3   | gpt-4o-mini | First tap on each of 3 categories |
| **Max total**                        | **3** |             |                                   |

Max **3** AI calls per user per day — all cached until midnight.

### Response time targets

- Today page initial load: **< 200ms** (all from cache)
- Energy tap AI explanation (first time): **< 2s**
- Energy tap AI explanation (cached): **< 50ms**
- Moon transit calculation: **< 100ms** (binary search on ephemeris, pre-cached)

---

## 8. AI Usage Summary

| Block                | AI             | When                           | Cache          |
| -------------------- | -------------- | ------------------------------ | -------------- |
| Block 2 (Energy tap) | ✅ gpt-4o-mini | First tap per category per day | Until midnight |
| All other blocks     | ❌             | —                              | —              |

**Maximum 3 AI calls per user per day.**

---

## 9. Determinism Guarantee

Every block marked **AI: NO** is fully deterministic:

> **Given the same `birth_data`, `today_date`, and user location, the output is always identical.**

This is ensured by:

- No `Math.random()` anywhere in scoring, selection, or lookup
- Do/Avoid tie-breaking by fixed position in content set (stable sort, earlier entry wins)
- Block 5 texts selected by direct three-key lookup: `TEMPLATES[vaara_idx][slot][energy_band]`
- All panchang calculations via Swiss Ephemeris with Lahiri ayanamsa
- Dasha calculation uses `addYears` with 365.25 days/year (Vimshottari standard)
- Social proof is real data (not deterministic), cached with 30-min TTL — the only non-deterministic non-AI value on the page

---

## 10. Home Screen Widgets

Bisou offers native home-screen widgets (iOS WidgetKit / Android App Widgets) that give users a glanceable daily snapshot and a one-tap entry into the Today page.

### Design principles

1. **No interaction required** — the widget refreshes automatically; the user just looks.
2. **Always personalised** — every widget is computed from the user's birth chart and today's panchang.
3. **One tap → Today page** — tapping any widget deep-links directly to the Today page.
4. **Dark, premium aesthetic** — matches the Bisou visual language (dark background, gold/purple accents).

---

### Widget catalogue

#### Small widgets (2×2)

**Small 1 — Day Energy**

Shows the user's dominant energy today (High / Moderate / Low) with a single icon and the day's score label.

```
┌───────────────────┐
│  ☀️  Thursday     │
│                   │
│  Energy           │
│  ● High           │
│  bisou            │
└───────────────────┘
```

**Small 2 — Nakshatra of the Day**

Today's moon nakshatra with its symbol and a 3-word descriptor.

```
┌───────────────────┐
│  🌸 Pushya        │
│                   │
│  Nurturing        │
│  & warmth         │
│  bisou            │
└───────────────────┘
```

**Small 3 — Streak Pill**

Current check-in streak with a fire icon. Motivational. Highest retention driver.

```
┌───────────────────┐
│  🔥               │
│                   │
│  Day 14           │
│  Keep going →     │
│  bisou            │
└───────────────────┘
```

---

#### Medium widgets (4×2)

**Medium 1 — Daily Summary**

Left column: date, greeting. Right column: energy level + nakshatra name + one-line synthesis sentence (truncated).

```
┌─────────────────────────────────────┐
│  Thu, Jun 11   Good morning, Sofia  │
│                                     │
│  ● High energy  ·  Pushya           │
│  Jupiter's day — reach out and      │
│  grow.                              │
│                                 bisou│
└─────────────────────────────────────┘
```

**Medium 2 — Power Window Now**

Shows the current hora / power window (or Rahu Kaal warning if active), with the time range and a short action line.

```
┌─────────────────────────────────────┐
│  ⚡  NOW · 09:00–10:30              │
│  Jupiter hora                       │
│  Strong window for decisions        │
│  and important conversations.       │
│                                 bisou│
└─────────────────────────────────────┘
```

---

#### Large widget (4×4)

**Large — Full Today Snapshot**

Stacks the key information: date + greeting, energy row (3 categories), nakshatra, and today's first Do / Avoid tip. Acts as a mini Today page on the home screen.

```
┌─────────────────────────────────────┐
│  Thursday, June 11                  │
│  Good morning, Sofia                │
│                                     │
│  💪 Health  ●●●●○  High             │
│  ❤️  Relations ●●●○○ Moderate       │
│  💼 Career  ●●●●○  High             │
│                                     │
│  🌸 Pushya · Nurturing & warmth     │
│                                     │
│  ✅ Do: Start important             │
│  conversations early today.         │
│                                 bisou│
└─────────────────────────────────────┘
```

---

### Technical notes

| Attribute | Detail |
| --------- | ------ |
| Refresh cadence | Once per day at midnight (local time) + on-demand when app is opened |
| Data source | Cached `today_summary_cache` row — no extra API calls from widget |
| Deep-link target | `bisou://today` → opens Today page directly |
| Platforms | iOS 16+ (WidgetKit, SwiftUI), Android 12+ (Glance API) |
| Auth | Widget reads from local cache written by the app; no separate auth |
| Personalisation | All widgets are per-user; no widget shown until first Today page load |
