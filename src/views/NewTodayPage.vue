<script setup>
import { ref, computed } from "vue";
import PhoneFrame from "../components/PhoneFrame.vue";

// ── Background gradients ─────────────────────────────────────────────────────
// Each entry stacks: [planetary bloom] + [depth bloom] + [dark base]
// All share the same visual language: near-black base + 1-2 soft radial blooms

const BG = {
  // Special events — vivid & distinct
  celestial_event: [
    "radial-gradient(ellipse 90% 55% at 25% 15%, rgba(140,55,255,0.50) 0%, transparent 65%)",
    "radial-gradient(ellipse 70% 45% at 80% 85%, rgba(0,180,200,0.25) 0%, transparent 60%)",
    "linear-gradient(175deg, #08011a 0%, #04091e 55%, #060d18 100%)",
  ].join(", "),

  eclipse: [
    "radial-gradient(ellipse 75% 50% at 50% 20%, rgba(180,20,0,0.55) 0%, transparent 65%)",
    "radial-gradient(ellipse 50% 35% at 50% 90%, rgba(80,10,0,0.4) 0%, transparent 60%)",
    "linear-gradient(180deg, #080000 0%, #050000 55%, #020000 100%)",
  ].join(", "),

  full_moon: [
    "radial-gradient(ellipse 70% 45% at 50% 10%, rgba(180,200,255,0.30) 0%, transparent 65%)",
    "radial-gradient(ellipse 60% 40% at 50% 80%, rgba(40,80,180,0.22) 0%, transparent 60%)",
    "linear-gradient(180deg, #03091e 0%, #06102e 50%, #0a183e 100%)",
  ].join(", "),

  new_moon: [
    "radial-gradient(ellipse 55% 40% at 50% 15%, rgba(60,40,120,0.20) 0%, transparent 65%)",
    "radial-gradient(ellipse 40% 30% at 50% 85%, rgba(20,10,60,0.15) 0%, transparent 60%)",
    "linear-gradient(180deg, #010103 0%, #020307 50%, #030408 100%)",
  ].join(", "),

  star_day: [
    "radial-gradient(ellipse 80% 50% at 40% 20%, rgba(120,40,255,0.50) 0%, transparent 65%)",
    "radial-gradient(ellipse 55% 35% at 70% 75%, rgba(60,0,180,0.30) 0%, transparent 55%)",
    "linear-gradient(165deg, #0a0120 0%, #060018 55%, #04000e 100%)",
  ].join(", "),

  lunar_birthday: [
    "radial-gradient(ellipse 70% 45% at 50% 15%, rgba(130,160,255,0.28) 0%, transparent 60%)",
    "radial-gradient(ellipse 55% 35% at 55% 80%, rgba(100,40,180,0.25) 0%, transparent 55%)",
    "linear-gradient(180deg, #030a1e 0%, #07102c 50%, #0c1638 100%)",
  ].join(", "),

  // Planetary rulers
  your_day: [
    "radial-gradient(ellipse 75% 50% at 50% 10%, rgba(220,100,20,0.45) 0%, transparent 65%)",
    "radial-gradient(ellipse 55% 35% at 50% 90%, rgba(140,50,0,0.30) 0%, transparent 55%)",
    "linear-gradient(180deg, #120400 0%, #0e0300 55%, #080200 100%)",
  ].join(", "),

  solar_gate: [
    "radial-gradient(ellipse 80% 50% at 50% 12%, rgba(220,160,0,0.50) 0%, transparent 65%)",
    "radial-gradient(ellipse 55% 35% at 50% 85%, rgba(160,80,0,0.30) 0%, transparent 55%)",
    "linear-gradient(180deg, #130a00 0%, #0e0600 55%, #080400 100%)",
  ].join(", "),

  venus_evening: [
    "radial-gradient(ellipse 75% 50% at 45% 15%, rgba(200,50,130,0.45) 0%, transparent 65%)",
    "radial-gradient(ellipse 55% 35% at 60% 80%, rgba(140,20,80,0.30) 0%, transparent 55%)",
    "linear-gradient(175deg, #100208 0%, #0a0206 55%, #060104 100%)",
  ].join(", "),

  moon_embrace: [
    "radial-gradient(ellipse 70% 45% at 50% 12%, rgba(120,150,220,0.30) 0%, transparent 60%)",
    "radial-gradient(ellipse 50% 35% at 50% 85%, rgba(40,80,160,0.20) 0%, transparent 55%)",
    "linear-gradient(180deg, #020810 0%, #04101e 55%, #061428 100%)",
  ].join(", "),

  jupiter_abundance: [
    "radial-gradient(ellipse 75% 50% at 45% 15%, rgba(40,80,200,0.45) 0%, transparent 65%)",
    "radial-gradient(ellipse 55% 35% at 65% 80%, rgba(20,40,140,0.30) 0%, transparent 55%)",
    "linear-gradient(175deg, #030812 0%, #050c1e 55%, #06102a 100%)",
  ].join(", "),

  mercury_mind: [
    "radial-gradient(ellipse 70% 45% at 40% 18%, rgba(0,180,160,0.40) 0%, transparent 60%)",
    "radial-gradient(ellipse 50% 35% at 70% 80%, rgba(0,100,80,0.25) 0%, transparent 55%)",
    "linear-gradient(165deg, #000e0c 0%, #001210 55%, #001410 100%)",
  ].join(", "),

  mars_fire: [
    "radial-gradient(ellipse 75% 50% at 50% 15%, rgba(200,30,0,0.50) 0%, transparent 65%)",
    "radial-gradient(ellipse 55% 35% at 50% 85%, rgba(120,10,0,0.30) 0%, transparent 55%)",
    "linear-gradient(180deg, #0e0000 0%, #090000 55%, #060000 100%)",
  ].join(", "),

  sun_radiance: [
    "radial-gradient(ellipse 75% 50% at 50% 12%, rgba(220,150,0,0.50) 0%, transparent 65%)",
    "radial-gradient(ellipse 55% 35% at 50% 85%, rgba(160,80,0,0.28) 0%, transparent 55%)",
    "linear-gradient(180deg, #120800 0%, #0c0500 55%, #080300 100%)",
  ].join(", "),

  saturn_clarity: [
    "radial-gradient(ellipse 65% 40% at 50% 12%, rgba(80,100,160,0.28) 0%, transparent 60%)",
    "radial-gradient(ellipse 45% 30% at 50% 85%, rgba(40,60,110,0.18) 0%, transparent 55%)",
    "linear-gradient(180deg, #020408 0%, #030610 55%, #040818 100%)",
  ].join(", "),

  // Energy tiers
  golden_hour: [
    "radial-gradient(ellipse 70% 45% at 50% 15%, rgba(200,130,0,0.45) 0%, transparent 60%)",
    "radial-gradient(ellipse 50% 35% at 50% 85%, rgba(140,60,0,0.25) 0%, transparent 55%)",
    "linear-gradient(180deg, #0e0600 0%, #090400 55%, #060200 100%)",
  ].join(", "),

  clear_sky: [
    "radial-gradient(ellipse 65% 42% at 50% 12%, rgba(40,100,200,0.35) 0%, transparent 60%)",
    "radial-gradient(ellipse 50% 30% at 50% 85%, rgba(20,60,140,0.22) 0%, transparent 55%)",
    "linear-gradient(180deg, #030810 0%, #050d1e 55%, #07122a 100%)",
  ].join(", "),

  overcast: [
    "radial-gradient(ellipse 60% 40% at 50% 12%, rgba(60,70,110,0.28) 0%, transparent 60%)",
    "radial-gradient(ellipse 45% 28% at 50% 85%, rgba(30,40,80,0.18) 0%, transparent 55%)",
    "linear-gradient(180deg, #060810 0%, #090b16 55%, #0c0e1e 100%)",
  ].join(", "),

  cloudy: [
    "radial-gradient(ellipse 55% 35% at 50% 12%, rgba(55,55,90,0.22) 0%, transparent 60%)",
    "radial-gradient(ellipse 40% 25% at 50% 85%, rgba(30,30,60,0.15) 0%, transparent 55%)",
    "linear-gradient(180deg, #06060c 0%, #080810 55%, #0a0a16 100%)",
  ].join(", "),

  deep_night: [
    "radial-gradient(ellipse 50% 30% at 50% 12%, rgba(30,20,80,0.18) 0%, transparent 60%)",
    "radial-gradient(ellipse 35% 20% at 50% 85%, rgba(10,10,40,0.12) 0%, transparent 55%)",
    "linear-gradient(180deg, #010103 0%, #020205 55%, #030308 100%)",
  ].join(", "),
};

// Time-of-day aurora — a radial horizon glow that sits above the base bg
const TIME_TINT = {
  morning:
    "radial-gradient(ellipse 100% 45% at 50% 100%, rgba(210,140,40,0.22) 0%, rgba(180,100,20,0.10) 45%, transparent 70%)",
  afternoon:
    "radial-gradient(ellipse 80% 30% at 50% 100%, rgba(30,80,180,0.10) 0%, transparent 60%)",
  evening:
    "radial-gradient(ellipse 100% 50% at 50% 100%, rgba(100,20,200,0.28) 0%, rgba(60,0,140,0.12) 45%, transparent 70%)",
};

// ── Moon / energy helpers ────────────────────────────────────────────────────

function getMoonIcon(tithi) {
  if (tithi === 30) return "🌑";
  if (tithi <= 7) return "🌒";
  if (tithi === 8) return "🌓";
  if (tithi <= 14) return "🌔";
  if (tithi === 15) return "🌕";
  if (tithi <= 22) return "🌖";
  if (tithi === 23) return "🌗";
  return "🌘";
}

function moonPhaseLabel(tithi) {
  if (tithi === 30) return "New Moon";
  if (tithi <= 7) return "Waxing Crescent";
  if (tithi === 8) return "First Quarter";
  if (tithi <= 14) return "Waxing Gibbous";
  if (tithi === 15) return "Full Moon";
  if (tithi <= 22) return "Waning Gibbous";
  if (tithi === 23) return "Last Quarter";
  return "Waning Crescent";
}

function energyLabel(score) {
  if (score >= 71) return "High Energy";
  if (score >= 41) return "Moderate";
  return "Low Energy";
}

function energyColor(score) {
  if (score >= 71) return "#4ade80";
  if (score >= 41) return "#fbbf24";
  return "#f87171";
}

// ── Background / headline resolvers ─────────────────────────────────────────

function resolveBackground(sc) {
  const scores = sc.scores;
  const avg = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6);
  if (sc.starsAlign) return "celestial_event";
  if (sc.isEclipse) return "eclipse";
  if (sc.isPurnima) return "full_moon";
  if (sc.isAmavasya) return "new_moon";
  if (sc.isNakshatraBirthday) return "star_day";
  if (sc.isTithiBirthday) return "lunar_birthday";
  if (sc.isVaaraBirthday) return "your_day";
  if (sc.vaara === "Friday" && scores.love >= 71) return "venus_evening";
  if (sc.vaara === "Monday" && scores.family >= 71) return "moon_embrace";
  if (sc.vaara === "Thursday" && scores.money >= 71) return "jupiter_abundance";
  if (sc.vaara === "Wednesday" && (scores.social >= 71 || scores.career >= 71))
    return "mercury_mind";
  if (sc.vaara === "Tuesday" && (scores.health >= 71 || scores.career >= 71))
    return "mars_fire";
  if (sc.vaara === "Sunday" && scores.health >= 71) return "sun_radiance";
  if (sc.vaara === "Saturday" && scores.career >= 71) return "saturn_clarity";
  if (avg >= 80) return "golden_hour";
  if (avg >= 65) return "clear_sky";
  if (avg >= 50) return "overcast";
  if (avg >= 35) return "cloudy";
  return "deep_night";
}

function resolveHeadline(sc) {
  const avg = Math.round(
    Object.values(sc.scores).reduce((a, b) => a + b, 0) / 6,
  );
  if (sc.starsAlign)
    return {
      icon: "🌟",
      type: "Your Special Day",
      sub: "A rare alignment — happens only a few times a year",
    };
  if (sc.isPurnima)
    return {
      icon: "🌕",
      type: "Full Moon Day",
      sub: "Peak energy. Emotions run high",
    };
  if (sc.isAmavasya)
    return {
      icon: "🌑",
      type: "New Moon Day",
      sub: "Time to set new intentions",
    };
  if (sc.isNakshatraBirthday)
    return {
      icon: "⭐",
      type: "Your Star Day",
      sub: "Today's sky matches your birth sky",
    };
  if (sc.isTithiBirthday)
    return {
      icon: "🎂",
      type: "Lunar Birthday",
      sub: "The moon returns to your birth phase",
    };
  if (sc.isEclipse)
    return {
      icon: "🌒",
      type: "Eclipse Day",
      sub: "Rare disruption. Observe, don't act.",
    };
  if (avg >= 75)
    return {
      icon: "⚡",
      type: "High Energy Day",
      sub: "The stars are working for you today",
    };
  if (avg >= 50)
    return {
      icon: "🌊",
      type: "Flow With It",
      sub: "A steady day — go with the current",
    };
  return {
    icon: "🌙",
    type: "Rest & Reflect",
    sub: "A quiet day. Good for inner work",
  };
}

// ── Category metadata ────────────────────────────────────────────────────────

const CATS = [
  { key: "love", label: "Love", icon: "💛", planet: "Venus", house: "7th" },
  {
    key: "career",
    label: "Career",
    icon: "⚡",
    planet: "Saturn",
    house: "10th",
  },
  { key: "health", label: "Health", icon: "🌿", planet: "Sun", house: "1st" },
  { key: "money", label: "Money", icon: "💰", planet: "Jupiter", house: "2nd" },
  {
    key: "social",
    label: "Social",
    icon: "🤝",
    planet: "Mercury",
    house: "11th",
  },
  { key: "family", label: "Family", icon: "🏠", planet: "Moon", house: "4th" },
];

const CAT_TEXT = {
  love: {
    high: "Venus energy flows freely today. The planetary alignment favors romantic gestures and honest emotional expression. A small act of love will land with unexpected depth.",
    moderate:
      "Love energy is steady — good for nurturing what already exists rather than starting something new. Appreciate what's in front of you.",
    low: "Venus is subdued today. Avoid forcing connection — give space and let things settle naturally.",
  },
  career: {
    high: "Saturn and Mercury are working for your career ambitions. Clarity of thought and disciplined effort are rewarded. A good day to make a move you've been delaying.",
    moderate:
      "Career energy is functional today — steady work beats inspired leaps. Finish what's already in motion.",
    low: "Mercury and Saturn are in tension. Avoid big professional decisions and keep communications extra clear to prevent misunderstandings.",
  },
  health: {
    high: "The Sun's vitality aligns with your natal chart. Physical energy is strong — a great day to exercise, eat well, and start a new health habit.",
    moderate:
      "Health energy is balanced. Maintain routine and avoid overexertion. Your body is doing steady work beneath the surface.",
    low: "Your system is more sensitive today. Rest, hydration, and gentle movement are more valuable than pushing through.",
  },
  money: {
    high: "Jupiter's expansive energy touches your 2nd house today. Practical financial decisions carry long-term weight — a good day to research, plan, or make a calculated move.",
    moderate:
      "Money energy is neutral — maintenance over expansion. Check your balances, pay a bill, keep things tidy.",
    low: "Avoid financial risk today. Saturn's influence creates a contraction phase — hold your resources and wait for clearer skies.",
  },
  social: {
    high: "Mercury activates your social energy. Words flow well, introductions land, and connections form easily. Reach out to someone you've been thinking about.",
    moderate:
      "Social energy is comfortable but not electric. Good for catching up with familiar faces rather than meeting new people.",
    low: "Social battery is depleted today. Give yourself permission to be quiet — you'll be more yourself once you've rested.",
  },
  family: {
    high: "The Moon's influence on your 4th house strengthens family bonds today. A small gesture — a call, a meal, a memory shared — will mean more than you expect.",
    moderate:
      "Family energy is stable. No dramatic shifts — quiet connection and presence.",
    low: "Family dynamics may feel heavier today. Choose patience over reaction and let tensions settle without forcing resolution.",
  },
};

// ── Your Day lookup ──────────────────────────────────────────────────────────

const YOUR_DAY = {
  Sunday: {
    Morning: {
      high: "Sun's energy is at its peak. Ideal for physical activity, self-care rituals, and setting clear intentions for the week.",
      moderate:
        "A calm Sunday morning. Good for gentle movement and preparing for the week ahead.",
      low: "The Sun is gentle today. Rest and let energy build naturally before noon.",
    },
    Afternoon: {
      high: "Sun's vitality shines through the afternoon. A great time to pursue health goals and express yourself.",
      moderate:
        "A steady Sunday afternoon. Good for personal projects and anything that nourishes you.",
      low: "Keep the afternoon light — napping or slow walks serve you better.",
    },
    Evening: {
      high: "Bright Sunday evening — social energy is unexpectedly high. Connect with people who energize you.",
      moderate:
        "Wind down gently tonight. Prepare mentally for the week ahead.",
      low: "Rest is the best use of this evening. Early to bed and tomorrow opens better.",
    },
  },
  Monday: {
    Morning: {
      high: "Moon energy is at its strongest this morning. Let feeling lead your decisions — your intuition is sharp.",
      moderate:
        "A reflective Monday morning. Set your emotional tone for the week and don't rush.",
      low: "The Moon is waning in strength this morning. Take it slow and avoid confrontations early.",
    },
    Afternoon: {
      high: "Emotional intelligence is your superpower this afternoon. Family and connection conversations go well.",
      moderate:
        "Moon's midday phase — good for nurturing tasks and checking in with people you care about.",
      low: "Low moon energy in the afternoon. Stick to routine; emotional work can wait.",
    },
    Evening: {
      high: "Moon evenings are made for family and close connection. Reach out to someone you love tonight.",
      moderate:
        "A gentle Monday night. Good for journaling or quiet conversation.",
      low: "Rest tonight. The Moon needs to recover, and so do you.",
    },
  },
  Tuesday: {
    Morning: {
      high: "Mars gives you an early burst of power. Tackle the hardest task on your list before 10 AM.",
      moderate:
        "Some Mars energy available — good for physical activity and focused work.",
      low: "Mars is subdued today. Don't force early intensity — pace yourself.",
    },
    Afternoon: {
      high: "Mars energy stays strong. Good for athletic effort, direct conversations, and getting things done.",
      moderate:
        "A decent work afternoon. Push through the medium-difficulty tasks on your list.",
      low: "Low energy Tuesday afternoon. Avoid confrontation and rest between tasks.",
    },
    Evening: {
      high: "Mars evening — good for assertive decisions you've been postponing. Act on what you already know.",
      moderate:
        "Wind down well. Light exercise helps process today's drive before sleep.",
      low: "Low Mars evening. Rest and let the drive return tomorrow.",
    },
  },
  Wednesday: {
    Morning: {
      high: "Mercury sharpens your mind this morning. Write, plan, communicate — ideas flow easily today.",
      moderate:
        "A decent morning for organized thinking. Handle correspondence and planning before noon.",
      low: "Mercury is quiet this morning. Re-read before sending and avoid important negotiations.",
    },
    Afternoon: {
      high: "Mental energy peaks. Best time for strategy sessions, deep writing, or complex problem-solving.",
      moderate:
        "A steady afternoon for methodical work. Good for following up and tying loose ends.",
      low: "Mercury slows this afternoon. Short tasks over deep work.",
    },
    Evening: {
      high: "Mercury evening — excellent for clever conversation, pitching ideas, and social wit.",
      moderate: "A decent evening for casual connection and light reading.",
      low: "Mercury is tired tonight. Rest your mind and return to complex topics tomorrow.",
    },
  },
  Thursday: {
    Morning: {
      high: "Jupiter expands everything it touches today. Morning decisions carry long-term weight — think big.",
      moderate:
        "Jupiter's optimism is available but mild. Good for practical planning and financial decisions.",
      low: "Jupiter is restrained this morning. Hold off on large commitments — better timing comes.",
    },
    Afternoon: {
      high: "Jupiter's afternoon energy is excellent for growth conversations, teaching, and financial moves.",
      moderate:
        "A good Thursday for routine work and steady progress toward larger goals.",
      low: "Low Jupiter energy this afternoon. Avoid overcommitting or expanding plans today.",
    },
    Evening: {
      high: "Jupiter evenings are generous. Good for hosting, gifting, and abundant thinking.",
      moderate:
        "A pleasant Thursday evening. Good for gratitude practice and light social plans.",
      low: "Low expansion energy tonight. Keep it simple and rest.",
    },
  },
  Friday: {
    Morning: {
      high: "Venus day starts beautifully. Good morning for self-care, beauty routines, and sending affectionate messages.",
      moderate:
        "A pleasant Friday morning. Treat yourself — even a small luxury sets the right tone.",
      low: "Venus is subtle this morning. Light self-care over social effort.",
    },
    Afternoon: {
      high: "Venus energy strengthens through the day. Creative work, beauty projects, and relationship effort all go well.",
      moderate: "A decent Friday afternoon for aesthetic and creative tasks.",
      low: "Low Venus energy in the afternoon. Quiet your social battery and rest before evening.",
    },
    Evening: {
      high: "Venus evening — the best time of the week for romance, connection, and pleasure. Go out or invite someone in.",
      moderate:
        "A pleasant Friday night. Good for relaxed social plans and gentle romance.",
      low: "Low energy Venus evening. Stay in and create something beautiful for yourself.",
    },
  },
  Saturday: {
    Morning: {
      high: "Saturn rewards discipline today. Start with your hardest, most delayed task — you have the will for it.",
      moderate:
        "A capable Saturday morning. Good for deep cleaning, long-deferred admin, and structure-building.",
      low: "Saturn's heaviness is real this morning. One small, useful task is enough.",
    },
    Afternoon: {
      high: "Saturn afternoon — persistent, focused effort pays off today. Finish what you started this week.",
      moderate: "Steady progress Saturday. Not inspiring, but productive.",
      low: "A slow Saturn afternoon. Rest without guilt — this too is part of the cycle.",
    },
    Evening: {
      high: "Saturn evening: good for honest reflection, letting go of what isn't working, and planning the next week.",
      moderate:
        "A decent Saturday night for journaling and reviewing the week.",
      low: "Saturn's evening calls for rest and silence. Tomorrow will be lighter.",
    },
  },
};

// ── All achievements (for modal) ─────────────────────────────────────────────

const ALL_BADGES = [
  {
    id: "full_moon_witness",
    icon: "🌕",
    name: "Full Moon Witness",
    desc: "Check in on Purnima",
    category: "Cosmic Events",
    repeatable: true,
  },
  {
    id: "new_moon_keeper",
    icon: "🌑",
    name: "New Moon Keeper",
    desc: "Check in on Amavasya",
    category: "Cosmic Events",
    repeatable: true,
  },
  {
    id: "star_day",
    icon: "⭐",
    name: "Star Day",
    desc: "Check in on your Nakshatra Birthday",
    category: "Cosmic Events",
    repeatable: true,
  },
  {
    id: "lunar_birthday",
    icon: "🎂",
    name: "Lunar Birthday",
    desc: "Check in on your Tithi Birthday",
    category: "Cosmic Events",
    repeatable: true,
  },
  {
    id: "vaara_birthday",
    icon: "📅",
    name: "Your Day",
    desc: "Check in on your Vaara Birthday",
    category: "Cosmic Events",
    repeatable: true,
  },
  {
    id: "rare_alignment",
    icon: "🌟",
    name: "Rare Alignment",
    desc: "Nakshatra + Tithi + Vaara all match natal",
    category: "Cosmic Events",
    repeatable: true,
  },
  {
    id: "eclipse_chaser",
    icon: "🌒",
    name: "Eclipse Chaser",
    desc: "Check in during a lunar eclipse",
    category: "Cosmic Events",
    repeatable: true,
  },
  {
    id: "solar_event",
    icon: "☀️",
    name: "Solstice Keeper",
    desc: "Check in on a solstice or equinox",
    category: "Cosmic Events",
    repeatable: true,
  },

  {
    id: "streak_3",
    icon: "🔥",
    name: "First Spark",
    desc: "3-day streak",
    category: "Streak Milestones",
    repeatable: false,
  },
  {
    id: "streak_7",
    icon: "🔥🔥",
    name: "First Week",
    desc: "7-day streak",
    category: "Streak Milestones",
    repeatable: false,
  },
  {
    id: "streak_14",
    icon: "🌙",
    name: "Moonwalker",
    desc: "14-day streak",
    category: "Streak Milestones",
    repeatable: false,
  },
  {
    id: "streak_29",
    icon: "🌕",
    name: "Full Cycle",
    desc: "29-day streak (one lunar cycle)",
    category: "Streak Milestones",
    repeatable: false,
  },
  {
    id: "streak_90",
    icon: "✨",
    name: "Three Moons",
    desc: "90-day streak",
    category: "Streak Milestones",
    repeatable: false,
  },
  {
    id: "streak_180",
    icon: "🌠",
    name: "Half Year",
    desc: "180-day streak",
    category: "Streak Milestones",
    repeatable: false,
  },
  {
    id: "streak_365",
    icon: "🏆",
    name: "Year of Stars",
    desc: "365-day streak",
    category: "Streak Milestones",
    repeatable: false,
  },

  {
    id: "loyalty_3d",
    icon: "🌱",
    name: "First Steps",
    desc: "3 days since joining",
    category: "Loyalty",
    repeatable: false,
  },
  {
    id: "loyalty_7d",
    icon: "🌿",
    name: "One Week",
    desc: "1 week since joining",
    category: "Loyalty",
    repeatable: false,
  },
  {
    id: "loyalty_30d",
    icon: "🌳",
    name: "One Month",
    desc: "30 days since joining",
    category: "Loyalty",
    repeatable: false,
  },
  {
    id: "loyalty_90d",
    icon: "🌲",
    name: "Three Months",
    desc: "90 days since joining",
    category: "Loyalty",
    repeatable: false,
  },
  {
    id: "loyalty_180d",
    icon: "🏔️",
    name: "Half Year",
    desc: "180 days since joining",
    category: "Loyalty",
    repeatable: false,
  },
  {
    id: "loyalty_365d",
    icon: "🌌",
    name: "One Full Year",
    desc: "365 days since joining",
    category: "Loyalty",
    repeatable: false,
  },

  {
    id: "first_match",
    icon: "💫",
    name: "First Connection",
    desc: "First mutual match",
    category: "Social",
    repeatable: false,
  },
  {
    id: "five_matches",
    icon: "💫💫",
    name: "Rising Star",
    desc: "5 matches total",
    category: "Social",
    repeatable: false,
  },
  {
    id: "twenty_matches",
    icon: "🌟",
    name: "Star Connector",
    desc: "20 matches total",
    category: "Social",
    repeatable: false,
  },
  {
    id: "shared_today",
    icon: "📲",
    name: "Sky Sharer",
    desc: "Shared Today card to social",
    category: "Social",
    repeatable: true,
  },
  {
    id: "invited_friend",
    icon: "🤝",
    name: "Cosmic Invite",
    desc: "Invited a friend who joined",
    category: "Social",
    repeatable: true,
  },

  {
    id: "event_checkin",
    icon: "🎪",
    name: "Star Gatherer",
    desc: "Checked in at a Bisou event",
    category: "Events",
    repeatable: true,
  },
  {
    id: "event_matched",
    icon: "🎯",
    name: "Event Match",
    desc: "Got a match at an event",
    category: "Events",
    repeatable: true,
  },
  {
    id: "event_series",
    icon: "🏅",
    name: "Event Regular",
    desc: "Attended 3+ events",
    category: "Events",
    repeatable: false,
  },
];

const BADGE_CATEGORIES = [
  "Cosmic Events",
  "Streak Milestones",
  "Loyalty",
  "Social",
  "Events",
];

const STREAK_MILESTONES = [3, 7, 14, 29, 90, 180, 365];
const STREAK_MILESTONE_LABELS = {
  3: "First Spark 🔥",
  7: "First Week 🔥🔥",
  14: "Moonwalker 🌙",
  29: "Full Cycle 🌕",
  90: "Three Moons ✨",
  180: "Half Year 🌠",
  365: "Year of Stars 🏆",
};

// ── Power Windows ─────────────────────────────────────────────────────────────

const POWER_WINDOWS = {
  Sunday: [
    {
      icon: "☀️",
      title: "High energy start",
      time: "7:00 – 8:30 AM",
      slot: "morning",
      quality: "peak",
      hint: "Physical energy and confidence are at their peak — ideal for exercise, important calls, or anything needing momentum",
    },
    {
      icon: "🧠",
      title: "Deep focus window",
      time: "10:30 AM – 12:00",
      slot: "morning",
      quality: "peak",
      hint: "Mental sharpness peaks here — use it for analysis, writing, or any work requiring concentration",
    },
    {
      icon: "✦",
      title: "Abhijit Muhurta",
      time: "11:48 AM – 12:24",
      slot: "afternoon",
      quality: "golden",
      hint: "The most auspicious 36-minute window of the day. Calculated as the 8th hora from sunrise — use it for important choices, agreements, or new starts",
    },
    {
      icon: "⚠️",
      title: "Rahu Kaal",
      time: "4:30 – 6:00 PM",
      slot: "evening",
      quality: "avoid",
      hint: "Rahu Kaal — 8th part of the day, ruled by Rahu. Traditionally inauspicious: avoid starting new ventures, signing contracts, or major decisions in this window",
    },
    {
      icon: "💛",
      title: "Social & creative hour",
      time: "7:00 – 8:30 PM",
      slot: "evening",
      quality: "medium",
      hint: "Warm, connecting energy — good for meaningful conversations, creative ideas, or quality time with people you care about",
    },
  ],
  Monday: [
    {
      icon: "⚠️",
      title: "Rahu Kaal",
      time: "7:30 – 9:00 AM",
      slot: "morning",
      quality: "avoid",
      hint: "Rahu Kaal — 2nd part of the day on Monday. Avoid starting anything new, travel, or important conversations until this window passes",
    },
    {
      icon: "✦",
      title: "Growth window",
      time: "9:00 – 10:00 AM",
      slot: "morning",
      quality: "peak",
      hint: "The day opens up here — good for big-picture thinking, planning, and important conversations",
    },
    {
      icon: "✦",
      title: "Abhijit Muhurta",
      time: "11:48 AM – 12:24",
      slot: "afternoon",
      quality: "golden",
      hint: "The most auspicious 36-minute window of the day. Calculated as the 8th hora from sunrise — use it for important choices, agreements, or new starts",
    },
    {
      icon: "🌙",
      title: "Gut feeling window",
      time: "2:30 – 3:30 PM",
      slot: "afternoon",
      quality: "medium",
      hint: "Intuition is sharper than usual — good for reflection, creative work, or trusting your gut on something you've been weighing",
    },
    {
      icon: "💛",
      title: "Evening warmth",
      time: "7:30 – 8:30 PM",
      slot: "evening",
      quality: "medium",
      hint: "Relational energy returns — a good time to reconnect with people that matter",
    },
  ],
  Tuesday: [
    {
      icon: "🔥",
      title: "Peak drive window",
      time: "7:00 – 8:00 AM",
      slot: "morning",
      quality: "peak",
      hint: "The highest physical and mental drive of the day — tackle your hardest task now, before the energy settles",
    },
    {
      icon: "💛",
      title: "Social window",
      time: "8:00 – 9:30 AM",
      slot: "morning",
      quality: "medium",
      hint: "The best time on a high-drive day to reach out, have conversations, or collaborate with others",
    },
    {
      icon: "✦",
      title: "Abhijit Muhurta",
      time: "11:48 AM – 12:24",
      slot: "afternoon",
      quality: "golden",
      hint: "The most auspicious 36-minute window of the day. Calculated as the 8th hora from sunrise — use it for important choices, agreements, or new starts",
    },
    {
      icon: "⚠️",
      title: "Rahu Kaal",
      time: "3:00 – 4:30 PM",
      slot: "afternoon",
      quality: "avoid",
      hint: "Rahu Kaal — 7th part of the day on Tuesday. Avoid starting new ventures, signing agreements, or beginning travel in this window",
    },
    {
      icon: "🧠",
      title: "Evening clarity",
      time: "9:00 – 10:00 PM",
      slot: "evening",
      quality: "medium",
      hint: "A quiet, clear window — good for reflection, journaling, or light planning for tomorrow",
    },
  ],
  Wednesday: [
    {
      icon: "🧠",
      title: "Sharpest thinking of the week",
      time: "7:00 – 8:00 AM",
      slot: "morning",
      quality: "peak",
      hint: "Wednesday mornings carry more mental clarity than any other day this week — use it for strategy, key messages, or complex thinking",
    },
    {
      icon: "🌙",
      title: "Gut feeling window",
      time: "9:00 – 10:00 AM",
      slot: "morning",
      quality: "medium",
      hint: "Intuition briefly takes over from logic — good for creative choices or decisions that need to feel right, not just make sense",
    },
    {
      icon: "✦",
      title: "Abhijit Muhurta",
      time: "11:48 AM – 12:24",
      slot: "afternoon",
      quality: "golden",
      hint: "Make your important move here — the Rahu Kaal zone starts right after this window ends",
    },
    {
      icon: "⚠️",
      title: "Rahu Kaal",
      time: "12:00 – 1:30 PM",
      slot: "afternoon",
      quality: "avoid",
      hint: "Rahu Kaal — 5th part of the day on Wednesday. Keep this window for routine tasks — avoid new starts, contracts, or important conversations",
    },
    {
      icon: "💛",
      title: "Creative evening",
      time: "8:00 – 9:30 PM",
      slot: "evening",
      quality: "medium",
      hint: "A warm, expressive window — good for art, meaningful conversations, or anything creative",
    },
  ],
  Thursday: [
    {
      icon: "✦",
      title: "Best start of the week",
      time: "7:00 – 8:30 AM",
      slot: "morning",
      quality: "peak",
      hint: "Thursday mornings carry strong growth energy — ideal for launching something, having a big conversation, or making a meaningful decision early",
    },
    {
      icon: "🧠",
      title: "Communication window",
      time: "10:30 – 11:30 AM",
      slot: "morning",
      quality: "peak",
      hint: "Precision and persuasion both peak here — strong for negotiations, presentations, and any message that needs to land well",
    },
    {
      icon: "✦",
      title: "Abhijit Muhurta",
      time: "11:48 AM – 12:24",
      slot: "afternoon",
      quality: "golden",
      hint: "The most auspicious 36-minute window of the day. Calculated as the 8th hora from sunrise — use it for important choices, agreements, or new starts",
    },
    {
      icon: "⚠️",
      title: "Rahu Kaal",
      time: "1:30 – 3:00 PM",
      slot: "afternoon",
      quality: "avoid",
      hint: "Rahu Kaal — 6th part of the day on Thursday. Avoid new commitments, travel departures, or important decisions in this window",
    },
    {
      icon: "🌙",
      title: "Wind-down time",
      time: "9:30 – 10:30 PM",
      slot: "evening",
      quality: "rest",
      hint: "The evening settles into calm — a natural moment for screen-free rest, light reading, or gentle preparation for sleep",
    },
  ],
  Friday: [
    {
      icon: "💛",
      title: "Love & creativity peak",
      time: "7:00 – 8:30 AM",
      slot: "morning",
      quality: "peak",
      hint: "Friday mornings carry the strongest love and creative energy of the week — a special window for anything that needs heart or beauty",
    },
    {
      icon: "🧠",
      title: "Sharp thinking",
      time: "8:30 – 9:30 AM",
      slot: "morning",
      quality: "peak",
      hint: "Mental clarity before the day gets social and emotional — use this short window for focused work while it lasts",
    },
    {
      icon: "⚠️",
      title: "Rahu Kaal",
      time: "10:30 AM – 12:00",
      slot: "morning",
      quality: "avoid",
      hint: "Rahu Kaal — 4th part of the day on Friday. Avoid new starts, contracts, or major decisions until the Abhijit window opens at noon",
    },
    {
      icon: "✦",
      title: "Abhijit Muhurta",
      time: "11:48 AM – 12:24",
      slot: "afternoon",
      quality: "golden",
      hint: "Right as the Rahu Kaal lifts — this is your opening. Use it for important choices, agreements, or new starts",
    },
    {
      icon: "💛",
      title: "Peak evening energy",
      time: "7:30 – 9:30 PM",
      slot: "evening",
      quality: "peak",
      hint: "The best evening of the entire week for love, meaningful connection, and social energy — do not let it pass quietly",
    },
  ],
  Saturday: [
    {
      icon: "🪐",
      title: "Focused work time",
      time: "7:00 – 8:00 AM",
      slot: "morning",
      quality: "peak",
      hint: "Saturday mornings are uniquely suited for structured, long-form, or administrative work — energy is concentrated and distraction-free",
    },
    {
      icon: "⚠️",
      title: "Rahu Kaal",
      time: "9:00 – 10:30 AM",
      slot: "morning",
      quality: "avoid",
      hint: "Rahu Kaal — 3rd part of the day on Saturday. Avoid new ventures, important travel, or consequential conversations in this window",
    },
    {
      icon: "✦",
      title: "Good moment to decide",
      time: "10:30 – 11:30 AM",
      slot: "morning",
      quality: "medium",
      hint: "Expanded thinking returns after the slow morning — good for decisions that need a clear head",
    },
    {
      icon: "✦",
      title: "Abhijit Muhurta",
      time: "11:48 AM – 12:24",
      slot: "afternoon",
      quality: "golden",
      hint: "The most auspicious 36-minute window of the day. Calculated as the 8th hora from sunrise — use it for important choices, agreements, or new starts",
    },
    {
      icon: "🌙",
      title: "Evening reflection",
      time: "9:00 – 10:30 PM",
      slot: "evening",
      quality: "rest",
      hint: "The week closes gently here — good for journaling, emotional processing, or simply letting everything settle",
    },
  ],
};

// ── Nakshatra lookup table ───────────────────────────────────────────────────

const NAKSHATRA_DATA = {
  Ashwini: {
    emoji: "🐴",
    devata: "Ashwini Kumaras",
    symbol: "Horse head",
    guna: "Rajas",
    mainText:
      "Energy for bold starts. Good for anything new — action taken today has real momentum.",
    extended:
      "The healing twins rule this star. Great for beginning treatments, travel, and any endeavour needing speed. Avoid overthinking — this nakshatra rewards the first move.",
  },
  Bharani: {
    emoji: "🔺",
    devata: "Yama",
    symbol: "Yoni (womb)",
    guna: "Rajas",
    mainText:
      "Karmic themes surface. A day to face what you've been avoiding and release what's overdue.",
    extended:
      "Yama brings accountability and transformation. Endings, creative births, and difficult truths all land with extra weight today. Not a day for avoidance.",
  },
  Krittika: {
    emoji: "🔪",
    devata: "Agni",
    symbol: "Blade / flame",
    guna: "Rajas",
    mainText:
      "Precision energy. Cut away distractions and focus on the one thing that matters most today.",
    extended:
      "Agni (fire) burns away the unnecessary. Perfect for decisive action, clean communication, and removing obstacles. Avoid scattered effort.",
  },
  Rohini: {
    emoji: "🌹",
    devata: "Brahma",
    symbol: "Cart / ox cart",
    guna: "Tamas",
    mainText:
      "The most romantic nakshatra. Love, beauty, and creativity are amplified — make use of it.",
    extended:
      "Brahma's creative power runs through Rohini. Ideal for artistic projects, romantic expression, and anything needing charm or abundance. Indulgence is easy today — be intentional.",
  },
  Mrigashira: {
    emoji: "🦌",
    devata: "Soma (Moon)",
    symbol: "Deer head",
    guna: "Rajas",
    mainText:
      "Curiosity and seeking are strong. Follow the trail of an idea or desire today.",
    extended:
      "The searching deer represents the mind in pursuit. Good for research, exploration, and early-stage projects. Restlessness is a side effect — channel it.",
  },
  Ardra: {
    emoji: "💧",
    devata: "Rudra",
    symbol: "Teardrop / gem",
    guna: "Tamas",
    mainText:
      "Emotional intensity is high. Breakthroughs often follow moments of real difficulty today.",
    extended:
      "Rudra, the storm god, brings destruction that clears the way for transformation. Expect sharp emotional weather. Journaling and honest conversation help.",
  },
  Punarvasu: {
    emoji: "🏹",
    devata: "Aditi",
    symbol: "Bow and quiver",
    guna: "Sattva",
    mainText:
      "Renewal and return. Something that didn't work before may find its second chance today.",
    extended:
      "Aditi — goddess of infinite space and renewal — governs Punarvasu. Old projects, reconnections, and returning energy all have potential. Optimism is well-founded today.",
  },
  Pushya: {
    emoji: "🌸",
    devata: "Brihaspati",
    symbol: "Flower / circle",
    guna: "Tamas",
    mainText:
      "One of the most auspicious nakshatras. Nurturing, growth, and abundance are supported today.",
    extended:
      "Jupiter's own star — excellent for almost any positive activity. Investments, spiritual practice, family, and health decisions carry long-term benefit. Rarely a better day to begin something.",
  },
  Ashlesha: {
    emoji: "🐍",
    devata: "Nagas (serpents)",
    symbol: "Coiled serpent",
    guna: "Sattva",
    mainText:
      "Perceptive and penetrating. You'll see through surface appearances more easily than usual today.",
    extended:
      "The serpent sees what others miss. Excellent for deep analysis, hidden research, and uncovering truths. Watch for manipulation — yours and others'. A potent but complex day.",
  },
  Magha: {
    emoji: "👑",
    devata: "Pitrs (ancestors)",
    symbol: "Throne / royal hall",
    guna: "Tamas",
    mainText:
      "Ancestral energy. Honour your roots — what you do today echoes your lineage.",
    extended:
      "Magha carries the weight of legacy. Powerful for authority, tradition, and acts of respect. Arrogance and pride are also amplified — stay grounded in gratitude.",
  },
  "Purva Phalguni": {
    emoji: "🛏️",
    devata: "Bhaga",
    symbol: "Hammock / front leg",
    guna: "Rajas",
    mainText:
      "Pleasure, rest, and creative delight. A day designed for enjoyment — don't fight it.",
    extended:
      "Bhaga brings gifts, pleasure, and marital happiness. Excellent for relaxation, creative play, and romance. Productive effort should feel light today, not forced.",
  },
  "Uttara Phalguni": {
    emoji: "🤝",
    devata: "Aryaman",
    symbol: "Bed / back leg",
    guna: "Rajas",
    mainText:
      "Partnership and agreements have power today. Contracts, commitments, and unions go well.",
    extended:
      "Aryaman rules friendship, contracts, and social bonds. A strong day for formalising commitments, resolving disputes, and building alliances. Practical kindness is well-received.",
  },
  Hasta: {
    emoji: "✋",
    devata: "Savitar (Sun)",
    symbol: "Open hand",
    guna: "Rajas",
    mainText:
      "Skilled and dexterous. Anything made by hand or with careful detail goes especially well today.",
    extended:
      "The hand of the Sun is precise, clever, and resourceful. Writing, crafting, medical work, and anything needing hand-skill are favoured. Wit is sharpened — use it well.",
  },
  Chitra: {
    emoji: "💎",
    devata: "Tvashtr",
    symbol: "Bright jewel",
    guna: "Tamas",
    mainText:
      "Beauty and precision. Your eye for design, detail, and aesthetics is sharper than usual.",
    extended:
      "Tvashtr is the divine craftsman — Chitra favours architecture, beauty, design, and technical skill. What you create today can be exceptional. Perfectionism helps; rigidity doesn't.",
  },
  Swati: {
    emoji: "🌬️",
    devata: "Vayu (Wind)",
    symbol: "Coral / young sprout",
    guna: "Tamas",
    mainText:
      "Independence and movement. Go your own way today — this is not a day for following others.",
    extended:
      "The wind nakshatra favours flexibility, trade, and self-directed movement. Excellent for business, negotiation, and travel. Being too attached to outcomes creates friction.",
  },
  Vishakha: {
    emoji: "⚡",
    devata: "Indra-Agni",
    symbol: "Triumphal arch",
    guna: "Rajas",
    mainText:
      "Goal-focused intensity. You have the drive for a strong push today — direct it well.",
    extended:
      "Indra and Agni together create determined, purposeful energy. Excellent for ambition, competition, and crossing a finish line. Watch for jealousy or rivalry as a distraction.",
  },
  Anuradha: {
    emoji: "🌺",
    devata: "Mitra",
    symbol: "Lotus",
    guna: "Tamas",
    mainText:
      "Friendship and cooperation. Alliances formed or strengthened today have real staying power.",
    extended:
      "Mitra is the god of contracts and friendship. Excellent for team efforts, diplomatic conversations, and sustained relationships. Deep loyalty is both given and expected today.",
  },
  Jyeshtha: {
    emoji: "🌀",
    devata: "Indra",
    symbol: "Circular amulet",
    guna: "Rajas",
    mainText:
      "Authority and leadership. Step into the role that's been waiting for you.",
    extended:
      "The eldest and most powerful star. Excellent for leadership decisions, courageous moves, and protecting what matters. Pride and isolation are the shadow — stay connected to others.",
  },
  Mula: {
    emoji: "🌿",
    devata: "Niritti",
    symbol: "Bundle of roots",
    guna: "Tamas",
    mainText:
      "Roots and foundations. Go to the core of the matter — surface fixes won't hold today.",
    extended:
      "Niritti (dissolution) governs Mula. This is a day for deep research, getting to origins, and dismantling what no longer holds. Radical honesty serves better than comfort.",
  },
  "Purva Ashadha": {
    emoji: "🌊",
    devata: "Apas (Waters)",
    symbol: "Fan / elephant tusk",
    guna: "Rajas",
    mainText:
      "Purification and confidence. Declare your position — today supports bold, unashamed commitment.",
    extended:
      "The water goddess brings cleansing and invincibility. Good for public declarations, raising morale, and preparing for a longer campaign. Don't waffle — commit.",
  },
  "Uttara Ashadha": {
    emoji: "🏆",
    devata: "Vishvadevas",
    symbol: "Elephant tusk",
    guna: "Sattva",
    mainText:
      "Victory and endurance. What you build with patient effort today is meant to last.",
    extended:
      "The universal gods bestow blessings that go the distance. Excellent for long-term projects, ethical decisions, and acts of service. Shortcuts undo what slow work has built.",
  },
  Shravana: {
    emoji: "👂",
    devata: "Vishnu",
    symbol: "Ear / three footprints",
    guna: "Rajas",
    mainText:
      "Listening and learning. Absorb more than you speak today — something important is being said.",
    extended:
      "Vishnu's star — associated with knowledge, preservation, and hearing clearly. Excellent for study, consultation, and receiving wisdom. Gossip and misunderstanding are easily amplified today.",
  },
  Dhanishtha: {
    emoji: "🥁",
    devata: "Ashta Vasus",
    symbol: "Drum",
    guna: "Tamas",
    mainText:
      "Abundance and rhythm. Find your pace and let it carry you forward without force.",
    extended:
      "The eight Vasus give wealth, music, and group energy. Good for community, wealth-building, and getting into flow. Overconfidence and excess are the shadows of this star.",
  },
  Shatabhisha: {
    emoji: "🔭",
    devata: "Varuna",
    symbol: "100 physicians / empty circle",
    guna: "Tamas",
    mainText:
      "Healing and hidden knowledge. Something concealed is ready to be understood today.",
    extended:
      "Varuna governs the cosmic ocean and hidden truths. Excellent for research, meditation, healing practices, and independent thinking. Isolation helps today more than usual.",
  },
  "Purva Bhadrapada": {
    emoji: "🔥",
    devata: "Aja Ekapad",
    symbol: "Front legs of funeral cot",
    guna: "Rajas",
    mainText:
      "Intensity and transformation. Strong forces are moving under the surface — stay grounded.",
    extended:
      "This fierce nakshatra carries the energy of the fire serpent. Good for transformation, renunciation, and intense focus. Fear and anger are amplified — channel them.",
  },
  "Uttara Bhadrapada": {
    emoji: "🌀",
    devata: "Ahir Budhanya",
    symbol: "Back legs of funeral cot",
    guna: "Tamas",
    mainText:
      "Depth and wisdom. Quiet the mind and let what needs to surface, surface.",
    extended:
      "The serpent of the deep brings profound stillness and wisdom. Excellent for meditation, service, and patient endurance. Detachment is a strength today, not a weakness.",
  },
  Revati: {
    emoji: "🐟",
    devata: "Pushan",
    symbol: "Fish / drum",
    guna: "Sattva",
    mainText:
      "Nourishment and safe passage. Trust that you are being guided and protected today.",
    extended:
      "Pushan is the god of safe travel and nourishment. The last nakshatra holds a quality of gentle completion. Good for closure, travel, charity, and spiritual practice. A day for trust, not control.",
  },
};

// ── Dasha data per scenario ──────────────────────────────────────────────────
// In production this is computed from natal_moon_longitude + birth date
// Here we use representative static data for the demo

const DASHA_DEMO = {
  Sofia: {
    maha: "Venus (Shukra)",
    mahaIcon: "💛",
    mahaUntil: "Mar 2027",
    antar: "Moon (Chandra)",
    antarUntil: "Sep 2025",
    cycleProgress: 62,
    cycleColor: "#f9a8d4",
    sentence:
      "Venus cycle — focus on love, beauty, and relationships this year.",
    comboMeaning:
      "Venus–Moon: the heart is open. Ideal for deepening bonds, creative work, and emotional honesty.",
  },
  Arjun: {
    maha: "Saturn (Shani)",
    mahaIcon: "🪐",
    mahaUntil: "Nov 2028",
    antar: "Mercury (Budha)",
    antarUntil: "Apr 2026",
    cycleProgress: 38,
    cycleColor: "#a78bfa",
    sentence:
      "Saturn cycle — discipline and long-term building are your themes.",
    comboMeaning:
      "Saturn–Mercury: sharp strategic thinking under pressure. Planning pays off. Avoid cutting corners.",
  },
  Maya: {
    maha: "Sun (Surya)",
    mahaIcon: "☀️",
    mahaUntil: "Aug 2024",
    antar: "Jupiter (Guru)",
    antarUntil: "Dec 2023",
    cycleProgress: 85,
    cycleColor: "#fcd34d",
    sentence:
      "Sun cycle — identity, authority, and self-expression are in focus.",
    comboMeaning:
      "Sun–Jupiter: clarity, optimism, and leadership. A window for visibility and growth. Act on it.",
  },
  Lena: {
    maha: "Mars (Mangal)",
    mahaIcon: "🔥",
    mahaUntil: "Jun 2025",
    antar: "Rahu",
    antarUntil: "Feb 2025",
    cycleProgress: 74,
    cycleColor: "#f87171",
    sentence:
      "Mars cycle — drive and ambition are high. Channel energy deliberately.",
    comboMeaning:
      "Mars–Rahu: intense ambition with disruptive undertones. Major results are possible but require control.",
  },
  Dev: {
    maha: "Jupiter (Guru)",
    mahaIcon: "🌟",
    mahaUntil: "Jan 2030",
    antar: "Venus (Shukra)",
    antarUntil: "Aug 2026",
    cycleProgress: 22,
    cycleColor: "#6ee7b7",
    sentence:
      "Jupiter cycle — expansion, wisdom, and abundance are your themes.",
    comboMeaning:
      "Jupiter–Venus: peak period for love, growth, and prosperity. One of the most auspicious antardasha combinations.",
  },
  Kate: {
    maha: "Rahu",
    mahaIcon: "🌑",
    mahaUntil: "Oct 2026",
    antar: "Saturn (Shani)",
    antarUntil: "Jun 2025",
    cycleProgress: 51,
    cycleColor: "#94a3b8",
    sentence:
      "Rahu cycle — ambition drives you into new territory. Stay discerning.",
    comboMeaning:
      "Rahu–Saturn: ambitious and disciplined. Long-term strategies yield results. Avoid shortcuts and impulsive risks.",
  },
  Leo: {
    maha: "Moon (Chandra)",
    mahaIcon: "🌙",
    mahaUntil: "May 2025",
    antar: "Mars (Mangal)",
    antarUntil: "Nov 2024",
    cycleProgress: 81,
    cycleColor: "#bfdbfe",
    sentence:
      "Moon cycle — emotional sensitivity and inner life are highlighted.",
    comboMeaning:
      "Moon–Mars: feelings run hot. Energy is available but needs direction. Avoid reactive decisions.",
  },
  Priya: {
    maha: "Mercury (Budha)",
    mahaIcon: "🧠",
    mahaUntil: "Sep 2027",
    antar: "Sun (Surya)",
    antarUntil: "Jul 2026",
    cycleProgress: 44,
    cycleColor: "#67e8f9",
    sentence:
      "Mercury cycle — communication, intellect, and precision are your edge.",
    comboMeaning:
      "Mercury–Sun: clarity of thought and strong self-expression. Excellent for career moves and public-facing work.",
  },
  Nina: {
    maha: "Venus (Shukra)",
    mahaIcon: "💛",
    mahaUntil: "Mar 2027",
    antar: "Jupiter (Guru)",
    antarUntil: "Jan 2026",
    cycleProgress: 58,
    cycleColor: "#f9a8d4",
    sentence:
      "Venus cycle — love, creativity, and abundance are your strongest themes.",
    comboMeaning:
      "Venus–Jupiter: one of the most auspicious combinations. Growth in relationships, finances, and creative life.",
  },
  Ravi: {
    maha: "Ketu",
    mahaIcon: "🌫️",
    mahaUntil: "Apr 2024",
    antar: "Ketu",
    antarUntil: "Sep 2023",
    cycleProgress: 93,
    cycleColor: "#d1d5db",
    sentence:
      "Ketu cycle — spiritual depth and letting go are the recurring themes.",
    comboMeaning:
      "Ketu–Ketu: deep detachment and purification. Inner clarity is available. External results feel less satisfying.",
  },
};

// ── Cosmic Body Map ──────────────────────────────────────────────────────────

const BODY_MAP = [
  {
    nakshatra: "Ashwini",
    icon: "🧠",
    area: "head & brain",
    tip: "Sharp starts today — protect against headaches from over-exertion",
  },
  {
    nakshatra: "Bharani",
    icon: "🧠",
    area: "head & forehead",
    tip: "Mental load is heavy today — step outside and breathe",
  },
  {
    nakshatra: "Krittika",
    icon: "👁️",
    area: "eyes, neck & shoulders",
    tip: "Screen fatigue hits harder — take visual breaks every 45 min",
  },
  {
    nakshatra: "Rohini",
    icon: "🗣️",
    area: "throat, mouth & face",
    tip: "Communication energy is high — use your voice deliberately",
  },
  {
    nakshatra: "Mrigashira",
    icon: "💪",
    area: "throat & upper arms",
    tip: "Shoulders carry today's tension — stretch before bed",
  },
  {
    nakshatra: "Ardra",
    icon: "🫁",
    area: "shoulders & chest",
    tip: "Emotional weight sits in the upper body today — notice tightness",
  },
  {
    nakshatra: "Punarvasu",
    icon: "🫁",
    area: "fingers, lungs & ears",
    tip: "Breathing is shallower today — slow inhales help",
  },
  {
    nakshatra: "Pushya",
    icon: "🫁",
    area: "chest, stomach & lungs",
    tip: "Digestive energy is sensitive — eat lighter and avoid skipping meals",
  },
  {
    nakshatra: "Ashlesha",
    icon: "🦵",
    area: "lungs, joints & knees",
    tip: "Joints need movement — sitting for long periods will slow you down",
  },
  {
    nakshatra: "Magha",
    icon: "❤️",
    area: "spine & heart",
    tip: "Heart energy is amplified — check in with what you're carrying emotionally",
  },
  {
    nakshatra: "Purva Phalguni",
    icon: "🔙",
    area: "heart, back & spine",
    tip: "Posture affects your mood today more than usual — stand tall",
  },
  {
    nakshatra: "Uttara Phalguni",
    icon: "🤲",
    area: "hands & intestines",
    tip: "Gut feelings are literally physical today — trust abdominal signals",
  },
  {
    nakshatra: "Hasta",
    icon: "🤲",
    area: "hands & bowels",
    tip: "Detail work with hands is energised — good for crafting, writing, or cooking",
  },
  {
    nakshatra: "Chitra",
    icon: "💧",
    area: "forehead & kidneys",
    tip: "Kidney energy benefits from hydration — drink more water than usual",
  },
  {
    nakshatra: "Swati",
    icon: "🫁",
    area: "skin, chest & kidneys",
    tip: "Skin is more reactive today — avoid irritants and get fresh air",
  },
  {
    nakshatra: "Vishakha",
    icon: "🦵",
    area: "lower abdomen & thighs",
    tip: "Lower body needs movement — walk, stretch legs, avoid sitting still",
  },
  {
    nakshatra: "Anuradha",
    icon: "🔙",
    area: "lower back, hips & thighs",
    tip: "Lower back tension accumulates — notice and release before evening",
  },
  {
    nakshatra: "Jyeshtha",
    icon: "🗣️",
    area: "neck & tongue",
    tip: "Speaking clearly matters more today — slow down before you respond",
  },
  {
    nakshatra: "Mula",
    icon: "🦶",
    area: "feet & lower back",
    tip: "Grounding energy sits in the feet — walk barefoot or get outside",
  },
  {
    nakshatra: "Purva Ashadha",
    icon: "🦵",
    area: "thighs & hips",
    tip: "Hip flexibility and movement ease the day's energy",
  },
  {
    nakshatra: "Uttara Ashadha",
    icon: "🦵",
    area: "thighs, knees & skin",
    tip: "Knees and thighs carry today's drive — move them to feel the flow",
  },
  {
    nakshatra: "Shravana",
    icon: "👂",
    area: "ears & legs",
    tip: "Listening is your strongest sense today — hear before speaking",
  },
  {
    nakshatra: "Dhanishtha",
    icon: "🦵",
    area: "ankles & back",
    tip: "Ankles and calves need gentle movement — stretch before long walks",
  },
  {
    nakshatra: "Shatabhisha",
    icon: "🩸",
    area: "ankles, calves & circulation",
    tip: "Circulation benefits from movement — avoid sitting for more than 1 hour",
  },
  {
    nakshatra: "Purva Bhadrapada",
    icon: "🦶",
    area: "feet & calves",
    tip: "A short walk resets your state on this nakshatra",
  },
  {
    nakshatra: "Uttara Bhadrapada",
    icon: "🦶",
    area: "feet & immune system",
    tip: "Rest supports your immune energy today — don't push through tiredness",
  },
  {
    nakshatra: "Revati",
    icon: "🦶",
    area: "feet & digestive system",
    tip: "A gentle walk and a lighter evening meal serve you well today",
  },
];

// ── Vedic Dice ───────────────────────────────────────────────────────────────

function compColor(score) {
  if (score >= 80) return "#4ade80";
  if (score >= 60) return "#fbbf24";
  if (score >= 40) return "#fb923c";
  return "#f87171";
}

function compLabel(score) {
  if (score >= 80) return "Strong match";
  if (score >= 60) return "Good match";
  if (score >= 40) return "Different energies";
  return "Rough day for connection";
}

// ── Scenarios ────────────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    label: "🌕 Full Moon Friday",
    userName: "Sofia",
    vaara: "Friday",
    tithi: 15,
    tithiName: "Purnima",
    nakshatra: "Pushya",
    isPurnima: true,
    isAmavasya: false,
    isChaturdashi: false,
    isNakshatraBirthday: false,
    isTithiBirthday: false,
    isVaaraBirthday: false,
    starsAlign: false,
    isEclipse: false,
    paksha: "Shukla",
    timeOfDay: "evening",
    scores: {
      love: 92,
      career: 64,
      health: 78,
      money: 70,
      social: 88,
      family: 82,
    },
    streak: 14,
    graceDay: false,
    vibeText:
      "Full Moon energy peaks tonight on Pushya nakshatra — one of the most auspicious stars of the month. Your love and social energy are amplified. Reach out to someone meaningful before the night ends.",
    doTips: [
      {
        text: "Release something that no longer serves you on this Full Moon",
        tags: ["Full Moon", "Shukla"],
      },
      {
        text: "Reach out to someone you've been thinking about",
        tags: ["Love ↑", "Friday"],
      },
      {
        text: "Plan a date or quality time with your partner today",
        tags: ["Love ↑", "Social ↑"],
      },
    ],
    avoidTips: [
      {
        text: "Avoid staying up past midnight — your recovery window matters tonight",
        tags: ["Full Moon"],
      },
      {
        text: "Don't make impulsive purchases today — the urge will pass",
        tags: ["Full Moon", "Friday"],
      },
      {
        text: "Skip the passive-aggressive comment you're considering",
        tags: ["Full Moon"],
      },
    ],
    badges: [
      {
        icon: "🌕",
        name: "Full Moon Witness",
        count: 3,
        tier: "silver",
        id: "full_moon_witness",
      },
      {
        icon: "🌙",
        name: "Moonwalker",
        count: null,
        tier: "standard",
        id: "streak_14",
      },
      {
        icon: "🔥🔥",
        name: "First Week",
        count: null,
        tier: "standard",
        id: "streak_7",
      },
    ],
    tomorrowKey: "default",
    tomorrowTop: "Love",
    tomorrowLabel: "Moderate",
    connectOnboardingDone: true,
    matches: [
      {
        name: "Marcus",
        avatar: "☀️",
        nakshatra: "Uttara Phalguni",
        score: 91,
        insight:
          "Both in Love ↑ today — a rare double Venus alignment on a Full Moon. Reach out before midnight.",
      },
      {
        name: "Liam",
        avatar: "🌊",
        nakshatra: "Shravana",
        score: 68,
        insight:
          "His Social is high, yours is Love — good conversation energy but different wavelengths today.",
      },
    ],
    oracleCards: [
      {
        name: "The Star",
        icon: "🌕",
        message:
          "What you've been holding will release tonight. Let the Full Moon do the work.",
      },
      {
        name: "The Path",
        icon: "🌊",
        message:
          "Love doesn't need to be chased today. It's already in the room with you.",
      },
      {
        name: "The Mirror",
        icon: "✨",
        message:
          "Send the message. Make the plan. Tonight's energy supports bold moves in connection.",
      },
    ],
  },
  {
    label: "🌑 New Moon Monday",
    userName: "Arjun",
    vaara: "Monday",
    tithi: 30,
    tithiName: "Amavasya",
    nakshatra: "Ashlesha",
    isPurnima: false,
    isAmavasya: true,
    isChaturdashi: false,
    isNakshatraBirthday: false,
    isTithiBirthday: false,
    isVaaraBirthday: false,
    starsAlign: false,
    isEclipse: false,
    paksha: "Krishna",
    timeOfDay: "morning",
    scores: {
      love: 38,
      career: 42,
      health: 55,
      money: 35,
      social: 28,
      family: 44,
    },
    streak: 7,
    graceDay: true,
    vibeText:
      "New Moon on Ashlesha nakshatra invites you to turn inward. This is a potent day for release and intention-setting, not action. Let the old chapter close quietly before writing the new one.",
    doTips: [
      {
        text: "Set a powerful new intention during this New Moon — write it down",
        tags: ["New Moon"],
      },
      {
        text: "Do a breathing or meditation session today — even 10 minutes",
        tags: ["New Moon", "Health ↑"],
      },
      {
        text: "Write down three things you're grateful for this morning",
        tags: ["Monday", "Waning Moon"],
      },
    ],
    avoidTips: [
      {
        text: "Avoid large social gatherings that drain rather than energize you",
        tags: ["Social ↓", "New Moon"],
      },
      {
        text: "Don't make financial decisions based on pressure or urgency",
        tags: ["Money ↓", "New Moon"],
      },
      {
        text: "Avoid starting anything new today — the waning moon favours completion",
        tags: ["Waning Moon"],
      },
    ],
    badges: [
      {
        icon: "🌑",
        name: "New Moon Keeper",
        count: 7,
        tier: "gold",
        id: "new_moon_keeper",
      },
      {
        icon: "🔥🔥",
        name: "First Week",
        count: null,
        tier: "standard",
        id: "streak_7",
      },
      {
        icon: "🌱",
        name: "First Steps",
        count: null,
        tier: "standard",
        id: "loyalty_3d",
      },
    ],
    tomorrowKey: "high_energy",
    tomorrowTop: "Career",
    tomorrowLabel: "High Energy",
    connectOnboardingDone: false,
    oracleCards: [
      {
        name: "The Star",
        icon: "🌑",
        message:
          "This marks the end of a cycle. What you release now makes room for what's next.",
      },
      {
        name: "The Path",
        icon: "🌊",
        message:
          "Turn inward today. The answers you're looking for don't live outside right now.",
      },
      {
        name: "The Mirror",
        icon: "🌱",
        message:
          "Every New Moon is an invitation to begin. What one small thing do you want to grow?",
      },
    ],
  },
  {
    label: "⭐ Your Star Day",
    userName: "Maya",
    vaara: "Wednesday",
    tithi: 9,
    tithiName: "Navami",
    nakshatra: "Pushya",
    isPurnima: false,
    isAmavasya: false,
    isChaturdashi: false,
    isNakshatraBirthday: true,
    isTithiBirthday: false,
    isVaaraBirthday: false,
    starsAlign: false,
    isEclipse: false,
    paksha: "Shukla",
    timeOfDay: "afternoon",
    scores: {
      love: 84,
      career: 88,
      health: 76,
      money: 80,
      social: 92,
      family: 78,
    },
    streak: 29,
    graceDay: false,
    vibeText:
      "The Moon has returned to Pushya — your birth nakshatra. This is your personal cosmic peak day. The alignment between your birth sky and today's sky activates a natural clarity and magnetism that few days can match.",
    doTips: [
      {
        text: "Celebrate your Star Day — do something meaningful for yourself",
        tags: ["Star Day", "Nakshatra"],
      },
      {
        text: "Schedule the meeting or conversation you've been postponing",
        tags: ["Career ↑", "Wednesday"],
      },
      {
        text: "Reach out to someone you've been meaning to reconnect with",
        tags: ["Social ↑", "Love ↑"],
      },
    ],
    avoidTips: [
      {
        text: "Don't second-guess decisions you've already made well",
        tags: ["Wednesday"],
      },
      {
        text: "Avoid overthinking future plans — presence beats planning today",
        tags: ["Wednesday"],
      },
      {
        text: "Don't skip a planned commitment without notice",
        tags: ["Career ↑"],
      },
    ],
    badges: [
      {
        icon: "⭐",
        name: "Star Day",
        count: 12,
        tier: "crown",
        id: "star_day",
      },
      {
        icon: "🌕",
        name: "Full Cycle",
        count: null,
        tier: "standard",
        id: "streak_29",
      },
      {
        icon: "✨",
        name: "Three Moons",
        count: null,
        tier: "standard",
        id: "streak_90",
      },
    ],
    tomorrowKey: "venus_day",
    tomorrowTop: "Love",
    tomorrowLabel: "High Energy",
    connectOnboardingDone: true,
    matches: [
      {
        name: "Jordan",
        avatar: "⭐",
        nakshatra: "Pushya",
        score: 88,
        insight:
          "Same birth nakshatra energy today — you'll understand each other without many words.",
      },
      {
        name: "River",
        avatar: "💛",
        nakshatra: "Rohini",
        score: 74,
        insight:
          "Their Love is high and your Social peaks today — strong first-conversation energy.",
      },
    ],
    oracleCards: [
      {
        name: "The Star",
        icon: "⭐",
        message:
          "Your birth sky is speaking today. Trust the clarity that comes without effort.",
      },
      {
        name: "The Path",
        icon: "🌟",
        message:
          "This level of alignment is rare. Use it for something you'd normally hesitate on.",
      },
      {
        name: "The Mirror",
        icon: "🌙",
        message:
          "Not every day is this clear. Notice what you know with certainty right now.",
      },
    ],
  },
  {
    label: "🔥 Mars Tuesday",
    userName: "Lena",
    vaara: "Tuesday",
    tithi: 3,
    tithiName: "Tritiya",
    nakshatra: "Ashwini",
    isPurnima: false,
    isAmavasya: false,
    isChaturdashi: false,
    isNakshatraBirthday: false,
    isTithiBirthday: false,
    isVaaraBirthday: false,
    starsAlign: false,
    isEclipse: false,
    paksha: "Shukla",
    timeOfDay: "morning",
    scores: {
      love: 44,
      career: 86,
      health: 90,
      money: 58,
      social: 52,
      family: 40,
    },
    streak: 5,
    graceDay: true,
    vibeText:
      "Mars and Ashwini nakshatra combine to give you an unusual burst of physical and mental stamina this Tuesday. The first two hours of the day are your most powerful window — use them on the hardest thing on your list.",
    doTips: [
      {
        text: "Start the day with your most important task — energy is with you",
        tags: ["Career ↑", "Tuesday"],
      },
      {
        text: "Commit to one physical challenge for the next 30 days — start today",
        tags: ["Health ↑", "Ashwini"],
      },
      {
        text: "Get outside for at least 30 minutes — sun energy is high",
        tags: ["Health ↑", "Tuesday"],
      },
    ],
    avoidTips: [
      {
        text: "Avoid aggressive negotiations in love — conditions don't favour you",
        tags: ["Love ↓", "Tuesday"],
      },
      {
        text: "Don't force social plans on yourself — rest is more valuable tonight",
        tags: ["Tuesday"],
      },
      {
        text: "Skip the confrontation — it's not the right time or place",
        tags: ["Love ↓"],
      },
    ],
    badges: [
      {
        icon: "🔥",
        name: "First Spark",
        count: null,
        tier: "standard",
        id: "streak_3",
      },
      {
        icon: "🌱",
        name: "First Steps",
        count: null,
        tier: "standard",
        id: "loyalty_3d",
      },
    ],
    tomorrowKey: "jupiter_day",
    tomorrowTop: "Money",
    tomorrowLabel: "High Energy",
    connectOnboardingDone: false,
    oracleCards: [
      {
        name: "The Star",
        icon: "🔥",
        message:
          "This burst of energy won't last. Use it before noon on the thing that matters most.",
      },
      {
        name: "The Path",
        icon: "⚡",
        message:
          "Mars days reward action over planning. Stop preparing. Start.",
      },
      {
        name: "The Mirror",
        icon: "🌿",
        message:
          "Your body knows the right move before your mind does. Trust the first instinct.",
      },
    ],
  },
  {
    label: "🌟 Rare Alignment",
    userName: "Dev",
    vaara: "Thursday",
    tithi: 13,
    tithiName: "Trayodashi",
    nakshatra: "Rohini",
    isPurnima: false,
    isAmavasya: false,
    isChaturdashi: false,
    isNakshatraBirthday: true,
    isTithiBirthday: true,
    isVaaraBirthday: true,
    starsAlign: true,
    isEclipse: false,
    paksha: "Shukla",
    timeOfDay: "afternoon",
    scores: {
      love: 98,
      career: 96,
      health: 94,
      money: 97,
      social: 95,
      family: 98,
    },
    streak: 365,
    graceDay: false,
    vibeText:
      "A rare triple alignment — your birth nakshatra, lunar day, and weekday all match today's sky simultaneously. This configuration appears only a handful of times in a lifetime. Every category is amplified. Move boldly.",
    doTips: [
      {
        text: "Share this rare alignment with someone close — it won't happen again for months",
        tags: ["Rare Alignment", "Love ↑"],
      },
      {
        text: "Use this rare alignment day for the decision you've been putting off",
        tags: ["Rare Alignment", "Career ↑"],
      },
      {
        text: "Apply for the opportunity you've been researching",
        tags: ["Career ↑", "Money ↑"],
      },
    ],
    avoidTips: [
      {
        text: "Don't suppress a creative idea because it feels too bold — note it down",
        tags: ["Rare Alignment"],
      },
      {
        text: "Avoid the temptation to take on more than you can finish",
        tags: ["Career ↑"],
      },
      {
        text: "Don't make your problems someone else's emergency",
        tags: ["Thursday"],
      },
    ],
    badges: [
      {
        icon: "🌟",
        name: "Rare Alignment",
        count: 2,
        tier: "silver",
        id: "rare_alignment",
      },
      {
        icon: "🏆",
        name: "Year of Stars",
        count: null,
        tier: "crown",
        id: "streak_365",
      },
      {
        icon: "🌌",
        name: "One Full Year",
        count: null,
        tier: "standard",
        id: "loyalty_365d",
      },
    ],
    tomorrowKey: "purnima",
    tomorrowTop: "Love",
    tomorrowLabel: "High Energy",
    connectOnboardingDone: true,
    matches: [
      {
        name: "Aria",
        avatar: "🌟",
        nakshatra: "Rohini",
        score: 96,
        insight:
          "Both at peak energy today — one of the best compatibility windows of the month.",
      },
      {
        name: "Blake",
        avatar: "💫",
        nakshatra: "Pushya",
        score: 89,
        insight:
          "Their Love aligns perfectly with yours today. Don't let this window close.",
      },
      {
        name: "Cyan",
        avatar: "✨",
        nakshatra: "Chitra",
        score: 78,
        insight:
          "High mutual career energy — expect interesting, fast conversation today.",
      },
    ],
    oracleCards: [
      {
        name: "The Star",
        icon: "🌟",
        message:
          "This configuration appears only a few times in a lifetime. Whatever you're holding back — release it today.",
      },
      {
        name: "The Path",
        icon: "🏆",
        message:
          "Rare days reveal rare truths. Pay attention to what feels obvious right now.",
      },
      {
        name: "The Mirror",
        icon: "🌌",
        message:
          "The universe doesn't give you a perfect alignment to do nothing with it. Move.",
      },
    ],
  },
  {
    label: "🌙 Saturn Saturday",
    userName: "Kate",
    vaara: "Saturday",
    tithi: 11,
    tithiName: "Ekadashi",
    nakshatra: "Uttara Phalguni",
    isPurnima: false,
    isAmavasya: false,
    isChaturdashi: false,
    isNakshatraBirthday: false,
    isTithiBirthday: false,
    isVaaraBirthday: false,
    starsAlign: false,
    isEclipse: false,
    paksha: "Shukla",
    timeOfDay: "evening",
    scores: {
      love: 34,
      career: 78,
      health: 50,
      money: 44,
      social: 30,
      family: 38,
    },
    streak: 90,
    graceDay: false,
    vibeText:
      "Saturn's discipline defines this Saturday. Career and structured effort are your allies today, while social and love energy stay quiet. An excellent day to finish something, release something, and prepare for the week.",
    doTips: [
      {
        text: "Tackle the task you've been avoiding most — today you have the energy",
        tags: ["Career ↑", "Saturday"],
      },
      {
        text: "Cancel subscriptions you haven't used in 30 days",
        tags: ["Saturday", "Career ↑"],
      },
      {
        text: "Clean and organize your workspace or home environment",
        tags: ["Saturday"],
      },
    ],
    avoidTips: [
      {
        text: "Avoid dramatic conversations late at night — mornings are always clearer",
        tags: ["Love ↓", "Saturday"],
      },
      {
        text: "Don't force social plans on yourself — rest is more valuable tonight",
        tags: ["Social ↓"],
      },
      {
        text: "Avoid comparing your progress to others — your path moves at its own speed",
        tags: ["Saturday"],
      },
    ],
    badges: [
      {
        icon: "✨",
        name: "Three Moons",
        count: null,
        tier: "standard",
        id: "streak_90",
      },
      {
        icon: "🌲",
        name: "Three Months",
        count: null,
        tier: "standard",
        id: "loyalty_90d",
      },
      {
        icon: "🔥🔥",
        name: "First Week",
        count: null,
        tier: "standard",
        id: "streak_7",
      },
    ],
    tomorrowKey: "moon_day",
    tomorrowTop: "Family",
    tomorrowLabel: "Moderate",
    connectOnboardingDone: true,
    matches: [
      {
        name: "Quinn",
        avatar: "🌙",
        nakshatra: "Hasta",
        score: 55,
        insight:
          "Both in a quiet energy today. Good for depth and honesty, not lightness.",
      },
    ],
    oracleCards: [
      {
        name: "The Star",
        icon: "🔑",
        message:
          "Saturdays show you what's real. One honest look at something you've been avoiding.",
      },
      {
        name: "The Path",
        icon: "📋",
        message:
          "Discipline is its own kind of freedom. Finish one thing today — just one.",
      },
      {
        name: "The Mirror",
        icon: "🌘",
        message:
          "Not every day is meant to be peak. This one is for building, not shining.",
      },
    ],
  },
  {
    label: "☀️ Sun Sunday",
    userName: "Leo",
    vaara: "Sunday",
    tithi: 6,
    tithiName: "Shashthi",
    nakshatra: "Hasta",
    isPurnima: false,
    isAmavasya: false,
    isChaturdashi: false,
    isNakshatraBirthday: false,
    isTithiBirthday: false,
    isVaaraBirthday: false,
    starsAlign: false,
    isEclipse: false,
    paksha: "Shukla",
    timeOfDay: "morning",
    scores: {
      love: 62,
      career: 58,
      health: 88,
      money: 64,
      social: 70,
      family: 60,
    },
    streak: 21,
    graceDay: false,
    vibeText:
      "The Sun shines clearly through Hasta nakshatra — a skilled, practical energy. Your health and vitality peak this morning. Use the energy for physical activity, self-care, and preparing your intentions for the week.",
    doTips: [
      {
        text: "Get outside for at least 30 minutes — sun energy is high",
        tags: ["Health ↑", "Sunday"],
      },
      {
        text: "Start a new physical habit today — momentum is on your side",
        tags: ["Health ↑", "Shukla"],
      },
      {
        text: "Write down three things you're grateful for this morning",
        tags: ["Sunday", "Hasta"],
      },
    ],
    avoidTips: [
      {
        text: "Don't skip your meals to power through work",
        tags: ["Health ↑"],
      },
      {
        text: "Avoid mindless scrolling when you should be resting",
        tags: ["Sunday"],
      },
      {
        text: "Skip the self-criticism spiral — it changes nothing and drains everything",
        tags: ["Sunday"],
      },
    ],
    badges: [
      {
        icon: "☀️",
        name: "Solstice Keeper",
        count: 2,
        tier: "silver",
        id: "solar_event",
      },
      {
        icon: "🔥🔥",
        name: "First Week",
        count: null,
        tier: "standard",
        id: "streak_7",
      },
      {
        icon: "🌿",
        name: "One Week",
        count: null,
        tier: "standard",
        id: "loyalty_7d",
      },
    ],
    tomorrowKey: "default",
    tomorrowTop: "Career",
    tomorrowLabel: "High Energy",
    connectOnboardingDone: false,
    oracleCards: [
      {
        name: "The Star",
        icon: "☀️",
        message:
          "Sundays in Hasta nakshatra are for craft. Make something today — anything.",
      },
      {
        name: "The Path",
        icon: "🌿",
        message:
          "Physical energy peaks this morning. Don't waste it sitting still.",
      },
      {
        name: "The Mirror",
        icon: "🌅",
        message:
          "The week begins again tomorrow. How do you want to feel at the start of it?",
      },
    ],
  },
  {
    label: "🧠 Mercury Wednesday",
    userName: "Priya",
    vaara: "Wednesday",
    tithi: 7,
    tithiName: "Saptami",
    nakshatra: "Chitra",
    isPurnima: false,
    isAmavasya: false,
    isChaturdashi: false,
    isNakshatraBirthday: false,
    isTithiBirthday: false,
    isVaaraBirthday: false,
    starsAlign: false,
    isEclipse: false,
    paksha: "Shukla",
    timeOfDay: "afternoon",
    scores: {
      love: 66,
      career: 90,
      health: 60,
      money: 72,
      social: 86,
      family: 58,
    },
    streak: 12,
    graceDay: false,
    vibeText:
      "Mercury sharpens everything on Chitra nakshatra — precision, beauty, and sharp communication are your gifts today. Your career and social energy peak simultaneously. A well-crafted message today could open something significant.",
    doTips: [
      {
        text: "Pitch your idea today — your words carry extra clarity",
        tags: ["Career ↑", "Social ↑"],
      },
      {
        text: "Block 2 hours of deep, uninterrupted work this morning",
        tags: ["Career ↑", "Wednesday"],
      },
      {
        text: "Reply to messages you've been sitting on",
        tags: ["Social ↑", "Chitra"],
      },
    ],
    avoidTips: [
      {
        text: "Don't send that critical email before rereading it twice",
        tags: ["Wednesday"],
      },
      {
        text: "Avoid multitasking — scattered focus will cost you more than it saves",
        tags: ["Career ↑"],
      },
      {
        text: "Don't suppress a creative idea because it feels too bold",
        tags: ["Chitra", "Wednesday"],
      },
    ],
    badges: [
      {
        icon: "💫",
        name: "First Connection",
        count: null,
        tier: "standard",
        id: "first_match",
      },
      {
        icon: "📲",
        name: "Sky Sharer",
        count: 4,
        tier: "standard",
        id: "shared_today",
      },
      {
        icon: "🌙",
        name: "Moonwalker",
        count: null,
        tier: "standard",
        id: "streak_14",
      },
    ],
    tomorrowKey: "jupiter_day",
    tomorrowTop: "Money",
    tomorrowLabel: "High Energy",
    connectOnboardingDone: true,
    matches: [
      {
        name: "Alex",
        avatar: "🧠",
        nakshatra: "Chitra",
        score: 84,
        insight:
          "Both Mercury-strong today — expect witty, fast-moving conversation.",
      },
      {
        name: "Jamie",
        avatar: "💬",
        nakshatra: "Mrigashira",
        score: 70,
        insight:
          "Their Social is high and you're sharp today — a good match window.",
      },
    ],
    oracleCards: [
      {
        name: "The Star",
        icon: "💬",
        message:
          "The right words are available to you today. Use them on something that matters.",
      },
      {
        name: "The Path",
        icon: "🧠",
        message:
          "Mercury Wednesdays are for strategy. Lay out the plan you've been carrying in your head.",
      },
      {
        name: "The Mirror",
        icon: "✦",
        message:
          "One well-placed message today could open a door that stays open for months.",
      },
    ],
  },
  {
    label: "💛 Venus Friday",
    userName: "Nina",
    vaara: "Friday",
    tithi: 5,
    tithiName: "Panchami",
    nakshatra: "Rohini",
    isPurnima: false,
    isAmavasya: false,
    isChaturdashi: false,
    isNakshatraBirthday: false,
    isTithiBirthday: false,
    isVaaraBirthday: false,
    starsAlign: false,
    isEclipse: false,
    paksha: "Shukla",
    timeOfDay: "evening",
    scores: {
      love: 95,
      career: 60,
      health: 72,
      money: 74,
      social: 88,
      family: 70,
    },
    streak: 33,
    graceDay: false,
    vibeText:
      "Rohini nakshatra is the most romantic star in the Vedic sky — and today it falls on Venus's own day. Love and beauty are supercharged. This is not a day to work late. Make a plan for the evening.",
    doTips: [
      {
        text: "Plan a date or quality time with your partner today",
        tags: ["Love ↑", "Friday"],
      },
      {
        text: "Treat yourself to something beautiful today",
        tags: ["Friday", "Rohini"],
      },
      {
        text: "Start the creative project you've been sketching in your head",
        tags: ["Love ↑", "Social ↑"],
      },
    ],
    avoidTips: [
      {
        text: "Don't skip family commitments for social plans tonight",
        tags: ["Friday", "Love ↑"],
      },
      {
        text: "Avoid bringing up old arguments — energy today amplifies conflict",
        tags: ["Love ↑", "Friday"],
      },
      {
        text: "Don't make assumptions about others' feelings — ask instead",
        tags: ["Love ↑"],
      },
    ],
    badges: [
      {
        icon: "💛",
        name: "Venus Evening",
        count: 5,
        tier: "gold",
        id: "full_moon_witness",
      },
      {
        icon: "💫💫",
        name: "Rising Star",
        count: null,
        tier: "standard",
        id: "five_matches",
      },
      {
        icon: "🌕",
        name: "Full Cycle",
        count: null,
        tier: "standard",
        id: "streak_29",
      },
    ],
    tomorrowKey: "default",
    tomorrowTop: "Love",
    tomorrowLabel: "Moderate",
    connectOnboardingDone: true,
    matches: [
      {
        name: "Theo",
        avatar: "💛",
        nakshatra: "Rohini",
        score: 95,
        insight:
          "Rohini on Venus day is the most romantic window of the month. Don't let it pass.",
      },
      {
        name: "Sasha",
        avatar: "🌹",
        nakshatra: "Anuradha",
        score: 80,
        insight:
          "Both in Love ↑ — strong mutual pull today. Reach out before the energy shifts.",
      },
    ],
    oracleCards: [
      {
        name: "The Star",
        icon: "💛",
        message:
          "This is the best day this week to let yourself be seen. Show up fully.",
      },
      {
        name: "The Path",
        icon: "🌹",
        message:
          "Venus evenings carry a softness that's rare. Let yourself feel it tonight.",
      },
      {
        name: "The Mirror",
        icon: "✨",
        message:
          "The person you've been thinking about — they're worth the reach. Tonight is right.",
      },
    ],
  },
  {
    label: "🌒 Eclipse Day",
    userName: "Ravi",
    vaara: "Tuesday",
    tithi: 14,
    tithiName: "Chaturdashi",
    nakshatra: "Jyeshtha",
    isPurnima: false,
    isAmavasya: false,
    isChaturdashi: true,
    isNakshatraBirthday: false,
    isTithiBirthday: false,
    isVaaraBirthday: false,
    starsAlign: false,
    isEclipse: true,
    paksha: "Krishna",
    timeOfDay: "afternoon",
    scores: {
      love: 30,
      career: 40,
      health: 35,
      money: 28,
      social: 32,
      family: 38,
    },
    streak: 3,
    graceDay: true,
    vibeText:
      "A lunar eclipse on Chaturdashi — Jyeshtha nakshatra intensifies everything it touches. This is not a day for action; it is a day for observation and quiet. The disruption you feel today is clearing space for what comes next.",
    doTips: [
      {
        text: "Do a breathing or meditation session today — even 10 minutes",
        tags: ["Eclipse", "Waning Moon"],
      },
      {
        text: "Journal about your emotional journey on this day",
        tags: ["Eclipse", "Chaturdashi"],
      },
      {
        text: "Practice saying no to one thing that drains your energy",
        tags: ["Waning Moon"],
      },
    ],
    avoidTips: [
      {
        text: "Avoid all major decisions today — tomorrow's energy is significantly clearer",
        tags: ["Eclipse", "Chaturdashi"],
      },
      {
        text: "Don't confront difficult people today — wait for the moon to shift",
        tags: ["Eclipse", "Waning Moon"],
      },
      {
        text: "Skip risky or extreme activities today — this is a high-tension tithi",
        tags: ["Chaturdashi"],
      },
    ],
    badges: [
      {
        icon: "🌒",
        name: "Eclipse Chaser",
        count: 1,
        tier: "silver",
        id: "eclipse_chaser",
      },
      {
        icon: "🔥",
        name: "First Spark",
        count: null,
        tier: "standard",
        id: "streak_3",
      },
    ],
    tomorrowKey: "amavasya",
    tomorrowTop: "Health",
    tomorrowLabel: "Low Energy",
    connectOnboardingDone: true,
    matches: [
      {
        name: "Morgan",
        avatar: "🌒",
        nakshatra: "Anuradha",
        score: 42,
        insight:
          "Eclipse energy is disruptive for both — don't read too much into today's dynamic.",
      },
    ],
    oracleCards: [
      {
        name: "The Star",
        icon: "🌒",
        message: "Eclipse days reveal what's hidden. Watch, don't act.",
      },
      {
        name: "The Path",
        icon: "🌑",
        message:
          "What's disrupted today is being cleared. Trust the disruption.",
      },
      {
        name: "The Mirror",
        icon: "🔮",
        message:
          "Sometimes clarity comes through confusion. Sit with it — it won't last.",
      },
    ],
  },
];

// ── State ────────────────────────────────────────────────────────────────────

const scenarioIdx = ref(0);
const expandedCat = ref(null);
const showModal = ref(false);
const modalCategory = ref("Cosmic Events");
const oraclePickedIdx = ref(null);
const matchExpanded = ref(null);
const expandedWindow = ref(null);
const showStreakModal = ref(false);
const nakshatraExpanded = ref(false);
const dashaExpanded = ref(false);
const bodyMapExpanded = ref(false);

const s = computed(() => SCENARIOS[scenarioIdx.value]);
const bgKey = computed(() => resolveBackground(s.value));
const headline = computed(() => resolveHeadline(s.value));
const bg = computed(() => BG[bgKey.value] || BG.clear_sky);
const tint = computed(() => TIME_TINT[s.value.timeOfDay]);

const avgScore = computed(() =>
  Math.round(Object.values(s.value.scores).reduce((a, b) => a + b, 0) / 6),
);

// ── Day Synthesis ─────────────────────────────────────────────────────────────

const SPECIAL_DAY_SENTENCES = {
  starsAlign: {
    icon: "🌟",
    sentence:
      "A rare triple alignment today — your nakshatra, lunar day, and weekday all point the same direction. Move boldly.",
  },
  isPurnima: {
    icon: "🌕",
    sentence:
      "Full Moon day — emotions are amplified and the sky is at its brightest. Set an intention before midnight.",
  },
  isAmavasya: {
    icon: "🌑",
    sentence:
      "New Moon day — the sky is dark and the energy turns inward. Write down what you want to begin.",
  },
  isNakshatraBirthday: {
    icon: "⭐",
    sentence:
      "Your Star Day — the Moon has returned to your birth nakshatra. A personal clarity peak. Use it.",
  },
  isTithiBirthday: {
    icon: "🎂",
    sentence:
      "Your Lunar Birthday — the Moon returns to the same phase it was in when you were born.",
  },
  isEclipse: {
    icon: "🌒",
    sentence:
      "Eclipse day — observe rather than act. Disruptions today are clearing space for what comes next.",
  },
};

const VAARA_SENTENCES = {
  Sunday: {
    high: "Sun energy peaks today — great for physical activity, self-care, and leading from the front.",
    moderate: "A balanced Sunday — good for presence, not pressure.",
    low: "The Sun is gentle today. Rest and let energy build naturally.",
  },
  Monday: {
    high: "Moon energy is strong — let feeling lead. Your intuition is sharper than usual.",
    moderate:
      "A reflective Monday. Set your emotional tone before the week sets it for you.",
    low: "Low Moon energy. Ease in gently — avoid pushing early.",
  },
  Tuesday: {
    high: "Mars gives you a strong burst today. Tackle the hardest item on your list before noon.",
    moderate: "Some drive available — good for focused, physical effort.",
    low: "Mars is subdued. Don't force intensity — pace yourself.",
  },
  Wednesday: {
    high: "Mercury sharpens your mind. Write, plan, communicate — this is your best day for it.",
    moderate:
      "A decent thinking day. Handle correspondence and planning before the afternoon dip.",
    low: "Mercury is quiet. Re-read before sending and avoid negotiations.",
  },
  Thursday: {
    high: "Jupiter expands today. Morning decisions carry long-term weight — think big and commit.",
    moderate:
      "Jupiter's optimism is mild. Good for practical planning and steady growth.",
    low: "Jupiter is restrained. Hold off on large commitments — better timing comes.",
  },
  Friday: {
    high: "Venus day is at its peak. The best day of the week for love, beauty, and connection.",
    moderate:
      "A pleasant Friday. Light self-care and social ease are available.",
    low: "Venus is subtle today. Quiet, gentle enjoyment over social effort.",
  },
  Saturday: {
    high: "Saturn rewards discipline today. Start with your hardest task — you have the will.",
    moderate: "A capable Saturday. Good for deep work and deferred admin.",
    low: "Saturn's heaviness is real. One small, useful task is enough.",
  },
};

const synthesis = computed(() => {
  const sc = s.value;
  const avg = avgScore.value;
  for (const [key, val] of Object.entries(SPECIAL_DAY_SENTENCES)) {
    if (sc[key]) return val;
  }
  const band = avg >= 71 ? "high" : avg >= 41 ? "moderate" : "low";
  const day = VAARA_SENTENCES[sc.vaara] || VAARA_SENTENCES.Sunday;
  let icon = "☀️";
  if (avg >= 71) icon = "⚡";
  else if (avg < 41) icon = "🌙";
  return { icon, sentence: day[band], moonTransit: sc.moonTransit || null };
});

// ── Energy 3 categories ───────────────────────────────────────────────────────

const ENERGY_CATS = ["love", "career", "health", "money", "social", "family"];
const VAARA_PLANETS = {
  Sunday: "Sun",
  Monday: "Moon",
  Tuesday: "Mars",
  Wednesday: "Mercury",
  Thursday: "Jupiter",
  Friday: "Venus",
  Saturday: "Saturn",
};

const GRAHA = {
  Sun: { sk: "Surya", essence: "vitality and prana" },
  Moon: { sk: "Chandra", essence: "mind and receptivity" },
  Mars: { sk: "Mangala", essence: "courage and action" },
  Mercury: { sk: "Budha", essence: "intellect and commerce" },
  Jupiter: { sk: "Guru", essence: "wisdom and prosperity" },
  Venus: { sk: "Shukra", essence: "love and harmony" },
  Saturn: { sk: "Shani", essence: "discipline and karma" },
};

const CATEGORY_VEDIC = {
  health: {
    domain: "physical vitality and ojas",
    frame:
      "Surya governs the 1st house — the body, prana, and daily strength",
  },
  relations: {
    domain: "prema, sangha, and kutumba",
    frame:
      "Shukra (7th), Budha (11th), and Chandra (4th) weave love, friendship, and family",
  },
  affairs: {
    domain: "karma and artha",
    frame: "Shani (10th) and Guru (2nd) shape profession, duty, and wealth",
  },
};

const TITHI_SHUKLA = {
  1: [0, 10, 0, 5, 0, 0],
  2: [5, 0, 0, 0, 10, 10],
  3: [0, 15, 10, 0, 0, 0],
  4: [0, -10, 0, -10, 0, 0],
  5: [0, 15, 0, 10, 0, 0],
  6: [5, 0, 0, 15, 0, 0],
  7: [10, 0, 0, 0, 15, 0],
  8: [-5, 5, 10, 0, 0, 0],
  9: [0, -10, 0, 0, 0, 0],
  10: [0, 0, 0, 15, 0, 10],
  11: [0, 10, 15, 0, 0, 0],
  12: [10, 0, 0, 0, 5, 0],
  13: [0, 0, 5, 0, 0, 10],
  14: [-5, -5, -5, -5, -5, -5],
  15: [15, 15, 15, 15, 15, 15],
};

const VAARA_MOD = {
  Sunday: [0, 5, 10, 0, 0, 0],
  Monday: [10, 0, 0, 0, 5, 15],
  Tuesday: [-5, 10, 15, 0, 0, 0],
  Wednesday: [0, 15, 0, 5, 10, 0],
  Thursday: [0, 10, 0, 15, 0, 5],
  Friday: [20, 0, 0, 5, 15, 0],
  Saturday: [-10, 5, 0, -5, 0, 0],
};

const NAKSHATRA_MOD = {
  Ashwini: [0, 0, 15, 0, 0, 0],
  Bharani: [10, 10, 0, 0, 0, 0],
  Krittika: [0, 15, 0, 0, -5, 0],
  Rohini: [15, 0, 0, 10, 0, 0],
  Mrigashira: [0, 5, 0, 0, 10, 0],
  Ardra: [0, -5, -5, 0, 5, 0],
  Punarvasu: [0, 0, 10, 0, 0, 15],
  Pushya: [15, 0, 0, 0, 10, 15],
  Ashlesha: [-5, 10, 0, 0, 0, 0],
  Magha: [0, 15, 0, 0, 5, 0],
  "Purva Phalguni": [15, 0, 0, 5, 15, 0],
  "Uttara Phalguni": [0, 15, 0, 0, 0, 10],
  Hasta: [0, 10, 0, 15, 0, 0],
  Chitra: [10, 15, 0, 0, 10, 0],
  Swati: [0, 0, 0, 15, 10, 0],
  Vishakha: [10, 15, 0, 0, 0, 0],
  Anuradha: [15, 0, 0, 0, 15, 0],
  Jyeshtha: [0, 10, 0, 0, -5, 0],
  Mula: [0, -5, -5, 0, 0, 0],
  "Purva Ashadha": [5, 10, 0, 0, 0, 0],
  "Uttara Ashadha": [0, 15, 10, 0, 0, 0],
  Shravana: [0, 0, 0, 0, 15, 10],
  Dhanishtha: [0, 10, 0, 15, 0, 0],
  Shatabhishak: [0, 5, 15, 0, 0, 0],
  "Purva Bhadrapada": [-5, 5, 0, 0, 0, 0],
  "Uttara Bhadrapada": [0, 0, 10, 0, 0, 15],
  Revati: [15, 0, 0, 0, 15, 0],
};

function catIdx(cat) {
  return ENERGY_CATS.indexOf(cat);
}

function getTithiModifier(tithi, paksha, idx) {
  if (tithi === 30) return [-5, 0, 5, 0, -15, 0][idx];
  const shuklaTithi = paksha === "Shukla" ? tithi : tithi - 15;
  const row = TITHI_SHUKLA[shuklaTithi];
  if (!row) return 0;
  let mod = row[idx];
  if (paksha === "Krishna" && mod > 0) mod = Math.max(0, mod - 5);
  return mod;
}

function getBirthdayBonus(sc, idx) {
  if (sc.starsAlign) return 20;
  let bonus = 0;
  if (sc.isNakshatraBirthday) bonus += 10;
  if (sc.isTithiBirthday) {
    if (idx === 0) bonus += 15;
    if (idx === 5) bonus += 10;
  }
  if (sc.isVaaraBirthday) {
    if (idx === 1) bonus += 10;
    if (idx === 4) bonus += 10;
  }
  return bonus;
}

function getCategoryBreakdown(sc, cat) {
  const idx = catIdx(cat);
  const tithi = getTithiModifier(sc.tithi, sc.paksha, idx);
  const vaara = VAARA_MOD[sc.vaara]?.[idx] ?? 0;
  const nakshatra = NAKSHATRA_MOD[sc.nakshatra]?.[idx] ?? 0;
  const birthday = getBirthdayBonus(sc, idx);
  const raw = 50 + tithi + vaara + nakshatra + birthday;
  return {
    base: 50,
    tithi,
    vaara,
    nakshatra,
    birthday,
    final: Math.min(100, Math.max(0, raw)),
  };
}

function describeTithiInfluence(sc, val, domain) {
  const paksha =
    sc.paksha === "Shukla" ? "Shukla paksha (waxing Moon)" : "Krishna paksha (waning Moon)";
  if (sc.isPurnima && val > 0) {
    return `Purnima tithi — Chandra at full brilliance in ${paksha} — floods the chart with lunar shakti for ${domain}.`;
  }
  if (sc.isAmavasya) {
    return `Amavasya tithi stills outward ${domain}; the dark Moon favours inner work over worldly push.`;
  }
  if (val > 0) {
    return `${sc.tithiName} tithi in ${paksha} supports ${domain} in today's panchang.`;
  }
  if (val < 0) {
    return `${sc.tithiName} tithi in ${paksha} constricts ${domain} — a quieter lunar window for this area.`;
  }
  return null;
}

function describeVaaraInfluence(sc, val, domain) {
  const planet = VAARA_PLANETS[sc.vaara];
  const g = GRAHA[planet];
  if (!g) return null;
  if (val > 0) {
    return `${sc.vaara} vara, ruled by ${g.sk} (${planet}), blesses ${domain} through the weekday lord's ${g.essence}.`;
  }
  if (val < 0) {
    return `On ${sc.vaara} vara, ${g.sk}'s influence compresses ${domain} — pace yourself and avoid forcing outcomes.`;
  }
  return null;
}

function describeNakshatraInfluence(sc, val, domain) {
  const n = NAKSHATRA_DATA[sc.nakshatra];
  if (!n) return null;
  if (val > 0) {
    return `Chandra in ${sc.nakshatra} nakshatra — presided by ${n.devata}, ${n.guna} guna — nourishes ${domain}.`;
  }
  if (val < 0) {
    return `${sc.nakshatra} nakshatra (${n.devata}, ${n.guna} guna) restrains ${domain}; honour the Moon's slower rhythm here.`;
  }
  return null;
}

function describeBirthdayInfluence(sc, val, domain) {
  if (val <= 0) return null;
  if (sc.starsAlign) {
    return `A rare tri-fold yoga: janma nakshatra, janma tithi, and birth vara align — a personal muhurta that magnifies ${domain}.`;
  }
  if (sc.isNakshatraBirthday) {
    return `Janma nakshatra day — the Moon returns to your birth star, heightening ${domain} in the natal chart.`;
  }
  if (sc.isTithiBirthday) {
    return `Janma tithi returns today, activating Chandra-karma themes for ${domain}.`;
  }
  if (sc.isVaaraBirthday) {
    return `Your birth vara rules today — the weekday lord personally favours ${domain}.`;
  }
  return null;
}

function buildEnergyExplanation(categoryKey, label, bandLabel, sc, breakdown) {
  const vedic = CATEGORY_VEDIC[categoryKey];
  const domain = vedic.domain;

  const intro =
    bandLabel === "High"
      ? `${label} carries strong graha-shakti today. ${vedic.frame}.`
      : bandLabel === "Moderate"
        ? `${label} sits in a middling shakti today — neither fully blessed nor obstructed. ${vedic.frame}.`
        : `${label} is under planetary compression today. ${vedic.frame} — conserve rather than spend.`;

  const influences = [
    { weight: Math.abs(breakdown.birthday), text: describeBirthdayInfluence(sc, breakdown.birthday, domain) },
    { weight: Math.abs(breakdown.tithi), text: describeTithiInfluence(sc, breakdown.tithi, domain) },
    { weight: Math.abs(breakdown.vaara), text: describeVaaraInfluence(sc, breakdown.vaara, domain) },
    { weight: Math.abs(breakdown.nakshatra), text: describeNakshatraInfluence(sc, breakdown.nakshatra, domain) },
  ]
    .filter(i => i.text && i.weight > 0)
    .sort((a, b) => b.weight - a.weight);

  const body = influences
    .slice(0, 2)
    .map(i => i.text)
    .join(" ");

  if (!body) {
    return `${intro} The panchang is neutral for ${domain} — no single tithi, vara, or nakshatra dominates.`;
  }
  return `${intro} ${body}`;
}

const ENERGY3_PHRASES = {
  health: {
    high: "Your vitality is strong — a great day to move, exercise, or start a new health habit.",
    moderate: "Energy is balanced. Maintain routine and avoid overexertion.",
    low: "Your system is sensitive today. Rest, hydrate, move gently.",
  },
  relations: {
    high: "Connections are amplified — a small act of love lands with unexpected depth.",
    moderate:
      "Steady relational energy. Nurture what exists rather than starting new.",
    low: "Love and social energy are quiet. Give space and let things settle.",
  },
  affairs: {
    high: "Career and money energy are aligned — a good day to act on a decision you've been delaying.",
    moderate: "Solid working energy. Steady effort beats inspired leaps today.",
    low: "Keep communications extra clear. Avoid big professional or financial decisions.",
  },
};

const energy3 = computed(() => {
  const sc = s.value;
  const healthScore = sc.scores.health;
  const relScore = Math.round(
    (sc.scores.love + sc.scores.social + sc.scores.family) / 3,
  );
  const affairsScore = Math.round((sc.scores.career + sc.scores.money) / 2);

  function bandOf(score) {
    return score >= 71 ? "high" : score >= 41 ? "moderate" : "low";
  }
  function labelOf(score) {
    return score >= 71 ? "High" : score >= 41 ? "Moderate" : "Low";
  }

  const relDominant = ["love", "social", "family"].reduce(
    (best, key) => (sc.scores[key] > sc.scores[best] ? key : best),
    "love",
  );
  const affairsDominant =
    sc.scores.career >= sc.scores.money ? "career" : "money";

  const healthBreakdown = getCategoryBreakdown(sc, "health");
  const relBreakdown = getCategoryBreakdown(sc, relDominant);
  const affairsBreakdown = getCategoryBreakdown(sc, affairsDominant);

  return [
    {
      key: "health",
      label: "Health",
      icon: "🌿",
      score: healthScore,
      bandLabel: labelOf(healthScore),
      phrase: ENERGY3_PHRASES.health[bandOf(healthScore)],
      explanation: buildEnergyExplanation(
        "health",
        "Health",
        labelOf(healthScore),
        sc,
        healthBreakdown,
      ),
    },
    {
      key: "relations",
      label: "Relationships",
      icon: "💛",
      score: relScore,
      bandLabel: labelOf(relScore),
      phrase: ENERGY3_PHRASES.relations[bandOf(relScore)],
      explanation: buildEnergyExplanation(
        "relations",
        "Relationships",
        labelOf(relScore),
        sc,
        relBreakdown,
      ),
    },
    {
      key: "affairs",
      label: "Career & Money",
      icon: "⚡",
      score: affairsScore,
      bandLabel: labelOf(affairsScore),
      phrase: ENERGY3_PHRASES.affairs[bandOf(affairsScore)],
      explanation: buildEnergyExplanation(
        "affairs",
        "Career & Money",
        labelOf(affairsScore),
        sc,
        affairsBreakdown,
      ),
    },
  ];
});

// ── Nakshatra of the Day ──────────────────────────────────────────────────────

const nakshatraData = computed(
  () => NAKSHATRA_DATA[s.value.nakshatra] || NAKSHATRA_DATA["Pushya"],
);

// ── Dasha Snapshot ────────────────────────────────────────────────────────────

const dashaData = computed(
  () => DASHA_DEMO[s.value.userName] || DASHA_DEMO["Sofia"],
);

const socialProofText = computed(() => {
  const avg = avgScore.value;
  const band = avg >= 71 ? "high" : avg >= 41 ? "moderate" : "low";
  // Simulates a real cached count from DB — in production: SELECT COUNT(*) WHERE energy_band = band AND checked_in_today
  const counts = { high: 3247, moderate: 8812, low: 1534 };
  const n = counts[band].toLocaleString("en");
  const label = avg >= 71 ? "High Energy" : avg >= 41 ? "flowing" : "quiet";
  return `🌍 ${n} people are having a ${label} day today`;
});

const powerWindows = computed(
  () => POWER_WINDOWS[s.value.vaara] || POWER_WINDOWS.Sunday,
);

const bodyMapEntry = computed(() => {
  const found = BODY_MAP.find(e => e.nakshatra === s.value.nakshatra);
  const entry = found || BODY_MAP[7]; // default Pushya
  const n = NAKSHATRA_DATA[s.value.nakshatra] || NAKSHATRA_DATA.Pushya;
  const paksha =
    s.value.paksha === "Shukla"
      ? "Shukla paksha (waxing Moon)"
      : "Krishna paksha (waning Moon)";
  return {
    ...entry,
    devata: n.devata,
    guna: n.guna,
    symbol: n.symbol,
    vedicDetail: buildBodyMapVedicDetail(s.value, entry, n, paksha),
  };
});

function buildBodyMapVedicDetail(sc, entry, n, paksha) {
  const area = entry.area;
  return (
    `In the nakshatra–body correspondence (Kala Purusha), Chandra in ${sc.nakshatra} activates the ${area}. ` +
    `${sc.nakshatra} is ruled by ${n.devata}, carries ${n.guna} guna, and is symbolised by ${n.symbol} — ` +
    `during ${paksha}, somatic sensitivity gathers in this region rather than spreading evenly through the body. ` +
    `${n.extended.split(".")[0]}. ` +
    `Today's practical focus: ${entry.tip.charAt(0).toLowerCase()}${entry.tip.slice(1)}`
  );
}

const lunarPct = computed(() => Math.min((s.value.tithi / 29) * 100, 100));
const RING_C = 201.1;
const ringOffset = computed(() => RING_C * (1 - lunarPct.value / 100));
const ringColor = computed(() => {
  if (s.value.isPurnima) return "#c8d0ff";
  if (lunarPct.value > 70) return "rgba(220,228,255,0.9)";
  if (lunarPct.value > 40) return "rgba(180,190,255,0.8)";
  return "rgba(140,150,220,0.7)";
});

const last9 = computed(() =>
  Array.from({ length: 9 }, (_, i) => {
    const t = ((s.value.tithi - (8 - i) - 1 + 30) % 30) + 1;
    return getMoonIcon(t);
  }),
);

const greeting = computed(() => {
  if (s.value.timeOfDay === "morning") return "Good morning";
  if (s.value.timeOfDay === "afternoon") return "Good afternoon";
  return "Good evening";
});

const infoLine = computed(() => {
  const phase = moonPhaseLabel(s.value.tithi);
  const toFull = 15 - s.value.tithi;
  const toNew = 30 - s.value.tithi;
  let cd = "";
  if (toFull === 1) cd = " · Full Moon tomorrow 🌕";
  else if (toFull > 1 && toFull <= 3) cd = ` · Full Moon in ${toFull} days`;
  else if (!cd && toNew === 1) cd = " · New Moon tomorrow 🌑";
  else if (!cd && toNew > 1 && toNew <= 3) cd = ` · New Moon in ${toNew} days`;
  return `${s.value.vaara} · ${phase}${cd}`;
});

const yourDaySlots = computed(() => {
  const band =
    avgScore.value >= 71 ? "high" : avgScore.value >= 41 ? "moderate" : "low";
  const day = YOUR_DAY[s.value.vaara] || YOUR_DAY.Sunday;
  return [
    {
      slot: "Morning",
      icon: "🌅",
      time: "until 12:00",
      text: day.Morning[band],
      active: s.value.timeOfDay === "morning",
    },
    {
      slot: "Afternoon",
      icon: "☀️",
      time: "12:00 – 19:00",
      text: day.Afternoon[band],
      active: s.value.timeOfDay === "afternoon",
    },
    {
      slot: "Evening",
      icon: "🌆",
      time: "after 19:00",
      text: day.Evening[band],
      active: s.value.timeOfDay === "evening",
    },
  ];
});

const todayDate = computed(() =>
  new Date().toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }),
);

const streakNextGoal = computed(
  () => STREAK_MILESTONES.find(m => m > s.value.streak) ?? s.value.streak,
);

const streakGoalLabel = computed(
  () =>
    STREAK_MILESTONE_LABELS[streakNextGoal.value] ??
    `Day ${streakNextGoal.value}`,
);

const streakDaysToGoal = computed(() =>
  Math.max(0, streakNextGoal.value - s.value.streak),
);

const streakProgressPercent = computed(() => {
  const goal = streakNextGoal.value;
  if (!goal) return 100;
  return Math.min(100, Math.round((s.value.streak / goal) * 100));
});

const streakTrackDays = computed(() => {
  const streak = s.value.streak;
  const goal = streakNextGoal.value;
  const items = [];
  const maxDots = 10;

  let start = 1;
  let end = goal;
  if (goal > maxDots) {
    start = Math.max(1, streak - 4);
    end = Math.min(goal, start + maxDots - 1);
    start = Math.max(1, end - maxDots + 1);
  }

  if (start > 1) items.push({ key: "el-start", ellipsis: true });
  for (let d = start; d <= end; d++) {
    items.push({
      key: `d-${d}`,
      day: d,
      status: d < streak ? "done" : d === streak ? "current" : "upcoming",
      isMilestone: STREAK_MILESTONES.includes(d),
    });
  }
  if (end < goal) {
    items.push({ key: "el-end", ellipsis: true });
    items.push({
      key: `d-${goal}`,
      day: goal,
      status: "upcoming",
      isMilestone: true,
      isGoal: true,
    });
  }
  return items;
});

// Earned badge IDs (computed from streak + special flags)
const earnedIds = computed(() => {
  const ids = new Set(s.value.badges.map(b => b.id).filter(Boolean));
  if (s.value.streak >= 3) ids.add("streak_3");
  if (s.value.streak >= 7) ids.add("streak_7");
  if (s.value.streak >= 14) ids.add("streak_14");
  if (s.value.streak >= 29) ids.add("streak_29");
  if (s.value.streak >= 90) ids.add("streak_90");
  if (s.value.streak >= 180) ids.add("streak_180");
  if (s.value.streak >= 365) ids.add("streak_365");
  if (s.value.isPurnima) ids.add("full_moon_witness");
  if (s.value.isAmavasya) ids.add("new_moon_keeper");
  if (s.value.isNakshatraBirthday) ids.add("star_day");
  if (s.value.starsAlign) ids.add("rare_alignment");
  if (s.value.isEclipse) ids.add("eclipse_chaser");
  ids.add("loyalty_3d");
  ids.add("loyalty_7d");
  return ids;
});

const modalBadges = computed(() =>
  ALL_BADGES.filter(b => b.category === modalCategory.value),
);

function resetInteractive() {
  expandedCat.value = null;
  oraclePickedIdx.value = null;
  matchExpanded.value = null;
  expandedWindow.value = null;
  nakshatraExpanded.value = false;
  dashaExpanded.value = false;
  bodyMapExpanded.value = false;
  showStreakModal.value = false;
}

function step(dir) {
  scenarioIdx.value =
    (scenarioIdx.value + dir + SCENARIOS.length) % SCENARIOS.length;
  resetInteractive();
}

function randomize() {
  const prev = scenarioIdx.value;
  let next = prev;
  while (next === prev && SCENARIOS.length > 1)
    next = Math.floor(Math.random() * SCENARIOS.length);
  scenarioIdx.value = next;
  resetInteractive();
}

function toggleCat(key) {
  expandedCat.value = expandedCat.value === key ? null : key;
}

function revealOracle() {
  if (oraclePickedIdx.value !== null) return;
  oraclePickedIdx.value = 0;
}
</script>

<template>
  <div class="demo-outer">
    <!-- ── Controls outside the phone ── -->
    <div class="demo-controls">
      <div class="scenario-nav">
        <button class="sc-arrow" @click="step(-1)">‹</button>
        <span class="sc-label">{{ s.label }}</span>
        <button class="sc-arrow" @click="step(1)">›</button>
      </div>
      <button class="randomize-btn" @click="randomize()">🎲 Randomize</button>
    </div>

    <div class="demo-meta">
      <span class="meta-chip">🎨 {{ bgKey }}</span>
      <span class="meta-chip">⏰ {{ s.timeOfDay }}</span>
      <span class="meta-chip">📊 avg {{ avgScore }}%</span>
      <span
        class="meta-chip"
        :style="{
          color: s.connectOnboardingDone
            ? 'rgba(74,222,128,0.8)'
            : 'rgba(251,191,36,0.8)',
        }">
        {{
          s.connectOnboardingDone ? "🤝 Connect done" : "⚠️ Connect not set up"
        }}
      </span>
    </div>

    <!-- ── Phone ── -->
    <PhoneFrame :show-back="false">
      <div class="today-page" :style="{ background: bg }">
        <!-- Stars pattern -->
        <div class="stars" />

        <!-- Time-of-day tint -->
        <div class="tint" :style="{ background: tint }" />

        <!-- ── Achievements modal overlay ── -->
        <transition name="modal">
          <div v-if="showModal" class="modal-overlay">
            <div class="modal-sheet">
              <div class="modal-header">
                <h2 class="modal-title">All Achievements</h2>
                <button class="modal-close" @click="showModal = false">
                  ✕
                </button>
              </div>

              <!-- Category tabs -->
              <div class="modal-tabs">
                <button
                  v-for="cat in BADGE_CATEGORIES"
                  :key="cat"
                  class="modal-tab"
                  :class="{ 'modal-tab--active': modalCategory === cat }"
                  @click="modalCategory = cat">
                  {{ cat }}
                </button>
              </div>

              <!-- Badge list -->
              <div class="modal-badges">
                <div
                  v-for="badge in modalBadges"
                  :key="badge.id"
                  class="modal-badge-row"
                  :class="{
                    'modal-badge-row--locked': !earnedIds.has(badge.id),
                  }">
                  <span class="modal-badge-icon">{{ badge.icon }}</span>
                  <div class="modal-badge-info">
                    <p class="modal-badge-name">{{ badge.name }}</p>
                    <p class="modal-badge-desc">{{ badge.desc }}</p>
                  </div>
                  <span v-if="earnedIds.has(badge.id)" class="modal-earned"
                    >✓</span
                  >
                  <span v-else class="modal-locked">🔒</span>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- ── Streak modal overlay ── -->
        <transition name="modal">
          <div
            v-if="showStreakModal"
            class="modal-overlay"
            @click.self="showStreakModal = false">
            <div class="modal-sheet streak-modal-sheet">
              <button
                class="modal-close streak-modal-close"
                aria-label="Close"
                @click="showStreakModal = false">
                ✕
              </button>
              <div class="streak-modal-body">
                <div class="streak-hero">
                  <div class="streak-hero-glow" aria-hidden="true" />
                  <span class="streak-hero-fire">🔥</span>
                  <p class="streak-hero-count">{{ s.streak }}</p>
                  <p class="streak-hero-label">
                    {{ s.streak === 1 ? "day" : "days" }} in a row
                  </p>
                </div>

                <div class="streak-progress-card">
                  <div class="streak-bar-head">
                    <span>Day {{ s.streak }}</span>
                    <span>{{ streakGoalLabel }}</span>
                    <span>Day {{ streakNextGoal }}</span>
                  </div>
                  <div class="streak-bar">
                    <div
                      class="streak-bar-fill"
                      :style="{ width: `${streakProgressPercent}%` }" />
                  </div>
                  <p v-if="streakDaysToGoal > 0" class="streak-next-hint">
                    {{ streakDaysToGoal }} more
                    {{ streakDaysToGoal === 1 ? "day" : "days" }} to unlock
                  </p>
                  <p v-else class="streak-next-hint streak-next-hint--done">
                    Milestone reached
                  </p>
                </div>

                <div class="streak-track-wrap">
                  <div class="streak-track">
                    <template
                      v-for="(item, i) in streakTrackDays"
                      :key="item.key">
                      <span v-if="item.ellipsis" class="streak-ellipsis"
                        >···</span
                      >
                      <div
                        v-else
                        class="streak-day"
                        :class="[
                          `streak-day--${item.status}`,
                          {
                            'streak-day--milestone': item.isMilestone,
                            'streak-day--goal': item.isGoal,
                          },
                        ]">
                        <div class="streak-day-dot-wrap">
                          <span class="streak-day-dot" />
                          <span
                            v-if="
                              i < streakTrackDays.length - 1 &&
                              !streakTrackDays[i + 1]?.ellipsis
                            "
                            class="streak-day-line"
                            :class="{
                              'streak-day-line--done': item.status === 'done',
                            }" />
                        </div>
                        <span class="streak-day-num">{{ item.day }}</span>
                      </div>
                    </template>
                  </div>
                </div>

                <p v-if="s.graceDay" class="streak-modal-grace">
                  🛡️ Streak protected yesterday
                </p>
                <p class="streak-modal-rule">
                  Miss a day and your streak resets.
                </p>
              </div>
            </div>
          </div>
        </transition>

        <!-- Scrollable content -->
        <div class="scroll">
          <!-- ── Block 0: Header ── -->
          <header class="ph-header">
            <div>
              <p class="ph-date">{{ todayDate }}</p>
              <p class="ph-greeting">{{ greeting }}, {{ s.userName }}</p>
            </div>
            <div class="ph-header-right">
              <span
                class="streak-pill"
                style="cursor: pointer"
                @click="showStreakModal = true"
                >🔥 Day {{ s.streak }}</span
              >
              <span class="notif-btn">🔔</span>
            </div>
          </header>

          <!-- ── Block 1: Day Synthesis ── -->
          <div class="headline-wrap">
            <div class="headline-bloom-wrap">
              <div class="headline-bloom" />
              <span class="headline-big-icon">{{ headline.icon }}</span>
            </div>
            <p class="headline-ornament">· · ·</p>
            <p class="headline-synthesis">{{ synthesis.sentence }}</p>
            <div class="headline-meta">
              <div class="info-pill">{{ infoLine }}</div>
              <p v-if="synthesis.moonTransit" class="moon-transit-line">
                🌙 {{ synthesis.moonTransit }}
              </p>
            </div>
            <p class="social-proof">{{ socialProofText }}</p>
          </div>
          <!-- ── Block 2: Today's Energy (3 categories) ── -->
          <section class="section">
            <p class="sec-label">TODAY'S ENERGY</p>
            <div class="energy-rows">
              <div
                v-for="cat in energy3"
                :key="cat.key"
                class="energy-row-wrap">
                <div
                  class="energy-row-item glass-sm"
                  :class="{ 'energy-row-item--open': expandedCat === cat.key }"
                  @click="toggleCat(cat.key)">
                  <span class="erow-icon" :class="`erow-icon--${cat.key}`">{{
                    cat.icon
                  }}</span>
                  <div class="erow-body">
                    <p class="erow-name">{{ cat.label }}</p>
                    <p class="erow-phrase">{{ cat.phrase }}</p>
                  </div>
                  <div
                    class="erow-state"
                    :style="{ '--sc': energyColor(cat.score) }">
                    <span
                      class="erow-dot"
                      :style="{ background: energyColor(cat.score) }" />
                    <span
                      class="erow-band"
                      :style="{ color: energyColor(cat.score) }"
                      >{{ cat.bandLabel }}</span
                    >
                  </div>
                  <span class="erow-chevron">{{
                    expandedCat === cat.key ? "▴" : "▾"
                  }}</span>
                </div>
                <transition name="expand">
                  <div
                    v-if="expandedCat === cat.key"
                    class="energy-detail glass-sm">
                    <p class="ed-explanation">{{ cat.explanation }}</p>
                  </div>
                </transition>
              </div>
            </div>
            <p class="tap-hint">Tap a category to see why</p>
          </section>

          <!-- ── Block 3: Nakshatra of the Day ── -->
          <section class="section">
            <p class="sec-label">NAKSHATRA OF THE DAY</p>
            <div
              class="nstar-card"
              :class="{ 'nstar-card--expanded': nakshatraExpanded }"
              @click="nakshatraExpanded = !nakshatraExpanded">
              <div class="nstar-halo">
                <span class="nstar-emoji">{{ nakshatraData.emoji }}</span>
              </div>
              <p class="nstar-quality">{{ nakshatraData.guna }}</p>
              <p class="nstar-name">{{ s.nakshatra }}</p>
              <p class="nstar-text">{{ nakshatraData.mainText }}</p>
              <p class="nstar-tap-hint">
                {{ nakshatraExpanded ? "▲ less" : "About this nakshatra ▼" }}
              </p>
              <transition name="expand">
                <div v-if="nakshatraExpanded" class="nstar-detail">
                  <div class="nstar-meta-row">
                    <div class="nstar-meta-item">
                      <p class="nstar-meta-label">Deity</p>
                      <p class="nstar-meta-val">{{ nakshatraData.devata }}</p>
                    </div>
                    <div class="nstar-meta-item">
                      <p class="nstar-meta-label">Symbol</p>
                      <p class="nstar-meta-val">{{ nakshatraData.symbol }}</p>
                    </div>
                  </div>
                  <p class="nstar-extended">{{ nakshatraData.extended }}</p>
                </div>
              </transition>
            </div>
          </section>

          <!-- ── Block 4: Do / Avoid ── -->
          <section class="section">
            <p class="sec-label">DO / AVOID</p>
            <div class="da-section">
              <div class="da-items">
                <div
                  v-for="tip in s.doTips"
                  :key="tip.text"
                  class="da-row da-row--do">
                  <span class="da-row-mark">✓</span>
                  <div class="da-row-body">
                    <p class="da-row-text">{{ tip.text }}</p>
                    <div class="tip-tags">
                      <span
                        v-for="tag in tip.tags"
                        :key="tag"
                        class="tip-tag tip-tag--do"
                        >{{ tag }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="da-divider">
                <span class="da-divider-label">avoid today</span>
              </div>
              <div class="da-items">
                <div
                  v-for="tip in s.avoidTips"
                  :key="tip.text"
                  class="da-row da-row--avoid">
                  <span class="da-row-mark">✕</span>
                  <div class="da-row-body">
                    <p class="da-row-text">{{ tip.text }}</p>
                    <div class="tip-tags">
                      <span
                        v-for="tag in tip.tags"
                        :key="tag"
                        class="tip-tag tip-tag--avoid"
                        >{{ tag }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button class="share-btn">📲 Share card · #Bisou</button>
          </section>

          <!-- ── Block 5: Your Day ── -->
          <section class="section">
            <p class="sec-label">YOUR DAY IN THREE PARTS</p>
            <div class="your-day">
              <div
                v-for="slot in yourDaySlots"
                :key="slot.slot"
                class="day-slot"
                :class="{ 'day-slot--now': slot.active }">
                <div class="day-slot-head">
                  <span class="slot-icon">{{ slot.icon }}</span>
                  <div>
                    <span class="slot-name">{{ slot.slot }}</span>
                    <span class="slot-time">{{ slot.time }}</span>
                  </div>
                  <span v-if="slot.active" class="slot-now-tag">Now</span>
                </div>
                <p class="slot-text">{{ slot.text }}</p>
              </div>
            </div>
          </section>

          <!-- ── Block 6: Power Windows + Rahu Kaal ── -->
          <section class="section">
            <p class="sec-label">POWER WINDOWS</p>
            <p class="pw-sub">{{ s.vaara }} · tap any to see why</p>
            <div class="pw-list">
              <div
                v-for="(w, i) in powerWindows"
                :key="i"
                class="pw-row"
                :class="[
                  `pw-${w.quality}`,
                  {
                    'pw-now': w.slot === s.timeOfDay,
                    'pw-open': expandedWindow === i,
                  },
                ]"
                @click="expandedWindow = expandedWindow === i ? null : i">
                <div class="pw-head">
                  <span class="pw-icon">{{ w.icon }}</span>
                  <div class="pw-center">
                    <p class="pw-title">{{ w.title }}</p>
                    <p class="pw-time">{{ w.time }}</p>
                  </div>
                  <div class="pw-badge-wrap">
                    <span v-if="w.slot === s.timeOfDay" class="pw-now-tag"
                      >Now</span
                    >
                    <span class="pw-quality-dot" :class="`dot-${w.quality}`" />
                  </div>
                </div>
                <transition name="expand">
                  <p v-if="expandedWindow === i" class="pw-hint">
                    {{ w.hint }}
                  </p>
                </transition>
              </div>
            </div>
          </section>

          <!-- ── Block 7: Cosmic Body Map ── -->
          <section class="section">
            <p class="sec-label">TODAY'S BODY FOCUS</p>
            <div class="body-map-wrap">
              <div
                class="body-map-card glass"
                :class="{ 'body-map-card--open': bodyMapExpanded }"
                @click="bodyMapExpanded = !bodyMapExpanded">
                <div class="body-map-icon-wrap">
                  <span class="body-map-big-icon">{{ bodyMapEntry.icon }}</span>
                  <span class="body-map-nakshatra">{{ s.nakshatra }}</span>
                </div>
                <div class="body-map-content">
                  <p class="body-map-area">{{ bodyMapEntry.area }}</p>
                  <p class="body-map-tip">{{ bodyMapEntry.tip }}</p>
                </div>
                <span class="erow-chevron">{{
                  bodyMapExpanded ? "▴" : "▾"
                }}</span>
              </div>
              <transition name="expand">
                <div v-if="bodyMapExpanded" class="body-map-detail glass-sm">
                  <p class="ed-explanation">{{ bodyMapEntry.vedicDetail }}</p>
                </div>
              </transition>
            </div>
            <p class="tap-hint">Tap for Vedic details</p>
          </section>

          <!-- ── Block 8: Daily Oracle ── -->
          <section class="section oracle-section">
            <p class="sec-label">TODAY'S ORACLE</p>

            <div class="oracle-skirt">
              <div class="oracle-skirt-glow" />

              <div
                class="oracle-card"
                :class="{ 'oracle-card--revealed': oraclePickedIdx !== null }"
                @click="revealOracle">
                <transition name="oracle-turn" mode="out-in">
                  <div
                    v-if="oraclePickedIdx === null"
                    key="back"
                    class="oracle-face oracle-face--back">
                    <p class="oracle-back-star">✦</p>
                    <p class="oracle-back-label">Oracle</p>
                    <p class="oracle-back-nakshatra">{{ s.nakshatra }}</p>
                    <p class="oracle-back-cta">Tap to reveal</p>
                  </div>
                  <div
                    v-else
                    key="front"
                    class="oracle-face oracle-face--front">
                    <p class="oracle-front-meta">
                      {{ s.nakshatra }} · Tithi {{ s.tithi }}
                    </p>
                    <p class="oracle-front-icon">{{ s.oracleCards[0].icon }}</p>
                    <p class="oracle-front-name">{{ s.oracleCards[0].name }}</p>
                    <p class="oracle-front-msg">
                      {{ s.oracleCards[0].message }}
                    </p>
                  </div>
                </transition>
              </div>

              <p v-if="oraclePickedIdx === null" class="oracle-hint">
                Your daily message awaits
              </p>
              <p v-else class="oracle-hint oracle-hint--done">
                ✦ Received · your message for today
              </p>
            </div>
          </section>

          <!-- ── Block 9: Dasha / Antardasha Snapshot ── -->
          <section class="section">
            <p class="sec-label">YOUR PLANETARY CYCLE</p>
            <div
              class="dasha-ring-card glass"
              :class="{ 'dasha-ring-card--open': dashaExpanded }"
              @click="dashaExpanded = !dashaExpanded">
              <div class="dasha-ring-top">
                <div class="dasha-ring-wrap">
                  <svg class="dasha-ring-svg" viewBox="0 0 80 80">
                    <circle class="dasha-ring-track" cx="40" cy="40" r="30" />
                    <circle
                      class="dasha-ring-fill"
                      cx="40"
                      cy="40"
                      r="30"
                      :stroke="dashaData.cycleColor"
                      :stroke-dasharray="`${(dashaData.cycleProgress * 188.5) / 100} 188.5`" />
                  </svg>
                  <div class="dasha-ring-center">
                    <span class="dasha-ring-icon">{{
                      dashaData.mahaIcon
                    }}</span>
                    <p class="dasha-ring-pct">{{ dashaData.cycleProgress }}%</p>
                  </div>
                </div>
                <div class="dasha-ring-body">
                  <p
                    class="dasha-ring-sub"
                    :style="{ color: dashaData.cycleColor }">
                    {{ dashaData.maha.split(" ")[0] }} Mahadasha
                  </p>
                  <p class="dasha-ring-sentence">{{ dashaData.sentence }}</p>
                  <p class="dasha-ring-until">
                    Until {{ dashaData.mahaUntil }}
                  </p>
                  <p class="dasha-ring-tap">
                    {{ dashaExpanded ? "▲" : "▼ Details" }}
                  </p>
                </div>
              </div>
              <transition name="expand">
                <div v-if="dashaExpanded" class="dasha-detail">
                  <div class="dasha-row">
                    <p class="dasha-label">Mahadasha</p>
                    <p class="dasha-val">
                      {{ dashaData.maha }} · until {{ dashaData.mahaUntil }}
                    </p>
                  </div>
                  <div class="dasha-row">
                    <p class="dasha-label">Antardasha</p>
                    <p class="dasha-val">
                      {{ dashaData.antar }} · until {{ dashaData.antarUntil }}
                    </p>
                  </div>
                  <p class="dasha-combo">{{ dashaData.comboMeaning }}</p>
                  <p v-if="!s.birthTimeKnown" class="dasha-warning">
                    ⚠️ Based on approximate birth time — dates may shift
                    slightly
                  </p>
                </div>
              </transition>
            </div>
          </section>

          <!-- ── Block 10: Stories ── -->
          <section class="section">
            <p class="sec-label">STORIES</p>
            <div class="stories-row">
              <div
                class="story-card"
                style="background: linear-gradient(180deg, #14003a, #380880)">
                <span>✦ Mercury<br />Retrograde<br />Guide</span>
              </div>
              <div
                class="story-card"
                style="background: linear-gradient(180deg, #1a2800, #2a5000)">
                <span>🌿 Moon<br />Rituals<br />101</span>
              </div>
              <div
                class="story-card"
                style="background: linear-gradient(180deg, #2a0012, #680032)">
                <span>✦ {{ s.nakshatra }}<br />Nakshatra<br />Decoded</span>
              </div>
              <div
                class="story-card"
                style="background: linear-gradient(180deg, #0a1a30, #1a3a70)">
                <span>🌊 Flow<br />State<br />Practice</span>
              </div>
            </div>
          </section>

          <!-- ── Block 11: Compatibility Pulse ── -->
          <section class="section">
            <p class="sec-label">TODAY'S COMPATIBILITY</p>

            <!-- Connect onboarding not completed -->
            <div v-if="!s.connectOnboardingDone" class="connect-cta glass">
              <div class="cta-icon">💫</div>
              <div class="cta-body">
                <p class="cta-title">
                  See your energy match with your connections today
                </p>
                <p class="cta-sub">
                  Compatibility changes every day based on your astrological
                  alignment. Complete your Connect profile to unlock it.
                </p>
              </div>
              <button class="cta-btn">Complete Connect profile →</button>
            </div>

            <!-- Has matches -->
            <div v-else class="compat-list">
              <div
                v-for="(match, i) in s.matches"
                :key="match.name"
                class="compat-card glass-sm"
                :class="{ 'compat-card--expanded': matchExpanded === i }"
                @click="matchExpanded = matchExpanded === i ? null : i">
                <div class="compat-row">
                  <span class="match-avatar">{{ match.avatar }}</span>
                  <div class="match-info">
                    <p class="match-name">{{ match.name }}</p>
                    <p class="match-nakshatra">{{ match.nakshatra }}</p>
                  </div>
                  <div class="match-score-wrap">
                    <p
                      class="match-score"
                      :style="{ color: compColor(match.score) }">
                      {{ match.score }}%
                    </p>
                    <p
                      class="match-score-label"
                      :style="{ color: compColor(match.score) }">
                      {{ compLabel(match.score) }}
                    </p>
                  </div>
                </div>
                <transition name="expand">
                  <p v-if="matchExpanded === i" class="match-insight">
                    {{ match.insight }}
                  </p>
                </transition>
              </div>
              <p class="compat-hint">Tap a match to see today's insight</p>
            </div>
          </section>

          <!-- ── Block 12: Achievements ── -->
          <section class="section">
            <div class="section-head-row">
              <p class="sec-label" style="margin-bottom: 0">ACHIEVEMENTS</p>
              <button class="view-all" @click="showModal = true">
                View all →
              </button>
            </div>
            <div class="badges-row">
              <div
                v-for="badge in s.badges"
                :key="badge.name"
                class="badge-chip"
                :class="`tier-${badge.tier}`">
                <span class="badge-ic">{{ badge.icon }}</span>
                <div class="badge-txt">
                  <p class="badge-name">{{ badge.name }}</p>
                  <p v-if="badge.count" class="badge-count">
                    ×{{ badge.count }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div class="bottom-pad" />
        </div>

        <!-- ── Dark bottom nav ── -->
        <nav class="dark-nav">
          <button class="dark-tab dark-tab--active">
            <span class="dark-tab-icon">☀️</span>
            <span class="dark-tab-label">Today</span>
          </button>
          <button class="dark-tab">
            <span class="dark-tab-icon">💫</span>
            <span class="dark-tab-label">Connect</span>
          </button>
          <button class="dark-tab">
            <span class="dark-tab-icon">✨</span>
            <span class="dark-tab-label">You</span>
          </button>
        </nav>
      </div>
    </PhoneFrame>
  </div>
</template>

<style scoped>
/* ── Outer wrapper ─────────────────────────────────────────────────────────── */
.demo-outer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.demo-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.scenario-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  padding: 6px 10px;
  backdrop-filter: blur(8px);
}

.sc-arrow {
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  line-height: 1;
  padding: 0 4px;
}
.sc-arrow:hover {
  color: white;
}

.sc-label {
  color: white;
  font-size: 13px;
  font-weight: 600;
  min-width: 160px;
  text-align: center;
}

.randomize-btn {
  background: linear-gradient(135deg, #6b21d6, #3e4ea2);
  color: white;
  font-size: 13px;
  font-weight: 700;
  padding: 8px 18px;
  border-radius: 100px;
  box-shadow: 0 4px 16px rgba(107, 33, 214, 0.4);
  transition:
    transform 0.1s,
    box-shadow 0.1s;
}
.randomize-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(107, 33, 214, 0.5);
}
.randomize-btn:active {
  transform: scale(0.97);
}

.demo-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.meta-chip {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 100px;
}

/* ── Page shell ───────────────────────────────────────────────────────────── */
.today-page {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  color: white;
  transition: background 0.7s ease;
}

.stars {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    /* bright stars */
    radial-gradient(
      1.5px 1.5px at 12% 8%,
      rgba(255, 255, 255, 0.9) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 28% 3%,
      rgba(255, 255, 255, 0.55) 0%,
      transparent 100%
    ),
    radial-gradient(
      2px 2px at 62% 6%,
      rgba(255, 255, 255, 0.95) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 80% 12%,
      rgba(255, 255, 255, 0.45) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 45% 18%,
      rgba(255, 255, 255, 0.65) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 92% 22%,
      rgba(255, 255, 255, 0.55) 0%,
      transparent 100%
    ),
    radial-gradient(
      1.5px 1.5px at 18% 30%,
      rgba(255, 255, 255, 0.35) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 70% 35%,
      rgba(255, 255, 255, 0.75) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 5% 45%,
      rgba(255, 255, 255, 0.45) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 55% 50%,
      rgba(255, 255, 255, 0.35) 0%,
      transparent 100%
    ),
    radial-gradient(
      1.5px 1.5px at 88% 55%,
      rgba(255, 255, 255, 0.65) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 35% 65%,
      rgba(255, 255, 255, 0.45) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 75% 72%,
      rgba(255, 255, 255, 0.35) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 22% 80%,
      rgba(255, 255, 255, 0.55) 0%,
      transparent 100%
    ),
    /* extra faint dust */
    radial-gradient(
        1px 1px at 50% 2%,
        rgba(255, 255, 255, 0.4) 0%,
        transparent 100%
      ),
    radial-gradient(
      1px 1px at 7% 14%,
      rgba(255, 255, 255, 0.28) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 38% 28%,
      rgba(255, 255, 255, 0.22) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 84% 38%,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 15% 58%,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 63% 62%,
      rgba(255, 255, 255, 0.25) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 42% 78%,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 100%
    ),
    radial-gradient(
      1px 1px at 96% 82%,
      rgba(255, 255, 255, 0.28) 0%,
      transparent 100%
    ),
    /* warm-tinted brighter stars */
    radial-gradient(
        1.5px 1.5px at 33% 5%,
        rgba(255, 240, 200, 0.7) 0%,
        transparent 100%
      ),
    radial-gradient(
      1.5px 1.5px at 72% 20%,
      rgba(200, 220, 255, 0.65) 0%,
      transparent 100%
    ),
    radial-gradient(
      1.5px 1.5px at 8% 70%,
      rgba(220, 200, 255, 0.55) 0%,
      transparent 100%
    ),
    radial-gradient(
      1.5px 1.5px at 58% 88%,
      rgba(255, 240, 180, 0.5) 0%,
      transparent 100%
    );
}

.tint {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  transition: background 1.5s ease;
}

.scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  z-index: 2;
  padding: 44px 14px 0;
  scroll-behavior: smooth;
}

/* ── Glass cards ──────────────────────────────────────────────────────────── */
.glass {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  backdrop-filter: blur(14px);
}

.glass-sm {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

/* ── Achievements modal ───────────────────────────────────────────────────── */
.modal-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: rgba(4, 6, 18, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-sheet {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 40px 16px 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.modal-title {
  font-family: var(--font-serif);
  font-size: 22px;
  color: white;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-close:hover {
  background: rgba(255, 255, 255, 0.18);
  color: white;
}

.modal-tabs {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 12px;
  flex-shrink: 0;
  scrollbar-width: none;
}
.modal-tabs::-webkit-scrollbar {
  display: none;
}

.modal-tab {
  flex-shrink: 0;
  padding: 5px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.15s;
}
.modal-tab--active {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.25);
  color: white;
}

.modal-badges {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 24px;
}

.modal-badge-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  transition: opacity 0.15s;
}

.modal-badge-row--locked {
  opacity: 0.4;
}

.modal-badge-icon {
  font-size: 22px;
  flex-shrink: 0;
}

.modal-badge-info {
  flex: 1;
}

.modal-badge-name {
  font-size: 13px;
  font-weight: 700;
  color: white;
  margin-bottom: 2px;
}

.modal-badge-desc {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.4;
}

.modal-earned {
  font-size: 14px;
  color: #4ade80;
  font-weight: 800;
  flex-shrink: 0;
}

.modal-locked {
  font-size: 13px;
  opacity: 0.5;
  flex-shrink: 0;
}

/* ── Block 0: Header ──────────────────────────────────────────────────────── */
.ph-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.ph-date {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  margin-bottom: 2px;
}

.ph-greeting {
  font-family: var(--font-serif);
  font-size: 22px;
  color: white;
  line-height: 1.2;
}

.ph-header-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding-top: 2px;
}

.grace-pill {
  font-size: 16px;
  opacity: 0.8;
  cursor: default;
}

.streak-pill {
  background: rgba(255, 140, 0, 0.25);
  border: 1px solid rgba(255, 160, 0, 0.4);
  color: #ffcc60;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 100px;
}

.notif-btn {
  font-size: 18px;
  opacity: 0.6;
  cursor: pointer;
}

/* ── Block 1: Headline ────────────────────────────────────────────────────── */
/* .headline-card styles moved to .headline-wrap above */

.info-pill {
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 100px;
  padding: 5px 14px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.03em;
  margin-bottom: 10px;
}

.social-proof {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.38);
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* ── Sections ─────────────────────────────────────────────────────────────── */
.section {
  margin-bottom: 22px;
}

.sec-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 10px;
}

.section-head-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.view-all {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
}
.view-all:hover {
  color: rgba(255, 255, 255, 0.7);
}

/* ── Block 2: Energy grid ─────────────────────────────────────────────────── */
.energy-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.cat-card {
  padding: 12px 10px 10px;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;
}
.cat-card:hover {
  background: rgba(255, 255, 255, 0.12);
}
.cat-expanded {
  background: rgba(255, 255, 255, 0.13) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.cat-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
}

.cat-icon {
  font-size: 14px;
  line-height: 1;
}
.cat-name {
  flex: 1;
  font-size: 12px;
  font-weight: 700;
  color: white;
}
.cat-pct {
  font-size: 14px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.cat-bar-track {
  height: 3px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 5px;
}

.cat-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
  opacity: 0.85;
}

.cat-label-text {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.expand-enter-active,
.expand-leave-active {
  transition:
    opacity 0.2s,
    max-height 0.25s ease;
  overflow: hidden;
  max-height: 160px;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.cat-detail {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cat-detail-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 5px;
}

.cat-detail-text {
  font-size: 11px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.7);
}

.tap-hint {
  text-align: center;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.25);
  margin-top: 8px;
  letter-spacing: 0.03em;
}

/* ── Block 3: Do/Avoid ────────────────────────────────────────────────────── */
.do-avoid {
  display: flex;
  gap: 0;
  overflow: hidden;
  margin-bottom: 10px;
}

.da-col {
  flex: 1;
  padding: 14px 10px;
}
.da-sep {
  width: 1px;
  background: rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.da-head {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.do-head {
  color: #4ade80;
}
.avoid-head {
  color: #fbbf24;
}

.da-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.da-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.da-text {
  font-size: 11px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.75);
  padding-left: 10px;
  position: relative;
}

.da-text::before {
  content: "·";
  position: absolute;
  left: 0;
  color: rgba(255, 255, 255, 0.3);
}

.tip-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  padding-left: 10px;
}

.tip-tag {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 100px;
  letter-spacing: 0.04em;
}

.tip-tag--do {
  background: rgba(74, 222, 128, 0.12);
  border: 1px solid rgba(74, 222, 128, 0.25);
  color: rgba(74, 222, 128, 0.8);
}
.tip-tag--avoid {
  background: rgba(251, 191, 36, 0.12);
  border: 1px solid rgba(251, 191, 36, 0.25);
  color: rgba(251, 191, 36, 0.8);
}

.share-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  transition: background 0.15s;
}
.share-btn:hover {
  background: rgba(255, 255, 255, 0.13);
  color: rgba(255, 255, 255, 0.8);
}

/* ── Block 4: Vibe ────────────────────────────────────────────────────────── */
.vibe-card {
  padding: 18px 16px;
}

.vibe-text {
  font-size: 14px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
}

.vibe-foot {
  margin-top: 10px;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.06em;
}

/* ── Block 5: Your Day ────────────────────────────────────────────────────── */
.your-day {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.day-slot {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 16px;
  padding: 12px 14px;
  transition: background 0.2s;
}

.day-slot--now {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
}

.day-slot-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
}

.slot-icon {
  font-size: 16px;
  flex-shrink: 0;
}
.slot-name {
  font-size: 13px;
  font-weight: 700;
  color: white;
}
.slot-time {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  margin-left: 4px;
  font-weight: 600;
}

.slot-now-tag {
  margin-left: auto;
  background: rgba(255, 220, 80, 0.2);
  border: 1px solid rgba(255, 220, 80, 0.4);
  color: #ffdc50;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 100px;
  letter-spacing: 0.06em;
}

.slot-text {
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
}

/* ── Block 6: Moon Streak ─────────────────────────────────────────────────── */
.moon-card {
  padding: 16px;
}

.moon-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
}

.ring-wrap {
  position: relative;
  flex-shrink: 0;
}
.ring-svg {
  width: 76px;
  height: 76px;
}

.ring-phase {
  position: absolute;
  bottom: -6px;
  right: -4px;
  font-size: 18px;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5));
}

.streak-info {
  flex: 1;
}

.streak-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.streak-big {
  font-size: 24px;
  font-weight: 800;
  color: #ffcc60;
  line-height: 1;
}
.streak-sub {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 8px;
  font-weight: 600;
}
.streak-phase {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.5;
}

.grace-tag {
  background: rgba(100, 180, 255, 0.18);
  border: 1px solid rgba(100, 180, 255, 0.3);
  color: rgba(160, 220, 255, 0.9);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 100px;
  letter-spacing: 0.05em;
}

.moon-strip {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.moon-dot {
  font-size: 18px;
  opacity: 0.5;
  transition: opacity 0.3s;
}
.moon-dot--today {
  opacity: 1;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6));
}

.strip-caption {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.streak-goal {
  background: rgba(255, 220, 80, 0.1);
  border: 1px solid rgba(255, 220, 80, 0.2);
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 11px;
  color: rgba(255, 220, 100, 0.8);
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
}

.grace-note {
  font-size: 11px;
  color: rgba(160, 220, 255, 0.65);
  text-align: center;
  font-weight: 600;
  padding: 6px 10px;
  background: rgba(100, 180, 255, 0.08);
  border: 1px solid rgba(100, 180, 255, 0.15);
  border-radius: 10px;
}

/* ── Block 7: Achievements ────────────────────────────────────────────────── */
.badges-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.badge-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid;
  flex-shrink: 0;
  min-width: 110px;
}

.tier-standard {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.12);
}
.tier-silver {
  background: rgba(192, 200, 240, 0.1);
  border-color: rgba(200, 210, 255, 0.25);
  box-shadow: 0 0 10px rgba(180, 190, 255, 0.15);
}
.tier-gold {
  background: rgba(220, 180, 40, 0.12);
  border-color: rgba(255, 220, 60, 0.28);
  box-shadow: 0 0 10px rgba(255, 200, 0, 0.2);
}
.tier-crown {
  background: rgba(220, 160, 20, 0.18);
  border-color: rgba(255, 220, 60, 0.45);
  box-shadow: 0 0 14px rgba(255, 200, 0, 0.35);
}

.badge-ic {
  font-size: 20px;
  line-height: 1;
}
.badge-name {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.3;
}
.badge-count {
  font-size: 10px;
  color: rgba(255, 220, 60, 0.8);
  font-weight: 700;
}

/* ── Reflection ───────────────────────────────────────────────────────────── */
.journal-card {
  padding: 16px;
}

.journal-prompt {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
}

.journal-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 10px 12px;
  color: white;
  font-size: 12px;
  line-height: 1.6;
  font-family: var(--font-sans);
  resize: none;
  outline: none;
  margin-bottom: 10px;
  transition: border-color 0.15s;
}
.journal-input:focus {
  border-color: rgba(255, 255, 255, 0.25);
}
.journal-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.journal-saved {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 10px 12px;
  background: rgba(74, 222, 128, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.18);
  border-radius: 12px;
  margin-bottom: 10px;
}

.saved-icon {
  font-size: 14px;
  color: #4ade80;
  flex-shrink: 0;
  font-weight: 800;
}
.saved-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.journal-btn {
  width: 100%;
  padding: 9px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  color: white;
  font-size: 12px;
  font-weight: 700;
  transition:
    background 0.15s,
    opacity 0.15s;
}
.journal-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.18);
}
.journal-btn:disabled {
  opacity: 0.35;
  cursor: default;
}

/* ── Block 8: Tomorrow ────────────────────────────────────────────────────── */
.tomorrow-card {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px;
  margin-bottom: 8px;
}

.tomorrow-icon {
  font-size: 28px;
  line-height: 1;
  flex-shrink: 0;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.3));
}
.tomorrow-hl {
  font-size: 14px;
  font-weight: 700;
  color: white;
  margin-bottom: 5px;
  line-height: 1.3;
}
.tomorrow-text {
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
}

.demo-note {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.25);
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 12px;
}

.intention-card {
  padding: 14px 16px;
}

.intention-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.intention-save-btn {
  background: rgba(140, 120, 255, 0.15);
  border-color: rgba(160, 140, 255, 0.3);
  color: rgba(200, 190, 255, 0.9);
}
.intention-save-btn:hover:not(:disabled) {
  background: rgba(140, 120, 255, 0.25);
}

/* ── Block 9: Stories ─────────────────────────────────────────────────────── */
.stories-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.story-card {
  flex: 0 0 88px;
  height: 140px;
  border-radius: 14px;
  display: flex;
  align-items: flex-end;
  padding: 10px 9px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bottom-pad {
  height: 24px;
}

/* ── Dark bottom nav ──────────────────────────────────────────────────────── */
.dark-nav {
  display: flex;
  background: rgba(6, 8, 20, 0.85);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  padding: 8px 0 20px;
  flex-shrink: 0;
  position: relative;
  z-index: 3;
}

.dark-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.35);
  transition: color 0.15s;
}
.dark-tab:hover {
  color: rgba(255, 255, 255, 0.6);
}
.dark-tab--active {
  color: white;
}

.dark-tab-icon {
  font-size: 20px;
}
.dark-tab-label {
  font-size: 11px;
  font-weight: 600;
}

/* ── Block I: Energy Check-In ─────────────────────────────────────────────── */
.checkin-card {
  padding: 16px;
}

.checkin-question {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 14px;
  line-height: 1.5;
}

.mood-row {
  display: flex;
  justify-content: space-between;
  gap: 4px;
}

.mood-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px 4px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  transition:
    background 0.15s,
    transform 0.1s,
    border-color 0.15s;
}
.mood-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.22);
  transform: translateY(-2px);
}
.mood-btn:active {
  transform: scale(0.94);
}

.mood-icon {
  font-size: 22px;
  line-height: 1;
}
.mood-label {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.05em;
}

.checkin-result {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkin-picked {
  display: flex;
  align-items: center;
  gap: 8px;
}
.checkin-picked-icon {
  font-size: 24px;
  line-height: 1;
}
.checkin-picked-label {
  font-size: 15px;
  font-weight: 700;
  color: white;
}
.checkin-reset {
  margin-left: auto;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 8px;
  transition:
    color 0.15s,
    background 0.15s;
}
.checkin-reset:hover {
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.08);
}

.checkin-outcome {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 14px;
}
.outcome-label {
  font-size: 15px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}
.outcome-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}

.checkin-accuracy {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.22);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-align: center;
}

/* ── Block 10: Daily Oracle ───────────────────────────────────────────────── */

.oracle-section {
  padding-bottom: 4px;
}

.oracle-skirt {
  position: relative;
  width: 100%;
  height: 360px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.oracle-skirt-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  width: 220px;
  height: 320px;
  background: radial-gradient(
    ellipse at 50% 40%,
    rgba(140, 80, 255, 0.25) 0%,
    transparent 70%
  );
  pointer-events: none;
  filter: blur(16px);
}

.oracle-card {
  width: 200px;
  height: 300px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  cursor: pointer;
  perspective: 800px;
  filter: drop-shadow(0 12px 32px rgba(100, 50, 220, 0.35));
}
.oracle-card--revealed {
  cursor: default;
}

.oracle-face {
  width: 200px;
  height: 300px;
  box-sizing: border-box;
  border-radius: 18px;
  border: 1px solid rgba(180, 140, 255, 0.28);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
}

.oracle-face--back {
  background: linear-gradient(165deg, #1a0840 0%, #0a0f2e 60%, #0d1a3a 100%);
  justify-content: center;
  gap: 8px;
  padding: 20px;
}

.oracle-face--front {
  background: linear-gradient(175deg, #250c55 0%, #0f1e50 50%, #1a0c3a 100%);
  justify-content: flex-start;
  gap: 10px;
  padding: 22px 18px 20px;
}

.oracle-back-star {
  font-size: 36px;
  color: rgba(212, 175, 55, 0.65);
  line-height: 1;
}
.oracle-back-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.3em;
  color: rgba(212, 175, 55, 0.75);
  text-transform: uppercase;
}
.oracle-back-nakshatra {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
}
.oracle-back-cta {
  margin-top: 10px;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
}

.oracle-front-meta {
  width: 100%;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.06em;
}
.oracle-front-icon {
  font-size: 44px;
  line-height: 1;
  margin: 4px 0;
}
.oracle-front-name {
  font-size: 11px;
  font-weight: 800;
  color: rgba(212, 175, 55, 0.85);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.oracle-front-msg {
  font-size: 13px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.85);
  flex: 1;
  display: flex;
  align-items: center;
}

/* One face in DOM at a time — back leaves, then front enters */
.oracle-turn-leave-active {
  transition:
    transform 0.3s ease-in,
    opacity 0.3s ease-in;
}
.oracle-turn-enter-active {
  transition:
    transform 0.35s ease-out,
    opacity 0.35s ease-out;
}
.oracle-turn-leave-to {
  transform: rotateY(90deg);
  opacity: 0;
}
.oracle-turn-enter-from {
  transform: rotateY(-90deg);
  opacity: 0;
}

.oracle-hint {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.22);
  font-weight: 600;
  letter-spacing: 0.06em;
}
.oracle-hint--done {
  color: rgba(212, 175, 55, 0.6);
  letter-spacing: 0.08em;
}

/* ── Block III: Compatibility Pulse ──────────────────────────────────────── */
.connect-cta {
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}
.cta-icon {
  font-size: 34px;
  line-height: 1;
}

.cta-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cta-title {
  font-size: 15px;
  font-weight: 700;
  color: white;
  line-height: 1.35;
}
.cta-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
}
.cta-btn {
  background: linear-gradient(
    135deg,
    rgba(180, 140, 255, 0.22),
    rgba(100, 120, 255, 0.18)
  );
  border: 1px solid rgba(180, 140, 255, 0.38);
  color: rgba(210, 190, 255, 0.92);
  font-size: 13px;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 100px;
  transition:
    background 0.15s,
    transform 0.1s;
  letter-spacing: 0.02em;
}
.cta-btn:hover {
  background: linear-gradient(
    135deg,
    rgba(180, 140, 255, 0.34),
    rgba(100, 120, 255, 0.28)
  );
  transform: translateY(-1px);
}

.compat-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.compat-card {
  padding: 12px 14px;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
}
.compat-card:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.18);
}
.compat-card--expanded {
  background: rgba(255, 255, 255, 0.13) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.compat-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.match-avatar {
  font-size: 26px;
  flex-shrink: 0;
  line-height: 1;
}

.match-info {
  flex: 1;
  min-width: 0;
}
.match-name {
  font-size: 13px;
  font-weight: 700;
  color: white;
  line-height: 1.3;
}
.match-nakshatra {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.38);
  font-weight: 600;
}

.match-score-wrap {
  text-align: right;
  flex-shrink: 0;
}
.match-score {
  font-size: 20px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}
.match-score-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.match-insight {
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.68);
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.compat-hint {
  text-align: center;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.22);
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-top: 2px;
}

.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.2s;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}

/* ── Block IV: Power Windows ──────────────────────────────────────────────── */
.pw-sub {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 600;
  margin-bottom: 10px;
  letter-spacing: 0.03em;
}

.pw-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pw-row {
  padding: 11px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
}
.pw-row:hover {
  background: rgba(255, 255, 255, 0.1);
}
.pw-open {
  background: rgba(255, 255, 255, 0.11) !important;
  border-color: rgba(255, 255, 255, 0.18) !important;
}

/* Quality variants */
.pw-golden {
  background: rgba(255, 210, 60, 0.08) !important;
  border-color: rgba(255, 210, 60, 0.25) !important;
}
.pw-golden:hover {
  background: rgba(255, 210, 60, 0.13) !important;
}

.pw-avoid {
  background: rgba(248, 113, 113, 0.07) !important;
  border-color: rgba(248, 113, 113, 0.2) !important;
}
.pw-avoid:hover {
  background: rgba(248, 113, 113, 0.12) !important;
}

.pw-rest {
  background: rgba(100, 160, 255, 0.07) !important;
  border-color: rgba(100, 160, 255, 0.18) !important;
}

/* Current slot highlight */
.pw-now {
  border-color: rgba(255, 255, 255, 0.28) !important;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.pw-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pw-icon {
  font-size: 18px;
  flex-shrink: 0;
  line-height: 1;
  width: 22px;
  text-align: center;
}

.pw-center {
  flex: 1;
  min-width: 0;
}
.pw-title {
  font-size: 13px;
  font-weight: 700;
  color: white;
  line-height: 1.3;
}
.pw-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 600;
  margin-top: 1px;
  font-variant-numeric: tabular-nums;
}

.pw-badge-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.pw-now-tag {
  font-size: 9px;
  font-weight: 800;
  color: rgba(74, 222, 128, 0.9);
  background: rgba(74, 222, 128, 0.12);
  border: 1px solid rgba(74, 222, 128, 0.25);
  padding: 2px 7px;
  border-radius: 100px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.pw-quality-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-peak {
  background: rgba(74, 222, 128, 0.8);
  box-shadow: 0 0 5px rgba(74, 222, 128, 0.4);
}
.dot-golden {
  background: rgba(255, 210, 60, 0.9);
  box-shadow: 0 0 6px rgba(255, 210, 60, 0.5);
}
.dot-medium {
  background: rgba(251, 191, 36, 0.7);
}
.dot-avoid {
  background: rgba(248, 113, 113, 0.8);
}
.dot-rest {
  background: rgba(100, 160, 255, 0.7);
}

.pw-hint {
  font-size: 11px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

/* ── Block V: Ask the Stars ───────────────────────────────────────────────── */
.stars-card {
  padding: 18px;
}

.stars-prompt {
  font-size: 15px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}
.stars-hint-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.38);
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1.5;
}

.stars-input {
  margin-bottom: 12px;
}

.stars-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(
    135deg,
    rgba(120, 80, 255, 0.22),
    rgba(60, 80, 200, 0.18)
  );
  border: 1px solid rgba(140, 100, 255, 0.35);
  color: rgba(200, 180, 255, 0.95);
  font-size: 13px;
  font-weight: 700;
  border-radius: 12px;
  transition:
    background 0.15s,
    transform 0.1s,
    opacity 0.15s;
  letter-spacing: 0.03em;
}
.stars-btn:hover:not(:disabled) {
  background: linear-gradient(
    135deg,
    rgba(120, 80, 255, 0.34),
    rgba(60, 80, 200, 0.28)
  );
  transform: translateY(-1px);
}
.stars-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

/* Asking animation */
.stars-asking {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 8px 0;
}

.stars-orb {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(120, 80, 255, 0.4) 0%,
    rgba(40, 20, 100, 0.3) 100%
  );
  border: 1px solid rgba(140, 100, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse-orb 1.2s ease-in-out infinite;
}
.stars-orb-icon {
  font-size: 22px;
  color: rgba(200, 180, 255, 0.8);
  animation: spin-slow 3s linear infinite;
  display: inline-block;
}

@keyframes pulse-orb {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(140, 100, 255, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(140, 100, 255, 0);
    transform: scale(1.05);
  }
}
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.stars-reading {
  font-size: 12px;
  color: rgba(200, 180, 255, 0.6);
  font-weight: 600;
  letter-spacing: 0.05em;
}

/* Answer */
.stars-answer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stars-answer-header {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.stars-answer-icon {
  font-size: 20px;
  color: rgba(255, 210, 60, 0.8);
  flex-shrink: 0;
  margin-top: 1px;
  filter: drop-shadow(0 0 4px rgba(255, 210, 60, 0.4));
}
.stars-answer-question {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
  margin-bottom: 2px;
  line-height: 1.4;
}
.stars-answer-source {
  font-size: 10px;
  color: rgba(200, 180, 255, 0.45);
  font-weight: 700;
  letter-spacing: 0.06em;
}

.stars-answer-text {
  font-size: 15px;
  font-weight: 600;
  color: white;
  line-height: 1.65;
  font-family: var(--font-serif);
  padding: 12px 14px;
  background: rgba(120, 80, 255, 0.1);
  border: 1px solid rgba(140, 100, 255, 0.2);
  border-radius: 12px;
}

.stars-answer-note {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.22);
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.04em;
}

/* ── Block VI: Cosmic Body Map ────────────────────────────────────────────── */

.body-map-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.body-map-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.12s, border-color 0.15s;
}
.body-map-card--open {
  border-color: rgba(255, 255, 255, 0.18);
}
.body-map-card:active {
  transform: scale(0.98);
}
.body-map-detail {
  border-radius: 14px;
  padding: 12px 14px;
  margin-top: -2px;
}
.body-map-icon-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.body-map-big-icon {
  font-size: 40px;
  line-height: 1;
}
.body-map-nakshatra {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.body-map-content {
  flex: 1;
}
.body-map-area {
  font-size: 15px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 6px;
  text-transform: capitalize;
}
.body-map-tip {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.55;
}

/* ── Block VII: Vedic Dice ────────────────────────────────────────────────── */

.dice-sub {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  margin: -6px 0 12px;
  letter-spacing: 0.04em;
}
.dice-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 20px 16px;
  border-radius: 20px;
}
.dice-face {
  width: 80px;
  height: 80px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.07);
  border: 2px solid rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s;
}
.dice-face.dice-rolling {
  animation: diceShake 0.06s infinite alternate;
}
.dice-face.dice-revealed {
  border-color: rgba(212, 175, 55, 0.6);
  background: rgba(212, 175, 55, 0.08);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
}
@keyframes diceShake {
  from {
    transform: rotate(-4deg) scale(1.02);
  }
  to {
    transform: rotate(4deg) scale(0.98);
  }
}
.dice-number {
  font-size: 36px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1;
}
.dice-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  animation: fadeUp 0.4s ease;
}
.dice-quality-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dice-symbol {
  font-size: 20px;
}
.dice-quality {
  font-size: 14px;
  font-weight: 800;
  color: #d4af37;
  letter-spacing: 0.1em;
}
.dice-interpretation {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  text-align: center;
}
.dice-footer {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 600;
  letter-spacing: 0.06em;
}
.dice-prompt-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}
.dice-btn {
  padding: 10px 32px;
  border-radius: 50px;
  border: 1.5px solid rgba(212, 175, 55, 0.5);
  background: rgba(212, 175, 55, 0.12);
  color: #d4af37;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s;
}
.dice-btn:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.22);
  transform: scale(1.04);
}
.dice-btn:disabled {
  opacity: 0.5;
  cursor: default;
}
.dice-btn--rolled {
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.4);
}

/* ── Streak Modal ──────────────────────────────────────────────────────────── */
.streak-modal-sheet {
  position: relative;
  justify-content: center;
  min-height: 78%;
  padding: 56px 24px 40px;
}
.streak-modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
}
.streak-modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  text-align: center;
}

.streak-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0 4px;
}
.streak-hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 220px;
  height: 220px;
  transform: translate(-50%, -55%);
  background: radial-gradient(
    circle,
    rgba(255, 150, 40, 0.28) 0%,
    rgba(255, 120, 20, 0.08) 45%,
    transparent 70%
  );
  pointer-events: none;
}
.streak-hero-fire {
  font-size: 52px;
  line-height: 1;
  margin-bottom: 4px;
}
.streak-hero-count {
  font-size: 80px;
  font-weight: 900;
  color: #ffcc60;
  line-height: 0.95;
  letter-spacing: -3px;
  text-shadow: 0 0 40px rgba(255, 160, 40, 0.35);
}
.streak-hero-label {
  margin: 8px 0 0;
  font-size: 17px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.02em;
}

.streak-progress-card {
  width: 100%;
  padding: 20px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
}
.streak-bar-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.03em;
}
.streak-bar-head span:nth-child(2) {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 220, 140, 0.9);
}
.streak-next-hint {
  margin: 14px 0 0;
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.65);
}
.streak-next-hint--done {
  color: rgba(255, 220, 140, 0.9);
}

.streak-track-wrap {
  width: 100%;
  padding: 18px 12px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}
.streak-track {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  overflow-x: auto;
  padding: 6px 4px 0;
  scrollbar-width: none;
}
.streak-track::-webkit-scrollbar {
  display: none;
}

.streak-ellipsis {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 0.1em;
  padding: 10px 4px 0;
  align-self: flex-start;
}

.streak-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 36px;
  flex-shrink: 0;
}
.streak-day-dot-wrap {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
}
.streak-day-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 2px solid rgba(255, 255, 255, 0.22);
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}
.streak-day-line {
  position: absolute;
  left: calc(50% + 6px);
  right: calc(-50% + 6px);
  top: 50%;
  height: 3px;
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-50%);
  z-index: 0;
}
.streak-day-line--done {
  background: rgba(255, 180, 60, 0.5);
}
.streak-day-num {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.02em;
}
.streak-day--done .streak-day-dot {
  background: rgba(255, 180, 60, 0.9);
  border-color: rgba(255, 200, 100, 0.95);
  box-shadow: 0 0 10px rgba(255, 160, 40, 0.4);
}
.streak-day--done .streak-day-num {
  color: rgba(255, 200, 120, 0.75);
}
.streak-day--current .streak-day-dot {
  width: 18px;
  height: 18px;
  background: #ffcc60;
  border-color: #ffe08a;
  box-shadow: 0 0 18px rgba(255, 180, 60, 0.7);
}
.streak-day--current .streak-day-num {
  color: #ffcc60;
  font-size: 13px;
}
.streak-day--milestone .streak-day-num {
  color: rgba(180, 140, 255, 0.85);
}
.streak-day--goal .streak-day-dot {
  border-color: rgba(180, 140, 255, 0.6);
  background: rgba(180, 140, 255, 0.2);
}

.streak-bar {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 99px;
  overflow: hidden;
}
.streak-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff9a2e 0%, #ffcc60 100%);
  border-radius: 99px;
  transition: width 0.4s ease;
}

.streak-modal-grace {
  font-size: 13px;
  color: rgba(255, 200, 100, 0.8);
  background: rgba(255, 200, 100, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
}
.streak-modal-rule {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.3);
  line-height: 1.5;
  margin: -4px 0 0;
}
/* ── Block 1: Day Synthesis ──────────────────────────────────── */
.headline-wrap {
  text-align: center;
  padding: 4px 4px 24px;
  margin-bottom: 6px;
}
.headline-bloom-wrap {
  position: relative;
  width: 88px;
  height: 88px;
  margin: 0 auto 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.headline-bloom {
  position: absolute;
  inset: -16px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.18) 0%,
    transparent 68%
  );
  animation: bloom-pulse 3.5s ease-in-out infinite;
}
@keyframes bloom-pulse {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.12);
  }
}
.headline-big-icon {
  font-size: 52px;
  line-height: 1;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 16px rgba(255, 255, 255, 0.5));
}
.headline-ornament {
  font-size: 10px;
  letter-spacing: 10px;
  color: rgba(255, 255, 255, 0.2);
  margin: 0 0 12px;
  padding-left: 10px;
}
.headline-synthesis {
  font-size: 20px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.55;
  text-align: center;
  padding: 0 6px;
  margin: 0 0 16px;
}
.headline-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.moon-transit-line {
  font-size: 12px;
  color: rgba(180, 200, 255, 0.75);
  text-align: center;
  font-style: italic;
}

/* ── Block 2: Energy rows ────────────────────────────────────── */
.energy-rows {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.energy-row-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.energy-row-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.12s, border-color 0.15s;
}
.energy-row-item--open {
  border-color: rgba(255, 255, 255, 0.18);
}
.energy-row-item:active {
  transform: scale(0.98);
}
.erow-chevron {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.28);
  flex-shrink: 0;
  margin-left: -4px;
}
.energy-detail {
  border-radius: 14px;
  padding: 12px 14px;
  margin-top: -2px;
}
.ed-explanation {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
  line-height: 1.55;
  margin: 0;
}
.erow-icon {
  font-size: 24px;
  width: 36px;
  text-align: center;
  flex-shrink: 0;
}
.erow-icon--health {
  filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.6));
}
.erow-icon--relations {
  filter: drop-shadow(0 0 5px rgba(244, 114, 182, 0.6));
}
.erow-icon--affairs {
  filter: drop-shadow(0 0 5px rgba(129, 140, 248, 0.6));
}
.erow-body {
  flex: 1;
  min-width: 0;
}
.erow-name {
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.88);
  margin: 0 0 3px;
}
.erow-phrase {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;
  margin: 0;
}
.erow-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.erow-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 6px currentColor;
}
.erow-band {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* ── Block 3: Nakshatra of the Day ──────────────────────────── */
.nstar-card {
  background: linear-gradient(
    160deg,
    rgba(120, 60, 200, 0.18) 0%,
    rgba(40, 10, 80, 0.3) 100%
  );
  border: 1px solid rgba(160, 100, 255, 0.2);
  border-radius: 22px;
  padding: 22px 18px 18px;
  cursor: pointer;
  text-align: center;
  transition: transform 0.1s;
}
.nstar-card:active {
  transform: scale(0.99);
}
.nstar-halo {
  width: 64px;
  height: 64px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
    circle,
    rgba(160, 100, 255, 0.25) 0%,
    transparent 72%
  );
  border-radius: 50%;
}
.nstar-emoji {
  font-size: 38px;
  line-height: 1;
}
.nstar-quality {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(160, 100, 255, 0.7);
  margin: 0 0 4px;
}
.nstar-name {
  font-size: 17px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.92);
  margin: 0 0 8px;
  letter-spacing: 0.02em;
}
.nstar-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.55;
  margin: 0 0 12px;
}
.nstar-tap-hint {
  font-size: 11px;
  color: rgba(160, 100, 255, 0.6);
  margin: 0;
}
.nstar-detail {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(160, 100, 255, 0.15);
  text-align: left;
}
.nstar-meta-row {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}
.nstar-meta-item {
  flex: 1;
}
.nstar-meta-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
  margin: 0 0 2px;
}
.nstar-meta-val {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.72);
  margin: 0;
  font-weight: 600;
}
.nstar-extended {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.55;
  margin: 0;
}

/* ── Block 4: Do / Avoid (redesigned) ────────────────────────── */
.da-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.da-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.da-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
}
.da-row--do {
  background: rgba(16, 185, 129, 0.08);
  border-left: 3px solid rgba(16, 185, 129, 0.5);
}
.da-row--avoid {
  background: rgba(245, 158, 11, 0.08);
  border-left: 3px solid rgba(245, 158, 11, 0.4);
}
.da-row-mark {
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
  margin-top: 1px;
}
.da-row--do .da-row-mark {
  color: #10b981;
}
.da-row--avoid .da-row-mark {
  color: #f59e0b;
}
.da-row-body {
  flex: 1;
  min-width: 0;
}
.da-row-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.45;
  margin: 0 0 4px;
}
.da-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
}
.da-divider::before,
.da-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.07);
}
.da-divider-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.22);
}

/* ── Block 10: Dasha Ring ───────────────────────────────────── */
.dasha-ring-card {
  padding: 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.1s;
}
.dasha-ring-card:active {
  transform: scale(0.99);
}
.dasha-ring-top {
  display: flex;
  align-items: center;
  gap: 16px;
}
.dasha-ring-wrap {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}
.dasha-ring-svg {
  width: 80px;
  height: 80px;
  transform: rotate(-90deg);
}
.dasha-ring-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.07);
  stroke-width: 5;
}
.dasha-ring-fill {
  fill: none;
  stroke-width: 5;
  stroke-linecap: round;
  transition: stroke-dasharray 0.6s ease;
}
.dasha-ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
}
.dasha-ring-icon {
  font-size: 22px;
  line-height: 1;
}
.dasha-ring-pct {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.38);
  margin: 2px 0 0;
}
.dasha-ring-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.dasha-ring-sentence {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.45;
  margin: 0;
}
.dasha-ring-sub {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 4px 0 0;
}
.dasha-ring-until {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.36);
  margin: 2px 0 0;
}
.dasha-ring-tap {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.28);
  margin: 6px 0 0;
}
.dasha-detail {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.dasha-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
  gap: 8px;
}
.dasha-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  margin: 0;
  flex-shrink: 0;
}
.dasha-val {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
  text-align: right;
}
.dasha-combo {
  font-size: 12px;
  color: rgba(200, 180, 255, 0.72);
  line-height: 1.5;
  margin: 4px 0 0;
  font-style: italic;
}
.dasha-warning {
  margin: 10px 0 0;
  font-size: 11px;
  color: rgba(255, 200, 80, 0.65);
}

</style>
