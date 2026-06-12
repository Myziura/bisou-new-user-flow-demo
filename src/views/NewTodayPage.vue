<script setup>
import { ref, computed } from 'vue'
import PhoneFrame from '../components/PhoneFrame.vue'

// ── Background gradients ─────────────────────────────────────────────────────

const BG = {
  celestial_event:   'linear-gradient(135deg, #1a0533 0%, #4d0f8f 25%, #0a1a4a 55%, #0f3a2a 100%)',
  eclipse:           'radial-gradient(ellipse at 50% 35%, #6b1a00 0%, #2a0000 50%, #000000 100%)',
  full_moon:         'linear-gradient(180deg, #060e2a 0%, #0d1d54 35%, #1a2d7a 65%, #253a8c 100%)',
  new_moon:          'linear-gradient(180deg, #020406 0%, #040810 40%, #060a16 70%, #080c1c 100%)',
  star_day:          'linear-gradient(135deg, #120038 0%, #28005e 45%, #0d0028 100%)',
  lunar_birthday:    'linear-gradient(180deg, #0a152e 0%, #142450 40%, #1e2a60 70%, #201540 100%)',
  your_day:          'linear-gradient(180deg, #2a1000 0%, #5a2800 35%, #a04820 65%, #c86030 100%)',
  solar_gate:        'linear-gradient(180deg, #3a2600 0%, #7a5000 35%, #c07a00 70%, #e0b820 100%)',
  venus_evening:     'linear-gradient(180deg, #280a20 0%, #581840 40%, #9c3860 70%, #c45848 100%)',
  moon_embrace:      'linear-gradient(180deg, #06101c 0%, #0e1c34 35%, #182c4e 65%, #243660 100%)',
  jupiter_abundance: 'linear-gradient(180deg, #06101e 0%, #0e1e38 35%, #1a3268 65%, #503a00 100%)',
  mercury_mind:      'linear-gradient(135deg, #001016 0%, #002030 40%, #003e48 70%, #006050 100%)',
  mars_fire:         'linear-gradient(180deg, #120000 0%, #280000 30%, #600000 60%, #9a2800 100%)',
  sun_radiance:      'linear-gradient(180deg, #281600 0%, #583000 30%, #9c6600 60%, #ce9618 100%)',
  saturn_clarity:    'linear-gradient(180deg, #04080e 0%, #0c1228 40%, #141c3e 70%, #1c2450 100%)',
  golden_hour:       'linear-gradient(180deg, #1e0e00 0%, #4e2c00 35%, #9a5c00 65%, #cc7c00 100%)',
  clear_sky:         'linear-gradient(180deg, #060c1c 0%, #0e1c36 35%, #1a2e58 65%, #264272 100%)',
  overcast:          'linear-gradient(180deg, #0e1016 0%, #1a1e2c 40%, #262a40 70%, #383c58 100%)',
  cloudy:            'linear-gradient(180deg, #0c0e16 0%, #181a2a 40%, #24283c 70%, #484c64 100%)',
  deep_night:        'linear-gradient(180deg, #020204 0%, #040508 40%, #06080e 70%, #080e28 100%)',
}

const TIME_TINT = {
  morning:   'rgba(196, 128, 32, 0.13)',
  afternoon: 'rgba(0,0,0,0)',
  evening:   'rgba(16, 0, 80, 0.16)',
}

// ── Moon / energy helpers ────────────────────────────────────────────────────

function getMoonIcon(tithi) {
  if (tithi === 30) return '🌑'
  if (tithi <= 7)   return '🌒'
  if (tithi === 8)  return '🌓'
  if (tithi <= 14)  return '🌔'
  if (tithi === 15) return '🌕'
  if (tithi <= 22)  return '🌖'
  if (tithi === 23) return '🌗'
  return '🌘'
}

function moonPhaseLabel(tithi) {
  if (tithi === 30)  return 'New Moon'
  if (tithi <= 7)    return 'Waxing Crescent'
  if (tithi === 8)   return 'First Quarter'
  if (tithi <= 14)   return 'Waxing Gibbous'
  if (tithi === 15)  return 'Full Moon'
  if (tithi <= 22)   return 'Waning Gibbous'
  if (tithi === 23)  return 'Last Quarter'
  return 'Waning Crescent'
}

function energyLabel(score) {
  if (score >= 71) return 'High Energy'
  if (score >= 41) return 'Moderate'
  return 'Low Energy'
}

function energyColor(score) {
  if (score >= 71) return '#4ade80'
  if (score >= 41) return '#fbbf24'
  return '#f87171'
}

// ── Background / headline resolvers ─────────────────────────────────────────

function resolveBackground(sc) {
  const scores = sc.scores
  const avg = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6)
  if (sc.starsAlign)           return 'celestial_event'
  if (sc.isEclipse)            return 'eclipse'
  if (sc.isPurnima)            return 'full_moon'
  if (sc.isAmavasya)           return 'new_moon'
  if (sc.isNakshatraBirthday)  return 'star_day'
  if (sc.isTithiBirthday)      return 'lunar_birthday'
  if (sc.isVaaraBirthday)      return 'your_day'
  if (sc.vaara === 'Friday'    && scores.love   >= 71) return 'venus_evening'
  if (sc.vaara === 'Monday'    && scores.family >= 71) return 'moon_embrace'
  if (sc.vaara === 'Thursday'  && scores.money  >= 71) return 'jupiter_abundance'
  if (sc.vaara === 'Wednesday' && (scores.social >= 71 || scores.career >= 71)) return 'mercury_mind'
  if (sc.vaara === 'Tuesday'   && (scores.health >= 71 || scores.career >= 71)) return 'mars_fire'
  if (sc.vaara === 'Sunday'    && scores.health >= 71) return 'sun_radiance'
  if (sc.vaara === 'Saturday'  && scores.career >= 71) return 'saturn_clarity'
  if (avg >= 80) return 'golden_hour'
  if (avg >= 65) return 'clear_sky'
  if (avg >= 50) return 'overcast'
  if (avg >= 35) return 'cloudy'
  return 'deep_night'
}

function resolveHeadline(sc) {
  const avg = Math.round(Object.values(sc.scores).reduce((a, b) => a + b, 0) / 6)
  if (sc.starsAlign)          return { icon: '🌟', type: 'Your Special Day',  sub: 'A rare alignment — happens only a few times a year' }
  if (sc.isPurnima)           return { icon: '🌕', type: 'Full Moon Day',      sub: 'Peak energy. Emotions run high' }
  if (sc.isAmavasya)          return { icon: '🌑', type: 'New Moon Day',       sub: 'Time to set new intentions' }
  if (sc.isNakshatraBirthday) return { icon: '⭐', type: 'Your Star Day',      sub: "Today's sky matches your birth sky" }
  if (sc.isTithiBirthday)     return { icon: '🎂', type: 'Lunar Birthday',     sub: 'The moon returns to your birth phase' }
  if (sc.isEclipse)           return { icon: '🌒', type: 'Eclipse Day',        sub: "Rare disruption. Observe, don't act." }
  if (avg >= 75)              return { icon: '⚡', type: 'High Energy Day',    sub: 'The stars are working for you today' }
  if (avg >= 50)              return { icon: '🌊', type: 'Flow With It',       sub: 'A steady day — go with the current' }
  return                             { icon: '🌙', type: 'Rest & Reflect',     sub: 'A quiet day. Good for inner work' }
}

// ── Category metadata ────────────────────────────────────────────────────────

const CATS = [
  { key: 'love',   label: 'Love',   icon: '💛', planet: 'Venus',   house: '7th'  },
  { key: 'career', label: 'Career', icon: '⚡', planet: 'Saturn',  house: '10th' },
  { key: 'health', label: 'Health', icon: '🌿', planet: 'Sun',     house: '1st'  },
  { key: 'money',  label: 'Money',  icon: '💰', planet: 'Jupiter', house: '2nd'  },
  { key: 'social', label: 'Social', icon: '🤝', planet: 'Mercury', house: '11th' },
  { key: 'family', label: 'Family', icon: '🏠', planet: 'Moon',    house: '4th'  },
]

const CAT_TEXT = {
  love: {
    high:     'Venus energy flows freely today. The planetary alignment favors romantic gestures and honest emotional expression. A small act of love will land with unexpected depth.',
    moderate: 'Love energy is steady — good for nurturing what already exists rather than starting something new. Appreciate what\'s in front of you.',
    low:      'Venus is subdued today. Avoid forcing connection — give space and let things settle naturally.',
  },
  career: {
    high:     'Saturn and Mercury are working for your career ambitions. Clarity of thought and disciplined effort are rewarded. A good day to make a move you\'ve been delaying.',
    moderate: 'Career energy is functional today — steady work beats inspired leaps. Finish what\'s already in motion.',
    low:      'Mercury and Saturn are in tension. Avoid big professional decisions and keep communications extra clear to prevent misunderstandings.',
  },
  health: {
    high:     'The Sun\'s vitality aligns with your natal chart. Physical energy is strong — a great day to exercise, eat well, and start a new health habit.',
    moderate: 'Health energy is balanced. Maintain routine and avoid overexertion. Your body is doing steady work beneath the surface.',
    low:      'Your system is more sensitive today. Rest, hydration, and gentle movement are more valuable than pushing through.',
  },
  money: {
    high:     'Jupiter\'s expansive energy touches your 2nd house today. Practical financial decisions carry long-term weight — a good day to research, plan, or make a calculated move.',
    moderate: 'Money energy is neutral — maintenance over expansion. Check your balances, pay a bill, keep things tidy.',
    low:      'Avoid financial risk today. Saturn\'s influence creates a contraction phase — hold your resources and wait for clearer skies.',
  },
  social: {
    high:     'Mercury activates your social energy. Words flow well, introductions land, and connections form easily. Reach out to someone you\'ve been thinking about.',
    moderate: 'Social energy is comfortable but not electric. Good for catching up with familiar faces rather than meeting new people.',
    low:      'Social battery is depleted today. Give yourself permission to be quiet — you\'ll be more yourself once you\'ve rested.',
  },
  family: {
    high:     'The Moon\'s influence on your 4th house strengthens family bonds today. A small gesture — a call, a meal, a memory shared — will mean more than you expect.',
    moderate: 'Family energy is stable. No dramatic shifts — quiet connection and presence.',
    low:      'Family dynamics may feel heavier today. Choose patience over reaction and let tensions settle without forcing resolution.',
  },
}

// ── Your Day lookup ──────────────────────────────────────────────────────────

const YOUR_DAY = {
  Sunday: {
    Morning:   { high: "Sun's energy is at its peak. Ideal for physical activity, self-care rituals, and setting clear intentions for the week.", moderate: "A calm Sunday morning. Good for gentle movement and preparing for the week ahead.", low: "The Sun is gentle today. Rest and let energy build naturally before noon." },
    Afternoon: { high: "Sun's vitality shines through the afternoon. A great time to pursue health goals and express yourself.", moderate: "A steady Sunday afternoon. Good for personal projects and anything that nourishes you.", low: "Keep the afternoon light — napping or slow walks serve you better." },
    Evening:   { high: "Bright Sunday evening — social energy is unexpectedly high. Connect with people who energize you.", moderate: "Wind down gently tonight. Prepare mentally for the week ahead.", low: "Rest is the best use of this evening. Early to bed and tomorrow opens better." },
  },
  Monday: {
    Morning:   { high: "Moon energy is at its strongest this morning. Let feeling lead your decisions — your intuition is sharp.", moderate: "A reflective Monday morning. Set your emotional tone for the week and don't rush.", low: "The Moon is waning in strength this morning. Take it slow and avoid confrontations early." },
    Afternoon: { high: "Emotional intelligence is your superpower this afternoon. Family and connection conversations go well.", moderate: "Moon's midday phase — good for nurturing tasks and checking in with people you care about.", low: "Low moon energy in the afternoon. Stick to routine; emotional work can wait." },
    Evening:   { high: "Moon evenings are made for family and close connection. Reach out to someone you love tonight.", moderate: "A gentle Monday night. Good for journaling or quiet conversation.", low: "Rest tonight. The Moon needs to recover, and so do you." },
  },
  Tuesday: {
    Morning:   { high: "Mars gives you an early burst of power. Tackle the hardest task on your list before 10 AM.", moderate: "Some Mars energy available — good for physical activity and focused work.", low: "Mars is subdued today. Don't force early intensity — pace yourself." },
    Afternoon: { high: "Mars energy stays strong. Good for athletic effort, direct conversations, and getting things done.", moderate: "A decent work afternoon. Push through the medium-difficulty tasks on your list.", low: "Low energy Tuesday afternoon. Avoid confrontation and rest between tasks." },
    Evening:   { high: "Mars evening — good for assertive decisions you've been postponing. Act on what you already know.", moderate: "Wind down well. Light exercise helps process today's drive before sleep.", low: "Low Mars evening. Rest and let the drive return tomorrow." },
  },
  Wednesday: {
    Morning:   { high: "Mercury sharpens your mind this morning. Write, plan, communicate — ideas flow easily today.", moderate: "A decent morning for organized thinking. Handle correspondence and planning before noon.", low: "Mercury is quiet this morning. Re-read before sending and avoid important negotiations." },
    Afternoon: { high: "Mental energy peaks. Best time for strategy sessions, deep writing, or complex problem-solving.", moderate: "A steady afternoon for methodical work. Good for following up and tying loose ends.", low: "Mercury slows this afternoon. Short tasks over deep work." },
    Evening:   { high: "Mercury evening — excellent for clever conversation, pitching ideas, and social wit.", moderate: "A decent evening for casual connection and light reading.", low: "Mercury is tired tonight. Rest your mind and return to complex topics tomorrow." },
  },
  Thursday: {
    Morning:   { high: "Jupiter expands everything it touches today. Morning decisions carry long-term weight — think big.", moderate: "Jupiter's optimism is available but mild. Good for practical planning and financial decisions.", low: "Jupiter is restrained this morning. Hold off on large commitments — better timing comes." },
    Afternoon: { high: "Jupiter's afternoon energy is excellent for growth conversations, teaching, and financial moves.", moderate: "A good Thursday for routine work and steady progress toward larger goals.", low: "Low Jupiter energy this afternoon. Avoid overcommitting or expanding plans today." },
    Evening:   { high: "Jupiter evenings are generous. Good for hosting, gifting, and abundant thinking.", moderate: "A pleasant Thursday evening. Good for gratitude practice and light social plans.", low: "Low expansion energy tonight. Keep it simple and rest." },
  },
  Friday: {
    Morning:   { high: "Venus day starts beautifully. Good morning for self-care, beauty routines, and sending affectionate messages.", moderate: "A pleasant Friday morning. Treat yourself — even a small luxury sets the right tone.", low: "Venus is subtle this morning. Light self-care over social effort." },
    Afternoon: { high: "Venus energy strengthens through the day. Creative work, beauty projects, and relationship effort all go well.", moderate: "A decent Friday afternoon for aesthetic and creative tasks.", low: "Low Venus energy in the afternoon. Quiet your social battery and rest before evening." },
    Evening:   { high: "Venus evening — the best time of the week for romance, connection, and pleasure. Go out or invite someone in.", moderate: "A pleasant Friday night. Good for relaxed social plans and gentle romance.", low: "Low energy Venus evening. Stay in and create something beautiful for yourself." },
  },
  Saturday: {
    Morning:   { high: "Saturn rewards discipline today. Start with your hardest, most delayed task — you have the will for it.", moderate: "A capable Saturday morning. Good for deep cleaning, long-deferred admin, and structure-building.", low: "Saturn's heaviness is real this morning. One small, useful task is enough." },
    Afternoon: { high: "Saturn afternoon — persistent, focused effort pays off today. Finish what you started this week.", moderate: "Steady progress Saturday. Not inspiring, but productive.", low: "A slow Saturn afternoon. Rest without guilt — this too is part of the cycle." },
    Evening:   { high: "Saturn evening: good for honest reflection, letting go of what isn't working, and planning the next week.", moderate: "A decent Saturday night for journaling and reviewing the week.", low: "Saturn's evening calls for rest and silence. Tomorrow will be lighter." },
  },
}

// ── Tomorrow templates ───────────────────────────────────────────────────────

const TOMORROW = {
  purnima:            { icon: '🌕', headline: 'Tomorrow is Full Moon',             body: 'Full Moon days are rare and powerful. Your Love and Social energy will peak. Come back tomorrow — there\'s a badge waiting.' },
  amavasya:           { icon: '🌑', headline: 'Tomorrow is New Moon',              body: 'New Moon is the best day to set clear intentions and start fresh. Come back tomorrow morning to open a clean cycle.' },
  chaturdashi:        { icon: '⚡', headline: 'Tomorrow is an intense day',        body: 'The 14th tithi carries high tension energy. Avoid major decisions and confrontations — let it pass.' },
  nakshatra_birthday: { icon: '⭐', headline: 'Tomorrow is Your Star Day',         body: 'The Moon returns to your birth nakshatra. A personal high-energy day. Come back tomorrow to collect your badge.' },
  tithi_birthday:     { icon: '🎂', headline: 'Tomorrow is Your Lunar Birthday',   body: 'The Moon reaches the same phase it was in when you were born. A quiet but meaningful personal day.' },
  high_energy:        { icon: '⚡', headline: 'Tomorrow looks powerful',            body: 'Your {top} energy will be at its peak. A good day to act on something important — check back in the morning.' },
  low_energy:         { icon: '🌙', headline: 'Tomorrow is a rest day',            body: 'The stars are quiet tomorrow. A good day for inner work, rest, and letting things settle.' },
  venus_day:          { icon: '💛', headline: 'Tomorrow is Venus Day (Friday)',    body: 'The best day of the week for love, beauty, and connection. Your Love and Social energy will be elevated. Make plans tonight.' },
  jupiter_day:        { icon: '🌟', headline: 'Tomorrow is Jupiter Day (Thursday)', body: 'Jupiter expands what it touches. Tomorrow favours financial decisions and anything you want to build long-term.' },
  moon_day:           { icon: '🌙', headline: 'Tomorrow is Moon Day (Monday)',     body: "The Moon's own day — strongest for family, emotional conversations, and intuitive decisions. Let feeling lead tomorrow." },
  default:            { icon: '🔮', headline: "Tomorrow's energy: {label}",        body: 'Your {top} will be the strongest area. Check back tomorrow morning for the full picture.' },
}

// ── All achievements (for modal) ─────────────────────────────────────────────

const ALL_BADGES = [
  { id: 'full_moon_witness',    icon: '🌕',    name: 'Full Moon Witness',   desc: 'Check in on Purnima',                       category: 'Cosmic Events',    repeatable: true  },
  { id: 'new_moon_keeper',      icon: '🌑',    name: 'New Moon Keeper',     desc: 'Check in on Amavasya',                      category: 'Cosmic Events',    repeatable: true  },
  { id: 'star_day',             icon: '⭐',    name: 'Star Day',            desc: 'Check in on your Nakshatra Birthday',       category: 'Cosmic Events',    repeatable: true  },
  { id: 'lunar_birthday',       icon: '🎂',    name: 'Lunar Birthday',      desc: 'Check in on your Tithi Birthday',           category: 'Cosmic Events',    repeatable: true  },
  { id: 'vaara_birthday',       icon: '📅',    name: 'Your Day',            desc: 'Check in on your Vaara Birthday',           category: 'Cosmic Events',    repeatable: true  },
  { id: 'rare_alignment',       icon: '🌟',    name: 'Rare Alignment',      desc: 'Nakshatra + Tithi + Vaara all match natal', category: 'Cosmic Events',    repeatable: true  },
  { id: 'eclipse_chaser',       icon: '🌒',    name: 'Eclipse Chaser',      desc: 'Check in during a lunar eclipse',           category: 'Cosmic Events',    repeatable: true  },
  { id: 'solar_event',          icon: '☀️',    name: 'Solstice Keeper',     desc: 'Check in on a solstice or equinox',         category: 'Cosmic Events',    repeatable: true  },

  { id: 'streak_3',             icon: '🔥',    name: 'First Spark',         desc: '3-day streak',                              category: 'Streak Milestones', repeatable: false },
  { id: 'streak_7',             icon: '🔥🔥',  name: 'First Week',          desc: '7-day streak',                              category: 'Streak Milestones', repeatable: false },
  { id: 'streak_14',            icon: '🌙',    name: 'Moonwalker',          desc: '14-day streak',                             category: 'Streak Milestones', repeatable: false },
  { id: 'streak_29',            icon: '🌕',    name: 'Full Cycle',          desc: '29-day streak (one lunar cycle)',           category: 'Streak Milestones', repeatable: false },
  { id: 'streak_90',            icon: '✨',    name: 'Three Moons',         desc: '90-day streak',                             category: 'Streak Milestones', repeatable: false },
  { id: 'streak_180',           icon: '🌠',    name: 'Half Year',           desc: '180-day streak',                            category: 'Streak Milestones', repeatable: false },
  { id: 'streak_365',           icon: '🏆',    name: 'Year of Stars',       desc: '365-day streak',                            category: 'Streak Milestones', repeatable: false },

  { id: 'loyalty_3d',           icon: '🌱',    name: 'First Steps',         desc: '3 days since joining',                      category: 'Loyalty',           repeatable: false },
  { id: 'loyalty_7d',           icon: '🌿',    name: 'One Week',            desc: '1 week since joining',                      category: 'Loyalty',           repeatable: false },
  { id: 'loyalty_30d',          icon: '🌳',    name: 'One Month',           desc: '30 days since joining',                     category: 'Loyalty',           repeatable: false },
  { id: 'loyalty_90d',          icon: '🌲',    name: 'Three Months',        desc: '90 days since joining',                     category: 'Loyalty',           repeatable: false },
  { id: 'loyalty_180d',         icon: '🏔️',    name: 'Half Year',           desc: '180 days since joining',                    category: 'Loyalty',           repeatable: false },
  { id: 'loyalty_365d',         icon: '🌌',    name: 'One Full Year',       desc: '365 days since joining',                    category: 'Loyalty',           repeatable: false },

  { id: 'first_match',          icon: '💫',    name: 'First Connection',    desc: 'First mutual match',                        category: 'Social',            repeatable: false },
  { id: 'five_matches',         icon: '💫💫',  name: 'Rising Star',         desc: '5 matches total',                           category: 'Social',            repeatable: false },
  { id: 'twenty_matches',       icon: '🌟',    name: 'Star Connector',      desc: '20 matches total',                          category: 'Social',            repeatable: false },
  { id: 'shared_today',         icon: '📲',    name: 'Sky Sharer',          desc: 'Shared Today card to social',               category: 'Social',            repeatable: true  },
  { id: 'invited_friend',       icon: '🤝',    name: 'Cosmic Invite',       desc: 'Invited a friend who joined',               category: 'Social',            repeatable: true  },

  { id: 'event_checkin',        icon: '🎪',    name: 'Star Gatherer',       desc: 'Checked in at a Bisou event',               category: 'Events',            repeatable: true  },
  { id: 'event_matched',        icon: '🎯',    name: 'Event Match',         desc: 'Got a match at an event',                   category: 'Events',            repeatable: true  },
  { id: 'event_series',         icon: '🏅',    name: 'Event Regular',       desc: 'Attended 3+ events',                        category: 'Events',            repeatable: false },
]

const BADGE_CATEGORIES = ['Cosmic Events', 'Streak Milestones', 'Loyalty', 'Social', 'Events']

// ── Power Windows ─────────────────────────────────────────────────────────────

const POWER_WINDOWS = {
  Sunday: [
    { icon: '☀️', title: 'High energy start',              time: '7:00 – 8:30 AM',   slot: 'morning',   quality: 'peak',   hint: 'Physical energy and confidence are at their peak — ideal for exercise, important calls, or anything needing momentum' },
    { icon: '🧠', title: 'Deep focus window',              time: '10:30 AM – 12:00', slot: 'morning',   quality: 'peak',   hint: 'Mental sharpness peaks here — use it for analysis, writing, or any work requiring concentration' },
    { icon: '✦',  title: 'Best decision window',           time: '11:48 AM – 12:24', slot: 'afternoon', quality: 'golden', hint: 'The most powerful 36-minute window of the day — use it for important choices, agreements, or new starts' },
    { icon: '⚠️', title: 'Low energy zone',                time: '4:30 – 6:00 PM',   slot: 'evening',   quality: 'avoid',  hint: 'Energy dips here — fine for routine tasks, but avoid starting anything new or making big decisions in this window' },
    { icon: '💛', title: 'Social & creative hour',         time: '7:00 – 8:30 PM',   slot: 'evening',   quality: 'medium', hint: 'Warm, connecting energy — good for meaningful conversations, creative ideas, or quality time with people you care about' },
  ],
  Monday: [
    { icon: '⚠️', title: 'Low energy zone',                time: '7:30 – 9:00 AM',   slot: 'morning',   quality: 'avoid',  hint: 'Energy dips at the start of the day — ease in with routine tasks and avoid anything important here' },
    { icon: '✦',  title: 'Growth window',                  time: '9:00 – 10:00 AM',  slot: 'morning',   quality: 'peak',   hint: 'The day opens up here — good for big-picture thinking, planning, and important conversations' },
    { icon: '✦',  title: 'Best decision window',           time: '11:48 AM – 12:24', slot: 'afternoon', quality: 'golden', hint: 'The most powerful 36-minute window of the day — use it for important choices, agreements, or new starts' },
    { icon: '🌙', title: 'Gut feeling window',             time: '2:30 – 3:30 PM',   slot: 'afternoon', quality: 'medium', hint: "Intuition is sharper than usual — good for reflection, creative work, or trusting your gut on something you've been weighing" },
    { icon: '💛', title: 'Evening warmth',                 time: '7:30 – 8:30 PM',   slot: 'evening',   quality: 'medium', hint: 'Relational energy returns — a good time to reconnect with people that matter' },
  ],
  Tuesday: [
    { icon: '🔥', title: 'Peak drive window',              time: '7:00 – 8:00 AM',   slot: 'morning',   quality: 'peak',   hint: 'The highest physical and mental drive of the day — tackle your hardest task now, before the energy settles' },
    { icon: '💛', title: 'Social window',                  time: '8:00 – 9:30 AM',   slot: 'morning',   quality: 'medium', hint: 'The best time on a high-drive day to reach out, have conversations, or collaborate with others' },
    { icon: '✦',  title: 'Best decision window',           time: '11:48 AM – 12:24', slot: 'afternoon', quality: 'golden', hint: 'The most powerful 36-minute window of the day — use it for important choices, agreements, or new starts' },
    { icon: '⚠️', title: 'Low energy zone',                time: '3:00 – 4:30 PM',   slot: 'afternoon', quality: 'avoid',  hint: 'Energy dips here — fine for routine tasks, but avoid starting anything new or making big decisions in this window' },
    { icon: '🧠', title: 'Evening clarity',                time: '9:00 – 10:00 PM',  slot: 'evening',   quality: 'medium', hint: 'A quiet, clear window — good for reflection, journaling, or light planning for tomorrow' },
  ],
  Wednesday: [
    { icon: '🧠', title: 'Sharpest thinking of the week', time: '7:00 – 8:00 AM',   slot: 'morning',   quality: 'peak',   hint: 'Wednesday mornings carry more mental clarity than any other day this week — use it for strategy, key messages, or complex thinking' },
    { icon: '🌙', title: 'Gut feeling window',             time: '9:00 – 10:00 AM',  slot: 'morning',   quality: 'medium', hint: 'Intuition briefly takes over from logic — good for creative choices or decisions that need to feel right, not just make sense' },
    { icon: '✦',  title: 'Best decision window',           time: '11:48 AM – 12:24', slot: 'afternoon', quality: 'golden', hint: 'Make your important move here — the low-energy zone starts right after this window ends' },
    { icon: '⚠️', title: 'Low energy zone',                time: '12:00 – 1:30 PM',  slot: 'afternoon', quality: 'avoid',  hint: 'Energy dips here — fine for routine tasks, but avoid starting anything new or making big decisions in this window' },
    { icon: '💛', title: 'Creative evening',               time: '8:00 – 9:30 PM',   slot: 'evening',   quality: 'medium', hint: 'A warm, expressive window — good for art, meaningful conversations, or anything creative' },
  ],
  Thursday: [
    { icon: '✦',  title: 'Best start of the week',         time: '7:00 – 8:30 AM',   slot: 'morning',   quality: 'peak',   hint: 'Thursday mornings carry strong growth energy — ideal for launching something, having a big conversation, or making a meaningful decision early' },
    { icon: '🧠', title: 'Communication window',           time: '10:30 – 11:30 AM', slot: 'morning',   quality: 'peak',   hint: 'Precision and persuasion both peak here — strong for negotiations, presentations, and any message that needs to land well' },
    { icon: '✦',  title: 'Best decision window',           time: '11:48 AM – 12:24', slot: 'afternoon', quality: 'golden', hint: 'The most powerful 36-minute window of the day — use it for important choices, agreements, or new starts' },
    { icon: '⚠️', title: 'Low energy zone',                time: '1:30 – 3:00 PM',   slot: 'afternoon', quality: 'avoid',  hint: 'Energy dips here — fine for routine tasks, but avoid starting anything new or making big decisions in this window' },
    { icon: '🌙', title: 'Wind-down time',                 time: '9:30 – 10:30 PM',  slot: 'evening',   quality: 'rest',   hint: 'The evening settles into calm — a natural moment for screen-free rest, light reading, or gentle preparation for sleep' },
  ],
  Friday: [
    { icon: '💛', title: 'Love & creativity peak',         time: '7:00 – 8:30 AM',   slot: 'morning',   quality: 'peak',   hint: 'Friday mornings carry the strongest love and creative energy of the week — a special window for anything that needs heart or beauty' },
    { icon: '🧠', title: 'Sharp thinking',                 time: '8:30 – 9:30 AM',   slot: 'morning',   quality: 'peak',   hint: 'Mental clarity before the day gets social and emotional — use this short window for focused work while it lasts' },
    { icon: '⚠️', title: 'Low energy zone',                time: '10:30 AM – 12:00', slot: 'morning',   quality: 'avoid',  hint: 'Energy dips here — fine for routine tasks, but avoid starting anything new or making big decisions in this window' },
    { icon: '✦',  title: 'Best decision window',           time: '11:48 AM – 12:24', slot: 'afternoon', quality: 'golden', hint: 'Right as the low energy lifts — this is your opening. Move on something important here.' },
    { icon: '💛', title: 'Peak evening energy',            time: '7:30 – 9:30 PM',   slot: 'evening',   quality: 'peak',   hint: 'The best evening of the entire week for love, meaningful connection, and social energy — do not let it pass quietly' },
  ],
  Saturday: [
    { icon: '🪐', title: 'Focused work time',              time: '7:00 – 8:00 AM',   slot: 'morning',   quality: 'peak',   hint: 'Saturday mornings are uniquely suited for structured, long-form, or administrative work — energy is concentrated and distraction-free' },
    { icon: '⚠️', title: 'Low energy zone',                time: '9:00 – 10:30 AM',  slot: 'morning',   quality: 'avoid',  hint: 'Energy dips here — fine for routine tasks, but avoid starting anything new or making big decisions in this window' },
    { icon: '✦',  title: 'Good moment to decide',          time: '10:30 – 11:30 AM', slot: 'morning',   quality: 'medium', hint: 'Expanded thinking returns after the slow morning — good for decisions that need a clear head' },
    { icon: '✦',  title: 'Best decision window',           time: '11:48 AM – 12:24', slot: 'afternoon', quality: 'golden', hint: 'The most powerful 36-minute window of the day — use it for important choices, agreements, or new starts' },
    { icon: '🌙', title: 'Evening reflection',             time: '9:00 – 10:30 PM',  slot: 'evening',   quality: 'rest',   hint: 'The week closes gently here — good for journaling, emotional processing, or simply letting everything settle' },
  ],
}

// ── Ask the Stars ──────────────────────────────────────────────────────────────

const NAKSHATRA_LIST = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya',
  'Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati',
  'Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana',
  'Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati',
]

const STAR_ANSWERS = [
  "The stars lean toward yes. Trust what you already know.",
  "Wait three days. The answer will be clearer after the moon shifts.",
  "A risk worth taking — but only if you've already done the groundwork.",
  "The path exists. The timing is not quite right.",
  "Yes. But let others see your enthusiasm only after you've committed.",
  "This is not a door you open. It opens itself when ready.",
  "Move forward. The hesitation is fear, not wisdom.",
  "Not yet. Something better is forming just behind this.",
  "The answer is already inside you. You're asking the stars to confirm it.",
  "Proceed with care. The outcome depends entirely on your patience.",
  "A clear yes — but the version of yes that requires courage.",
  "The energy around this is scattered right now. Give it a week.",
  "Strong yes on the surface. Look deeper before committing.",
  "Your instinct was right the first time. Stop second-guessing.",
  "The stars say nothing is blocked. The block is internal.",
  "This is a door worth knocking on. Whether it opens is not yet written.",
  "The timing is unusual — but unusual timing often marks the right moment.",
  "Not this path. A parallel one will become visible soon.",
  "Yes. The nakshatra agrees. Act before the moon shifts.",
  "The energy is neutral. This one is truly yours to decide.",
  "A slow yes. Not dramatic, not instant. But real.",
  "Release the need to know in advance. Take the step.",
  "Something about this isn't ready yet. It will be. Watch for the signal.",
  "The stars show a beginning, not a conclusion. Start.",
  "Hold the question a little longer. Clarity is one sleep away.",
  "This is smaller than it feels. The answer is yes.",
  "This is larger than it looks. Slow down before deciding.",
  "What you're really asking about is trust. Start there.",
  "The obstacle you see is temporary. The opportunity is not.",
  "The outcome already leans in your direction. Keep moving.",
  "Act, but quietly. No announcement before the work is done.",
  "The fear of regret is louder than the actual risk. Proceed.",
  "Yes — if you've already told someone about it. No — if you haven't.",
  "The stars see two paths. Both lead somewhere real. Choose the one you can fully commit to.",
  "A rare window is open right now. The answer lives in the action, not the waiting.",
  "The moon phase supports completion, not new beginnings. Revisit in two weeks.",
  "Something is ending so this can begin. Trust the transition.",
  "The energy today strongly favours this. Tomorrow it will feel different.",
  "This matters less than you think it does right now. Breathe.",
  "The question is good. The timing is perfect. Move.",
  "Not a no. A not-yet — with a specific date attached to it.",
  "The stars are quiet on this one. The choice is purely yours.",
  "Something adjacent to what you're asking is actually the real opportunity.",
  "Your body already knows the answer. Ask it instead.",
  "The path you want and the path that's right for you are the same today.",
  "A yes — that will require you to let go of something first.",
  "The pattern you're in needs breaking. This question is the break.",
  "Trust the person who gave you this question to think about. They see something you don't.",
  "The stars have been waiting for you to ask this. Yes.",
  "Still. For now. Not because the answer is no — because it's still becoming.",
]

// ── Cosmic Body Map ──────────────────────────────────────────────────────────

const BODY_MAP = [
  { nakshatra: 'Ashwini',          icon: '🧠', area: 'head & brain',              tip: 'Sharp starts today — protect against headaches from over-exertion' },
  { nakshatra: 'Bharani',          icon: '🧠', area: 'head & forehead',            tip: 'Mental load is heavy today — step outside and breathe' },
  { nakshatra: 'Krittika',         icon: '👁️', area: 'eyes, neck & shoulders',     tip: 'Screen fatigue hits harder — take visual breaks every 45 min' },
  { nakshatra: 'Rohini',           icon: '🗣️', area: 'throat, mouth & face',       tip: 'Communication energy is high — use your voice deliberately' },
  { nakshatra: 'Mrigashira',       icon: '💪', area: 'throat & upper arms',         tip: 'Shoulders carry today\'s tension — stretch before bed' },
  { nakshatra: 'Ardra',            icon: '🫁', area: 'shoulders & chest',           tip: 'Emotional weight sits in the upper body today — notice tightness' },
  { nakshatra: 'Punarvasu',        icon: '🫁', area: 'fingers, lungs & ears',       tip: 'Breathing is shallower today — slow inhales help' },
  { nakshatra: 'Pushya',           icon: '🫁', area: 'chest, stomach & lungs',      tip: 'Digestive energy is sensitive — eat lighter and avoid skipping meals' },
  { nakshatra: 'Ashlesha',         icon: '🦵', area: 'lungs, joints & knees',       tip: 'Joints need movement — sitting for long periods will slow you down' },
  { nakshatra: 'Magha',            icon: '❤️', area: 'spine & heart',               tip: 'Heart energy is amplified — check in with what you\'re carrying emotionally' },
  { nakshatra: 'Purva Phalguni',   icon: '🔙', area: 'heart, back & spine',         tip: 'Posture affects your mood today more than usual — stand tall' },
  { nakshatra: 'Uttara Phalguni',  icon: '🤲', area: 'hands & intestines',          tip: 'Gut feelings are literally physical today — trust abdominal signals' },
  { nakshatra: 'Hasta',            icon: '🤲', area: 'hands & bowels',              tip: 'Detail work with hands is energised — good for crafting, writing, or cooking' },
  { nakshatra: 'Chitra',           icon: '💧', area: 'forehead & kidneys',          tip: 'Kidney energy benefits from hydration — drink more water than usual' },
  { nakshatra: 'Swati',            icon: '🫁', area: 'skin, chest & kidneys',       tip: 'Skin is more reactive today — avoid irritants and get fresh air' },
  { nakshatra: 'Vishakha',         icon: '🦵', area: 'lower abdomen & thighs',      tip: 'Lower body needs movement — walk, stretch legs, avoid sitting still' },
  { nakshatra: 'Anuradha',         icon: '🔙', area: 'lower back, hips & thighs',   tip: 'Lower back tension accumulates — notice and release before evening' },
  { nakshatra: 'Jyeshtha',         icon: '🗣️', area: 'neck & tongue',              tip: 'Speaking clearly matters more today — slow down before you respond' },
  { nakshatra: 'Mula',             icon: '🦶', area: 'feet & lower back',           tip: 'Grounding energy sits in the feet — walk barefoot or get outside' },
  { nakshatra: 'Purva Ashadha',    icon: '🦵', area: 'thighs & hips',              tip: 'Hip flexibility and movement ease the day\'s energy' },
  { nakshatra: 'Uttara Ashadha',   icon: '🦵', area: 'thighs, knees & skin',        tip: 'Knees and thighs carry today\'s drive — move them to feel the flow' },
  { nakshatra: 'Shravana',         icon: '👂', area: 'ears & legs',                 tip: 'Listening is your strongest sense today — hear before speaking' },
  { nakshatra: 'Dhanishtha',       icon: '🦵', area: 'ankles & back',               tip: 'Ankles and calves need gentle movement — stretch before long walks' },
  { nakshatra: 'Shatabhisha',      icon: '🩸', area: 'ankles, calves & circulation', tip: 'Circulation benefits from movement — avoid sitting for more than 1 hour' },
  { nakshatra: 'Purva Bhadrapada', icon: '🦶', area: 'feet & calves',               tip: 'A short walk resets your state on this nakshatra' },
  { nakshatra: 'Uttara Bhadrapada',icon: '🦶', area: 'feet & immune system',         tip: 'Rest supports your immune energy today — don\'t push through tiredness' },
  { nakshatra: 'Revati',           icon: '🦶', area: 'feet & digestive system',      tip: 'A gentle walk and a lighter evening meal serve you well today' },
]

// ── Vedic Dice ───────────────────────────────────────────────────────────────

const VEDIC_NUMBERS = [
  { number: 1, quality: 'New Beginnings', symbol: '🌱', interpretation: 'One is the number of first steps. An action taken today carries more force than one taken later — the energy favours starting.' },
  { number: 2, quality: 'Balance',        symbol: '⚖️', interpretation: 'Two is the number of partnership. What needs to be weighed or aligned? Today responds well to cooperation over solo effort.' },
  { number: 3, quality: 'Expression',     symbol: '✨', interpretation: 'Three is the number of creativity and communication. Say what needs saying. Today amplifies your voice and creative energy.' },
  { number: 4, quality: 'Foundation',     symbol: '🏛️', interpretation: 'Four is the number of structure and stability. Build something that will last — plans made today have real staying power.' },
  { number: 5, quality: 'Movement',       symbol: '⚡', interpretation: 'Five is the number of change and momentum. Expect movement in situations that felt stuck. Stay adaptable — the shift is real.' },
  { number: 6, quality: 'Harmony',        symbol: '💛', interpretation: 'Six is the number of beauty and care. Relationships and your environment respond to attention today. Small acts of kindness carry.' },
  { number: 7, quality: 'Wisdom',         symbol: '🔮', interpretation: 'Seven is the number of deep knowing. Trust what you already understand, even if you can\'t fully explain it yet.' },
  { number: 8, quality: 'Power',          symbol: '🔥', interpretation: 'Eight is the number of authority and results. Today is for decisions, leadership, and completing what you started.' },
  { number: 9, quality: 'Completion',     symbol: '🌊', interpretation: 'Nine is the number of endings that clear the path. Something finishing today is making space. Let it go cleanly.' },
]

// ── Daily Cosmic Pull ────────────────────────────────────────────────────────

const PULL_QUALITIES = [
  { quality: 'Clarity',    symbol: '🔷', color: '#3b82f6' },
  { quality: 'Action',     symbol: '⚡', color: '#f59e0b' },
  { quality: 'Patience',   symbol: '🌿', color: '#10b981' },
  { quality: 'Connection', symbol: '💛', color: '#f97316' },
  { quality: 'Rest',       symbol: '🌙', color: '#8b5cf6' },
  { quality: 'Courage',    symbol: '🔥', color: '#ef4444' },
  { quality: 'Gratitude',  symbol: '✦',  color: '#d4af37' },
  { quality: 'Boundaries', symbol: '🛡️', color: '#6b7280' },
  { quality: 'Trust',      symbol: '🌊', color: '#0ea5e9' },
]

const PULL_BANK = [
  // Clarity (0–5)
  { q: 0, msg: 'This morning asks you to cut through the noise. The clearest path forward is the one you already sense — trust that signal before the day adds complexity.' },
  { q: 0, msg: 'What feels murky will sharpen by midday. Don\'t force decisions yet — wait for the moment when the answer arrives simply.' },
  { q: 0, msg: 'The situation is clearer than it appears. Step back from the details and look at the whole picture. The answer is already visible.' },
  { q: 0, msg: 'Clarity today comes from simplifying, not from gathering more information. Reduce before you decide.' },
  { q: 0, msg: 'A moment of quiet this afternoon will produce more insight than an hour of active thinking. Give your mind space.' },
  { q: 0, msg: 'You already know. The hesitation is not confusion — it\'s resistance. The answer is clear.' },
  // Action (6–11)
  { q: 1, msg: 'The window for decisive action is open right now. Move on something you\'ve been considering — momentum is available and waiting.' },
  { q: 1, msg: 'Don\'t wait for perfect conditions. A good move made today with incomplete information is more valuable than a perfect move made too late.' },
  { q: 1, msg: 'The energy today supports bold first steps. Start the thing. The path will become clearer once you\'re moving.' },
  { q: 1, msg: 'Act before overthinking sets in. The first impulse you had this morning about the situation — that one. Follow it.' },
  { q: 1, msg: 'Something you\'ve been circling is ready to be decided. The indecision costs more than either choice. Choose and move.' },
  { q: 1, msg: 'This is a making day, not a planning day. Do the work. The results will come.' },
  // Patience (12–17)
  { q: 2, msg: 'Hold steady today. The right timing hasn\'t arrived yet — what feels urgent is actually asking for patience, not action.' },
  { q: 2, msg: 'Not yet. The seeds are still below ground. Tending quietly now is exactly what this moment requires.' },
  { q: 2, msg: 'The situation needs time, not intervention. Resist the urge to force movement. What\'s growing beneath the surface is real.' },
  { q: 2, msg: 'Patience today is an active choice, not a passive one. You\'re choosing to let things develop rather than rush them.' },
  { q: 2, msg: 'What you\'re waiting for is coming. The timing is not in your hands right now, and that\'s exactly as it should be.' },
  { q: 2, msg: 'Slow down in a way that feels almost uncomfortable. That\'s the pace today is calling for.' },
  // Connection (18–23)
  { q: 3, msg: 'Reach out to someone you\'ve been meaning to contact. The connection is wanted on both sides — you just need to make the first move.' },
  { q: 3, msg: 'The relationships around you are amplified today. A small gesture of care will land deeper than usual.' },
  { q: 3, msg: 'Someone in your circle needs to be seen right now. Not helped — just acknowledged. You know who.' },
  { q: 3, msg: 'Today favours deep conversation over surface-level interaction. Go beneath the usual topics with someone you trust.' },
  { q: 3, msg: 'The loneliness or disconnection you\'ve been feeling is temporary. Reaching out — even briefly — will shift it.' },
  { q: 3, msg: 'Love and friendship return what you put into them today with interest. Give first.' },
  // Rest (24–29)
  { q: 4, msg: 'Doing less achieves more today. The most powerful move is to stop pushing and let the situation breathe.' },
  { q: 4, msg: 'Your energy is a resource. What you protect today compounds tomorrow. Rest is not stopping — it\'s preparing.' },
  { q: 4, msg: 'The body is speaking today. Listen before it has to repeat itself louder.' },
  { q: 4, msg: 'A quieter evening than planned will leave you more equipped for what comes next. Honour the pull toward stillness.' },
  { q: 4, msg: 'Stop performing productivity. The real work today happens in the spaces between doing.' },
  { q: 4, msg: 'Sleep and restoration carry as much weight as action in a life well-lived. Tonight belongs to recovery.' },
  // Courage (30–35)
  { q: 5, msg: 'There\'s something you\'ve been avoiding. Today the energy is behind you — face it.' },
  { q: 5, msg: 'The fear is real. Go anyway. Courage is not the absence of fear; it\'s the decision that something matters more than the fear.' },
  { q: 5, msg: 'Say the thing you\'ve been holding back. The right moment is now, and the words will come when you start.' },
  { q: 5, msg: 'One conversation you\'ve been postponing is overdue. Courage today means starting it, not finishing it perfectly.' },
  { q: 5, msg: 'What looks like a wall is actually a door. You won\'t see the handle until you walk toward it.' },
  { q: 5, msg: 'Trust yourself enough to try. The outcome matters less than the act of showing up fully.' },
  // Gratitude (36–41)
  { q: 6, msg: 'Before you focus on what\'s missing, notice what\'s here. Appreciation today doesn\'t mean ignoring the hard parts — it means holding both at once.' },
  { q: 6, msg: 'Something that felt ordinary yesterday is actually remarkable. It\'s worth looking at again.' },
  { q: 6, msg: 'The good things in your life didn\'t have to be there. They arrived through many small decisions, none of which were guaranteed.' },
  { q: 6, msg: 'Tell someone today that they matter. Gratitude expressed is twice as powerful as gratitude felt.' },
  { q: 6, msg: 'The hardest chapter you survived is also part of what you\'re grateful for now, even if you can\'t say it fully yet.' },
  { q: 6, msg: 'Count three things that worked this week before the day ends. Specifics only.' },
  // Boundaries (42–47)
  { q: 7, msg: 'Your energy belongs to you first. Protect it today without guilt — the people who matter will understand.' },
  { q: 7, msg: 'Something you agreed to is asking more than you have. It\'s okay to renegotiate.' },
  { q: 7, msg: 'A clear no, given kindly, does more for a relationship than a reluctant yes.' },
  { q: 7, msg: 'You\'ve been absorbing more than you\'re releasing. Something needs to be set down today.' },
  { q: 7, msg: 'The boundary you\'re hesitating to set is being felt whether you say it or not. Stating it cleanly is the kindest option.' },
  { q: 7, msg: 'Protecting your time and attention is not selfishness. It\'s the foundation everything else stands on.' },
  // Trust (48–53)
  { q: 8, msg: 'Release the need to control the outcome. The situation is unfolding in a direction you can\'t fully see yet — trust the process.' },
  { q: 8, msg: 'The thing that doesn\'t make sense right now will make sense later. You don\'t need to understand it to move forward.' },
  { q: 8, msg: 'What\'s being taken away is making space. Not all endings are losses.' },
  { q: 8, msg: 'You\'ve done the work. Now let it work. Stop checking, stop adjusting. Trust what you\'ve set in motion.' },
  { q: 8, msg: 'The path forward is clearer than your anxiety is willing to admit. Trust what you know.' },
  { q: 8, msg: 'Something is being arranged on your behalf right now. You can\'t see it yet. That\'s fine.' },
]

// ── Interactive block data ────────────────────────────────────────────────────

const MOODS = [
  { key: 'drained',   icon: '😴', label: 'Drained'   },
  { key: 'flat',      icon: '😐', label: 'Flat'       },
  { key: 'okay',      icon: '😊', label: 'Okay'       },
  { key: 'energized', icon: '⚡', label: 'Energized'  },
  { key: 'electric',  icon: '🌟', label: 'Electric'   },
]

function checkinResult(avgScore, moodKey) {
  const idx = MOODS.findIndex(m => m.key === moodKey)
  const actual    = idx <= 1 ? 'low' : idx === 2 ? 'moderate' : 'high'
  const predicted = avgScore >= 71 ? 'high' : avgScore >= 41 ? 'moderate' : 'low'
  if (predicted === actual) {
    if (predicted === 'high')   return { label: 'In sync ⚡',  sub: 'Your inner state matched the cosmic forecast today.' }
    if (predicted === 'low')    return { label: 'Confirmed',   sub: 'A quiet day — the stars read you right.' }
    return                             { label: 'Right on',    sub: 'Steady alignment between forecast and reality.' }
  }
  if (predicted === 'high' && actual === 'low')  return { label: 'Off today',    sub: 'The stars promised more. Your body had other plans. Noted.' }
  if (predicted === 'low'  && actual === 'high') return { label: 'Surprise 🌟',  sub: 'Stronger than predicted. Something is shifting in your favour.' }
  return                                                { label: 'Close',         sub: "Small gap between forecast and reality — that's normal." }
}

function compColor(score) {
  if (score >= 80) return '#4ade80'
  if (score >= 60) return '#fbbf24'
  if (score >= 40) return '#fb923c'
  return '#f87171'
}

function compLabel(score) {
  if (score >= 80) return 'Strong match'
  if (score >= 60) return 'Good match'
  if (score >= 40) return 'Different energies'
  return 'Rough day for connection'
}

// ── Scenarios ────────────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    label: '🌕 Full Moon Friday',
    userName: 'Sofia',
    vaara: 'Friday', tithi: 15, tithiName: 'Purnima', nakshatra: 'Pushya',
    isPurnima: true, isAmavasya: false, isChaturdashi: false,
    isNakshatraBirthday: false, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: false, paksha: 'Shukla', timeOfDay: 'evening',
    scores: { love: 92, career: 64, health: 78, money: 70, social: 88, family: 82 },
    streak: 14, graceDay: false,
    vibeText: "Full Moon energy peaks tonight on Pushya nakshatra — one of the most auspicious stars of the month. Your love and social energy are amplified. Reach out to someone meaningful before the night ends.",
    doTips: [
      { text: "Release something that no longer serves you on this Full Moon", tags: ["Full Moon", "Shukla"] },
      { text: "Reach out to someone you've been thinking about",              tags: ["Love ↑", "Friday"] },
      { text: "Plan a date or quality time with your partner today",          tags: ["Love ↑", "Social ↑"] },
    ],
    avoidTips: [
      { text: "Avoid staying up past midnight — your recovery window matters tonight",  tags: ["Full Moon"] },
      { text: "Don't make impulsive purchases today — the urge will pass",              tags: ["Full Moon", "Friday"] },
      { text: "Skip the passive-aggressive comment you're considering",                 tags: ["Full Moon"] },
    ],
    badges: [{ icon: '🌕', name: 'Full Moon Witness', count: 3, tier: 'silver', id: 'full_moon_witness' }, { icon: '🌙', name: 'Moonwalker', count: null, tier: 'standard', id: 'streak_14' }, { icon: '🔥🔥', name: 'First Week', count: null, tier: 'standard', id: 'streak_7' }],
    tomorrowKey: 'default', tomorrowTop: 'Love', tomorrowLabel: 'Moderate',
    connectOnboardingDone: true,
    matches: [
      { name: 'Marcus', avatar: '☀️', nakshatra: 'Uttara Phalguni', score: 91, insight: "Both in Love ↑ today — a rare double Venus alignment on a Full Moon. Reach out before midnight." },
      { name: 'Liam',   avatar: '🌊', nakshatra: 'Shravana',        score: 68, insight: "His Social is high, yours is Love — good conversation energy but different wavelengths today." },
    ],
    oracleCards: [
      { name: 'The Star',   icon: '🌕', message: "What you've been holding will release tonight. Let the Full Moon do the work." },
      { name: 'The Path',   icon: '🌊', message: "Love doesn't need to be chased today. It's already in the room with you." },
      { name: 'The Mirror', icon: '✨', message: "Send the message. Make the plan. Tonight's energy supports bold moves in connection." },
    ],
  },
  {
    label: '🌑 New Moon Monday',
    userName: 'Arjun',
    vaara: 'Monday', tithi: 30, tithiName: 'Amavasya', nakshatra: 'Ashlesha',
    isPurnima: false, isAmavasya: true, isChaturdashi: false,
    isNakshatraBirthday: false, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: false, paksha: 'Krishna', timeOfDay: 'morning',
    scores: { love: 38, career: 42, health: 55, money: 35, social: 28, family: 44 },
    streak: 7, graceDay: true,
    vibeText: "New Moon on Ashlesha nakshatra invites you to turn inward. This is a potent day for release and intention-setting, not action. Let the old chapter close quietly before writing the new one.",
    doTips: [
      { text: "Set a powerful new intention during this New Moon — write it down", tags: ["New Moon"] },
      { text: "Do a breathing or meditation session today — even 10 minutes",     tags: ["New Moon", "Health ↑"] },
      { text: "Write down three things you're grateful for this morning",          tags: ["Monday", "Waning Moon"] },
    ],
    avoidTips: [
      { text: "Avoid large social gatherings that drain rather than energize you",   tags: ["Social ↓", "New Moon"] },
      { text: "Don't make financial decisions based on pressure or urgency",         tags: ["Money ↓", "New Moon"] },
      { text: "Avoid starting anything new today — the waning moon favours completion", tags: ["Waning Moon"] },
    ],
    badges: [{ icon: '🌑', name: 'New Moon Keeper', count: 7, tier: 'gold', id: 'new_moon_keeper' }, { icon: '🔥🔥', name: 'First Week', count: null, tier: 'standard', id: 'streak_7' }, { icon: '🌱', name: 'First Steps', count: null, tier: 'standard', id: 'loyalty_3d' }],
    tomorrowKey: 'high_energy', tomorrowTop: 'Career', tomorrowLabel: 'High Energy',
    connectOnboardingDone: false,
    oracleCards: [
      { name: 'The Star',   icon: '🌑', message: "This marks the end of a cycle. What you release now makes room for what's next." },
      { name: 'The Path',   icon: '🌊', message: "Turn inward today. The answers you're looking for don't live outside right now." },
      { name: 'The Mirror', icon: '🌱', message: "Every New Moon is an invitation to begin. What one small thing do you want to grow?" },
    ],
  },
  {
    label: '⭐ Your Star Day',
    userName: 'Maya',
    vaara: 'Wednesday', tithi: 9, tithiName: 'Navami', nakshatra: 'Pushya',
    isPurnima: false, isAmavasya: false, isChaturdashi: false,
    isNakshatraBirthday: true, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: false, paksha: 'Shukla', timeOfDay: 'afternoon',
    scores: { love: 84, career: 88, health: 76, money: 80, social: 92, family: 78 },
    streak: 29, graceDay: false,
    vibeText: "The Moon has returned to Pushya — your birth nakshatra. This is your personal cosmic peak day. The alignment between your birth sky and today's sky activates a natural clarity and magnetism that few days can match.",
    doTips: [
      { text: "Celebrate your Star Day — do something meaningful for yourself",    tags: ["Star Day", "Nakshatra"] },
      { text: "Schedule the meeting or conversation you've been postponing",        tags: ["Career ↑", "Wednesday"] },
      { text: "Reach out to someone you've been meaning to reconnect with",         tags: ["Social ↑", "Love ↑"] },
    ],
    avoidTips: [
      { text: "Don't second-guess decisions you've already made well",              tags: ["Wednesday"] },
      { text: "Avoid overthinking future plans — presence beats planning today",   tags: ["Wednesday"] },
      { text: "Don't skip a planned commitment without notice",                     tags: ["Career ↑"] },
    ],
    badges: [{ icon: '⭐', name: 'Star Day', count: 12, tier: 'crown', id: 'star_day' }, { icon: '🌕', name: 'Full Cycle', count: null, tier: 'standard', id: 'streak_29' }, { icon: '✨', name: 'Three Moons', count: null, tier: 'standard', id: 'streak_90' }],
    tomorrowKey: 'venus_day', tomorrowTop: 'Love', tomorrowLabel: 'High Energy',
    connectOnboardingDone: true,
    matches: [
      { name: 'Jordan', avatar: '⭐', nakshatra: 'Pushya', score: 88, insight: "Same birth nakshatra energy today — you'll understand each other without many words." },
      { name: 'River',  avatar: '💛', nakshatra: 'Rohini', score: 74, insight: "Their Love is high and your Social peaks today — strong first-conversation energy." },
    ],
    oracleCards: [
      { name: 'The Star',   icon: '⭐', message: "Your birth sky is speaking today. Trust the clarity that comes without effort." },
      { name: 'The Path',   icon: '🌟', message: "This level of alignment is rare. Use it for something you'd normally hesitate on." },
      { name: 'The Mirror', icon: '🌙', message: "Not every day is this clear. Notice what you know with certainty right now." },
    ],
  },
  {
    label: '🔥 Mars Tuesday',
    userName: 'Lena',
    vaara: 'Tuesday', tithi: 3, tithiName: 'Tritiya', nakshatra: 'Ashwini',
    isPurnima: false, isAmavasya: false, isChaturdashi: false,
    isNakshatraBirthday: false, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: false, paksha: 'Shukla', timeOfDay: 'morning',
    scores: { love: 44, career: 86, health: 90, money: 58, social: 52, family: 40 },
    streak: 5, graceDay: true,
    vibeText: "Mars and Ashwini nakshatra combine to give you an unusual burst of physical and mental stamina this Tuesday. The first two hours of the day are your most powerful window — use them on the hardest thing on your list.",
    doTips: [
      { text: "Start the day with your most important task — energy is with you",   tags: ["Career ↑", "Tuesday"] },
      { text: "Commit to one physical challenge for the next 30 days — start today", tags: ["Health ↑", "Ashwini"] },
      { text: "Get outside for at least 30 minutes — sun energy is high",           tags: ["Health ↑", "Tuesday"] },
    ],
    avoidTips: [
      { text: "Avoid aggressive negotiations in love — conditions don't favour you", tags: ["Love ↓", "Tuesday"] },
      { text: "Don't force social plans on yourself — rest is more valuable tonight", tags: ["Tuesday"] },
      { text: "Skip the confrontation — it's not the right time or place",          tags: ["Love ↓"] },
    ],
    badges: [{ icon: '🔥', name: 'First Spark', count: null, tier: 'standard', id: 'streak_3' }, { icon: '🌱', name: 'First Steps', count: null, tier: 'standard', id: 'loyalty_3d' }],
    tomorrowKey: 'jupiter_day', tomorrowTop: 'Money', tomorrowLabel: 'High Energy',
    connectOnboardingDone: false,
    oracleCards: [
      { name: 'The Star',   icon: '🔥', message: "This burst of energy won't last. Use it before noon on the thing that matters most." },
      { name: 'The Path',   icon: '⚡', message: "Mars days reward action over planning. Stop preparing. Start." },
      { name: 'The Mirror', icon: '🌿', message: "Your body knows the right move before your mind does. Trust the first instinct." },
    ],
  },
  {
    label: '🌟 Rare Alignment',
    userName: 'Dev',
    vaara: 'Thursday', tithi: 13, tithiName: 'Trayodashi', nakshatra: 'Rohini',
    isPurnima: false, isAmavasya: false, isChaturdashi: false,
    isNakshatraBirthday: true, isTithiBirthday: true, isVaaraBirthday: true,
    starsAlign: true, isEclipse: false, paksha: 'Shukla', timeOfDay: 'afternoon',
    scores: { love: 98, career: 96, health: 94, money: 97, social: 95, family: 98 },
    streak: 365, graceDay: false,
    vibeText: "A rare triple alignment — your birth nakshatra, lunar day, and weekday all match today's sky simultaneously. This configuration appears only a handful of times in a lifetime. Every category is amplified. Move boldly.",
    doTips: [
      { text: "Share this rare alignment with someone close — it won't happen again for months", tags: ["Rare Alignment", "Love ↑"] },
      { text: "Use this rare alignment day for the decision you've been putting off",            tags: ["Rare Alignment", "Career ↑"] },
      { text: "Apply for the opportunity you've been researching",                               tags: ["Career ↑", "Money ↑"] },
    ],
    avoidTips: [
      { text: "Don't suppress a creative idea because it feels too bold — note it down",        tags: ["Rare Alignment"] },
      { text: "Avoid the temptation to take on more than you can finish",                       tags: ["Career ↑"] },
      { text: "Don't make your problems someone else's emergency",                              tags: ["Thursday"] },
    ],
    badges: [{ icon: '🌟', name: 'Rare Alignment', count: 2, tier: 'silver', id: 'rare_alignment' }, { icon: '🏆', name: 'Year of Stars', count: null, tier: 'crown', id: 'streak_365' }, { icon: '🌌', name: 'One Full Year', count: null, tier: 'standard', id: 'loyalty_365d' }],
    tomorrowKey: 'purnima', tomorrowTop: 'Love', tomorrowLabel: 'High Energy',
    connectOnboardingDone: true,
    matches: [
      { name: 'Aria',  avatar: '🌟', nakshatra: 'Rohini', score: 96, insight: "Both at peak energy today — one of the best compatibility windows of the month." },
      { name: 'Blake', avatar: '💫', nakshatra: 'Pushya', score: 89, insight: "Their Love aligns perfectly with yours today. Don't let this window close." },
      { name: 'Cyan',  avatar: '✨', nakshatra: 'Chitra', score: 78, insight: "High mutual career energy — expect interesting, fast conversation today." },
    ],
    oracleCards: [
      { name: 'The Star',   icon: '🌟', message: "This configuration appears only a few times in a lifetime. Whatever you're holding back — release it today." },
      { name: 'The Path',   icon: '🏆', message: "Rare days reveal rare truths. Pay attention to what feels obvious right now." },
      { name: 'The Mirror', icon: '🌌', message: "The universe doesn't give you a perfect alignment to do nothing with it. Move." },
    ],
  },
  {
    label: '🌙 Saturn Saturday',
    userName: 'Kate',
    vaara: 'Saturday', tithi: 11, tithiName: 'Ekadashi', nakshatra: 'Uttara Phalguni',
    isPurnima: false, isAmavasya: false, isChaturdashi: false,
    isNakshatraBirthday: false, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: false, paksha: 'Shukla', timeOfDay: 'evening',
    scores: { love: 34, career: 78, health: 50, money: 44, social: 30, family: 38 },
    streak: 90, graceDay: false,
    vibeText: "Saturn's discipline defines this Saturday. Career and structured effort are your allies today, while social and love energy stay quiet. An excellent day to finish something, release something, and prepare for the week.",
    doTips: [
      { text: "Tackle the task you've been avoiding most — today you have the energy", tags: ["Career ↑", "Saturday"] },
      { text: "Cancel subscriptions you haven't used in 30 days",                     tags: ["Saturday", "Career ↑"] },
      { text: "Clean and organize your workspace or home environment",                tags: ["Saturday"] },
    ],
    avoidTips: [
      { text: "Avoid dramatic conversations late at night — mornings are always clearer", tags: ["Love ↓", "Saturday"] },
      { text: "Don't force social plans on yourself — rest is more valuable tonight",    tags: ["Social ↓"] },
      { text: "Avoid comparing your progress to others — your path moves at its own speed", tags: ["Saturday"] },
    ],
    badges: [{ icon: '✨', name: 'Three Moons', count: null, tier: 'standard', id: 'streak_90' }, { icon: '🌲', name: 'Three Months', count: null, tier: 'standard', id: 'loyalty_90d' }, { icon: '🔥🔥', name: 'First Week', count: null, tier: 'standard', id: 'streak_7' }],
    tomorrowKey: 'moon_day', tomorrowTop: 'Family', tomorrowLabel: 'Moderate',
    connectOnboardingDone: true,
    matches: [
      { name: 'Quinn', avatar: '🌙', nakshatra: 'Hasta', score: 55, insight: "Both in a quiet energy today. Good for depth and honesty, not lightness." },
    ],
    oracleCards: [
      { name: 'The Star',   icon: '🔑', message: "Saturdays show you what's real. One honest look at something you've been avoiding." },
      { name: 'The Path',   icon: '📋', message: "Discipline is its own kind of freedom. Finish one thing today — just one." },
      { name: 'The Mirror', icon: '🌘', message: "Not every day is meant to be peak. This one is for building, not shining." },
    ],
  },
  {
    label: '☀️ Sun Sunday',
    userName: 'Leo',
    vaara: 'Sunday', tithi: 6, tithiName: 'Shashthi', nakshatra: 'Hasta',
    isPurnima: false, isAmavasya: false, isChaturdashi: false,
    isNakshatraBirthday: false, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: false, paksha: 'Shukla', timeOfDay: 'morning',
    scores: { love: 62, career: 58, health: 88, money: 64, social: 70, family: 60 },
    streak: 21, graceDay: false,
    vibeText: "The Sun shines clearly through Hasta nakshatra — a skilled, practical energy. Your health and vitality peak this morning. Use the energy for physical activity, self-care, and preparing your intentions for the week.",
    doTips: [
      { text: "Get outside for at least 30 minutes — sun energy is high",           tags: ["Health ↑", "Sunday"] },
      { text: "Start a new physical habit today — momentum is on your side",        tags: ["Health ↑", "Shukla"] },
      { text: "Write down three things you're grateful for this morning",            tags: ["Sunday", "Hasta"] },
    ],
    avoidTips: [
      { text: "Don't skip your meals to power through work",                         tags: ["Health ↑"] },
      { text: "Avoid mindless scrolling when you should be resting",                tags: ["Sunday"] },
      { text: "Skip the self-criticism spiral — it changes nothing and drains everything", tags: ["Sunday"] },
    ],
    badges: [{ icon: '☀️', name: 'Solstice Keeper', count: 2, tier: 'silver', id: 'solar_event' }, { icon: '🔥🔥', name: 'First Week', count: null, tier: 'standard', id: 'streak_7' }, { icon: '🌿', name: 'One Week', count: null, tier: 'standard', id: 'loyalty_7d' }],
    tomorrowKey: 'default', tomorrowTop: 'Career', tomorrowLabel: 'High Energy',
    connectOnboardingDone: false,
    oracleCards: [
      { name: 'The Star',   icon: '☀️', message: "Sundays in Hasta nakshatra are for craft. Make something today — anything." },
      { name: 'The Path',   icon: '🌿', message: "Physical energy peaks this morning. Don't waste it sitting still." },
      { name: 'The Mirror', icon: '🌅', message: "The week begins again tomorrow. How do you want to feel at the start of it?" },
    ],
  },
  {
    label: '🧠 Mercury Wednesday',
    userName: 'Priya',
    vaara: 'Wednesday', tithi: 7, tithiName: 'Saptami', nakshatra: 'Chitra',
    isPurnima: false, isAmavasya: false, isChaturdashi: false,
    isNakshatraBirthday: false, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: false, paksha: 'Shukla', timeOfDay: 'afternoon',
    scores: { love: 66, career: 90, health: 60, money: 72, social: 86, family: 58 },
    streak: 12, graceDay: false,
    vibeText: "Mercury sharpens everything on Chitra nakshatra — precision, beauty, and sharp communication are your gifts today. Your career and social energy peak simultaneously. A well-crafted message today could open something significant.",
    doTips: [
      { text: "Pitch your idea today — your words carry extra clarity",             tags: ["Career ↑", "Social ↑"] },
      { text: "Block 2 hours of deep, uninterrupted work this morning",             tags: ["Career ↑", "Wednesday"] },
      { text: "Reply to messages you've been sitting on",                           tags: ["Social ↑", "Chitra"] },
    ],
    avoidTips: [
      { text: "Don't send that critical email before rereading it twice",           tags: ["Wednesday"] },
      { text: "Avoid multitasking — scattered focus will cost you more than it saves", tags: ["Career ↑"] },
      { text: "Don't suppress a creative idea because it feels too bold",           tags: ["Chitra", "Wednesday"] },
    ],
    badges: [{ icon: '💫', name: 'First Connection', count: null, tier: 'standard', id: 'first_match' }, { icon: '📲', name: 'Sky Sharer', count: 4, tier: 'standard', id: 'shared_today' }, { icon: '🌙', name: 'Moonwalker', count: null, tier: 'standard', id: 'streak_14' }],
    tomorrowKey: 'jupiter_day', tomorrowTop: 'Money', tomorrowLabel: 'High Energy',
    connectOnboardingDone: true,
    matches: [
      { name: 'Alex',  avatar: '🧠', nakshatra: 'Chitra',     score: 84, insight: "Both Mercury-strong today — expect witty, fast-moving conversation." },
      { name: 'Jamie', avatar: '💬', nakshatra: 'Mrigashira', score: 70, insight: "Their Social is high and you're sharp today — a good match window." },
    ],
    oracleCards: [
      { name: 'The Star',   icon: '💬', message: "The right words are available to you today. Use them on something that matters." },
      { name: 'The Path',   icon: '🧠', message: "Mercury Wednesdays are for strategy. Lay out the plan you've been carrying in your head." },
      { name: 'The Mirror', icon: '✦',  message: "One well-placed message today could open a door that stays open for months." },
    ],
  },
  {
    label: '💛 Venus Friday',
    userName: 'Nina',
    vaara: 'Friday', tithi: 5, tithiName: 'Panchami', nakshatra: 'Rohini',
    isPurnima: false, isAmavasya: false, isChaturdashi: false,
    isNakshatraBirthday: false, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: false, paksha: 'Shukla', timeOfDay: 'evening',
    scores: { love: 95, career: 60, health: 72, money: 74, social: 88, family: 70 },
    streak: 33, graceDay: false,
    vibeText: "Rohini nakshatra is the most romantic star in the Vedic sky — and today it falls on Venus's own day. Love and beauty are supercharged. This is not a day to work late. Make a plan for the evening.",
    doTips: [
      { text: "Plan a date or quality time with your partner today",                tags: ["Love ↑", "Friday"] },
      { text: "Treat yourself to something beautiful today",                        tags: ["Friday", "Rohini"] },
      { text: "Start the creative project you've been sketching in your head",      tags: ["Love ↑", "Social ↑"] },
    ],
    avoidTips: [
      { text: "Don't skip family commitments for social plans tonight",             tags: ["Friday", "Love ↑"] },
      { text: "Avoid bringing up old arguments — energy today amplifies conflict",  tags: ["Love ↑", "Friday"] },
      { text: "Don't make assumptions about others' feelings — ask instead",        tags: ["Love ↑"] },
    ],
    badges: [{ icon: '💛', name: 'Venus Evening', count: 5, tier: 'gold', id: 'full_moon_witness' }, { icon: '💫💫', name: 'Rising Star', count: null, tier: 'standard', id: 'five_matches' }, { icon: '🌕', name: 'Full Cycle', count: null, tier: 'standard', id: 'streak_29' }],
    tomorrowKey: 'default', tomorrowTop: 'Love', tomorrowLabel: 'Moderate',
    connectOnboardingDone: true,
    matches: [
      { name: 'Theo',  avatar: '💛', nakshatra: 'Rohini',   score: 95, insight: "Rohini on Venus day is the most romantic window of the month. Don't let it pass." },
      { name: 'Sasha', avatar: '🌹', nakshatra: 'Anuradha', score: 80, insight: "Both in Love ↑ — strong mutual pull today. Reach out before the energy shifts." },
    ],
    oracleCards: [
      { name: 'The Star',   icon: '💛', message: "This is the best day this week to let yourself be seen. Show up fully." },
      { name: 'The Path',   icon: '🌹', message: "Venus evenings carry a softness that's rare. Let yourself feel it tonight." },
      { name: 'The Mirror', icon: '✨', message: "The person you've been thinking about — they're worth the reach. Tonight is right." },
    ],
  },
  {
    label: '🌒 Eclipse Day',
    userName: 'Ravi',
    vaara: 'Tuesday', tithi: 14, tithiName: 'Chaturdashi', nakshatra: 'Jyeshtha',
    isPurnima: false, isAmavasya: false, isChaturdashi: true,
    isNakshatraBirthday: false, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: true, paksha: 'Krishna', timeOfDay: 'afternoon',
    scores: { love: 30, career: 40, health: 35, money: 28, social: 32, family: 38 },
    streak: 3, graceDay: true,
    vibeText: "A lunar eclipse on Chaturdashi — Jyeshtha nakshatra intensifies everything it touches. This is not a day for action; it is a day for observation and quiet. The disruption you feel today is clearing space for what comes next.",
    doTips: [
      { text: "Do a breathing or meditation session today — even 10 minutes",       tags: ["Eclipse", "Waning Moon"] },
      { text: "Journal about your emotional journey on this day",                   tags: ["Eclipse", "Chaturdashi"] },
      { text: "Practice saying no to one thing that drains your energy",            tags: ["Waning Moon"] },
    ],
    avoidTips: [
      { text: "Avoid all major decisions today — tomorrow's energy is significantly clearer", tags: ["Eclipse", "Chaturdashi"] },
      { text: "Don't confront difficult people today — wait for the moon to shift",          tags: ["Eclipse", "Waning Moon"] },
      { text: "Skip risky or extreme activities today — this is a high-tension tithi",      tags: ["Chaturdashi"] },
    ],
    badges: [{ icon: '🌒', name: 'Eclipse Chaser', count: 1, tier: 'silver', id: 'eclipse_chaser' }, { icon: '🔥', name: 'First Spark', count: null, tier: 'standard', id: 'streak_3' }],
    tomorrowKey: 'amavasya', tomorrowTop: 'Health', tomorrowLabel: 'Low Energy',
    connectOnboardingDone: true,
    matches: [
      { name: 'Morgan', avatar: '🌒', nakshatra: 'Anuradha', score: 42, insight: "Eclipse energy is disruptive for both — don't read too much into today's dynamic." },
    ],
    oracleCards: [
      { name: 'The Star',   icon: '🌒', message: "Eclipse days reveal what's hidden. Watch, don't act." },
      { name: 'The Path',   icon: '🌑', message: "What's disrupted today is being cleared. Trust the disruption." },
      { name: 'The Mirror', icon: '🔮', message: "Sometimes clarity comes through confusion. Sit with it — it won't last." },
    ],
  },
]

// ── State ────────────────────────────────────────────────────────────────────

const scenarioIdx   = ref(0)
const expandedCat   = ref(null)
const showModal     = ref(false)
const modalCategory = ref('Cosmic Events')
const reflection    = ref('')
const reflectionSaved = ref(false)
const intention     = ref('')
const intentionSaved = ref(false)
const oraclePickedIdx = ref(null)
const checkinMood     = ref(null)
const matchExpanded   = ref(null)
const expandedWindow  = ref(null)
const starQuestion    = ref('')
const starAnswering   = ref(false)
const starAnswerShown = ref(false)
const diceRolled      = ref(false)
const diceRolling     = ref(false)
const diceDisplayNum  = ref(null)
const pullRevealed    = ref({ morning: false, afternoon: false, evening: false })

const s = computed(() => SCENARIOS[scenarioIdx.value])
const bgKey = computed(() => resolveBackground(s.value))
const headline = computed(() => resolveHeadline(s.value))
const bg = computed(() => BG[bgKey.value] || BG.clear_sky)
const tint = computed(() => TIME_TINT[s.value.timeOfDay])

const avgScore = computed(() =>
  Math.round(Object.values(s.value.scores).reduce((a, b) => a + b, 0) / 6)
)

const socialProofText = computed(() => {
  const avg = avgScore.value
  const base = avg >= 75 ? 8400 + s.value.tithi * 187
             : avg >= 50 ? 14200 + s.value.tithi * 231
             : 4100 + s.value.tithi * 93
  const n = base.toLocaleString('en')
  const lbl = avg >= 75 ? 'High Energy' : avg >= 50 ? 'flowing' : 'quiet'
  return `🌍 ${n} people are having a ${lbl} day today`
})

const powerWindows = computed(() => POWER_WINDOWS[s.value.vaara] || POWER_WINDOWS.Sunday)

const starAnswerIdx = computed(() => {
  const nIdx = Math.max(0, NAKSHATRA_LIST.indexOf(s.value.nakshatra))
  return (nIdx * 3 + s.value.tithi) % STAR_ANSWERS.length
})

const bodyMapEntry = computed(() => {
  const found = BODY_MAP.find(e => e.nakshatra === s.value.nakshatra)
  return found || BODY_MAP[7] // default Pushya
})

const cosmicNumber = computed(() => {
  const nIdx = Math.max(0, NAKSHATRA_LIST.indexOf(s.value.nakshatra))
  return ((nIdx + s.value.tithi - 1) % 9) + 1
})

const cosmicNumberData = computed(() => VEDIC_NUMBERS[cosmicNumber.value - 1])

const pullCardFor = computed(() => (slot) => {
  const nIdx = Math.max(0, NAKSHATRA_LIST.indexOf(s.value.nakshatra))
  const slotIdx = { morning: 0, afternoon: 1, evening: 2 }[slot] || 0
  const cardIdx = (nIdx * 3 + slotIdx) % PULL_BANK.length
  const card = PULL_BANK[cardIdx]
  return { ...card, ...PULL_QUALITIES[card.q] }
})

const availablePullSlots = computed(() => {
  const t = s.value.timeOfDay
  if (t === 'morning')   return ['morning']
  if (t === 'afternoon') return ['morning', 'afternoon']
  return ['morning', 'afternoon', 'evening']
})

const lunarPct = computed(() => Math.min((s.value.tithi / 29) * 100, 100))
const RING_C = 201.1
const ringOffset = computed(() => RING_C * (1 - lunarPct.value / 100))
const ringColor = computed(() => {
  if (s.value.isPurnima) return '#c8d0ff'
  if (lunarPct.value > 70) return 'rgba(220,228,255,0.9)'
  if (lunarPct.value > 40) return 'rgba(180,190,255,0.8)'
  return 'rgba(140,150,220,0.7)'
})

const last9 = computed(() =>
  Array.from({ length: 9 }, (_, i) => {
    const t = ((s.value.tithi - (8 - i) - 1 + 30) % 30) + 1
    return getMoonIcon(t)
  })
)

const greeting = computed(() => {
  if (s.value.timeOfDay === 'morning')   return 'Good morning'
  if (s.value.timeOfDay === 'afternoon') return 'Good afternoon'
  return 'Good evening'
})

const infoLine = computed(() => {
  const phase = moonPhaseLabel(s.value.tithi)
  const toFull = 15 - s.value.tithi
  const toNew  = 30 - s.value.tithi
  let cd = ''
  if (toFull === 1) cd = ' · Full Moon tomorrow 🌕'
  else if (toFull > 1 && toFull <= 3) cd = ` · Full Moon in ${toFull} days`
  else if (!cd && toNew === 1) cd = ' · New Moon tomorrow 🌑'
  else if (!cd && toNew > 1 && toNew <= 3) cd = ` · New Moon in ${toNew} days`
  return `${s.value.vaara} · ${phase}${cd}`
})

const yourDaySlots = computed(() => {
  const band = avgScore.value >= 71 ? 'high' : avgScore.value >= 41 ? 'moderate' : 'low'
  const day = YOUR_DAY[s.value.vaara] || YOUR_DAY.Sunday
  return [
    { slot: 'Morning',   icon: '🌅', time: 'until 12:00',   text: day.Morning[band],   active: s.value.timeOfDay === 'morning' },
    { slot: 'Afternoon', icon: '☀️',  time: '12:00 – 19:00', text: day.Afternoon[band], active: s.value.timeOfDay === 'afternoon' },
    { slot: 'Evening',   icon: '🌆', time: 'after 19:00',   text: day.Evening[band],   active: s.value.timeOfDay === 'evening' },
  ]
})

const tomorrowCard = computed(() => {
  const t = TOMORROW[s.value.tomorrowKey] || TOMORROW.default
  return {
    ...t,
    headline: t.headline.replace('{label}', s.value.tomorrowLabel),
    body: t.body.replace('{top}', s.value.tomorrowTop),
  }
})

const todayDate = computed(() =>
  new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })
)

// Earned badge IDs (computed from streak + special flags)
const earnedIds = computed(() => {
  const ids = new Set(s.value.badges.map(b => b.id).filter(Boolean))
  if (s.value.streak >= 3)   ids.add('streak_3')
  if (s.value.streak >= 7)   ids.add('streak_7')
  if (s.value.streak >= 14)  ids.add('streak_14')
  if (s.value.streak >= 29)  ids.add('streak_29')
  if (s.value.streak >= 90)  ids.add('streak_90')
  if (s.value.streak >= 180) ids.add('streak_180')
  if (s.value.streak >= 365) ids.add('streak_365')
  if (s.value.isPurnima)     ids.add('full_moon_witness')
  if (s.value.isAmavasya)    ids.add('new_moon_keeper')
  if (s.value.isNakshatraBirthday) ids.add('star_day')
  if (s.value.starsAlign)    ids.add('rare_alignment')
  if (s.value.isEclipse)     ids.add('eclipse_chaser')
  ids.add('loyalty_3d')
  ids.add('loyalty_7d')
  return ids
})

const modalBadges = computed(() =>
  ALL_BADGES.filter(b => b.category === modalCategory.value)
)

function resetInteractive() {
  expandedCat.value    = null
  reflection.value     = ''
  intention.value      = ''
  reflectionSaved.value = false
  intentionSaved.value  = false
  oraclePickedIdx.value = null
  checkinMood.value     = null
  matchExpanded.value   = null
  expandedWindow.value  = null
  starQuestion.value    = ''
  starAnswering.value   = false
  starAnswerShown.value = false
  diceRolled.value      = false
  diceRolling.value     = false
  diceDisplayNum.value  = null
  pullRevealed.value    = { morning: false, afternoon: false, evening: false }
}

function rollDice() {
  if (diceRolled.value || diceRolling.value) return
  diceRolling.value = true
  diceDisplayNum.value = 1
  let frame = 0
  const frames = 12
  const interval = setInterval(() => {
    diceDisplayNum.value = (frame % 9) + 1
    frame++
    if (frame >= frames) {
      clearInterval(interval)
      setTimeout(() => {
        diceDisplayNum.value = cosmicNumber.value
        diceRolling.value = false
        diceRolled.value  = true
      }, 200)
    }
  }, 60)
}

function revealPull(slot) {
  pullRevealed.value = { ...pullRevealed.value, [slot]: true }
}

function submitStarQuestion() {
  if (!starQuestion.value.trim() || starAnswering.value || starAnswerShown.value) return
  starAnswering.value = true
  setTimeout(() => {
    starAnswering.value   = false
    starAnswerShown.value = true
  }, 1700)
}

function step(dir) {
  scenarioIdx.value = (scenarioIdx.value + dir + SCENARIOS.length) % SCENARIOS.length
  resetInteractive()
}

function randomize() {
  const prev = scenarioIdx.value
  let next = prev
  while (next === prev && SCENARIOS.length > 1) next = Math.floor(Math.random() * SCENARIOS.length)
  scenarioIdx.value = next
  resetInteractive()
}

function toggleCat(key) {
  expandedCat.value = expandedCat.value === key ? null : key
}

function catBand(key) {
  const score = s.value.scores[key]
  return score >= 71 ? 'high' : score >= 41 ? 'moderate' : 'low'
}

function saveReflection() {
  if (!reflection.value.trim()) return
  reflectionSaved.value = true
}

function saveIntention() {
  if (!intention.value.trim()) return
  intentionSaved.value = true
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
      <span class="meta-chip" :style="{ color: s.connectOnboardingDone ? 'rgba(74,222,128,0.8)' : 'rgba(251,191,36,0.8)' }">
        {{ s.connectOnboardingDone ? '🤝 Connect done' : '⚠️ Connect not set up' }}
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
                <button class="modal-close" @click="showModal = false">✕</button>
              </div>

              <!-- Category tabs -->
              <div class="modal-tabs">
                <button
                  v-for="cat in BADGE_CATEGORIES"
                  :key="cat"
                  class="modal-tab"
                  :class="{ 'modal-tab--active': modalCategory === cat }"
                  @click="modalCategory = cat"
                >{{ cat }}</button>
              </div>

              <!-- Badge list -->
              <div class="modal-badges">
                <div
                  v-for="badge in modalBadges"
                  :key="badge.id"
                  class="modal-badge-row"
                  :class="{ 'modal-badge-row--locked': !earnedIds.has(badge.id) }"
                >
                  <span class="modal-badge-icon">{{ badge.icon }}</span>
                  <div class="modal-badge-info">
                    <p class="modal-badge-name">{{ badge.name }}</p>
                    <p class="modal-badge-desc">{{ badge.desc }}</p>
                  </div>
                  <span v-if="earnedIds.has(badge.id)" class="modal-earned">✓</span>
                  <span v-else class="modal-locked">🔒</span>
                </div>
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
              <span v-if="s.graceDay" class="grace-pill" title="Streak protected">🛡️</span>
              <span class="streak-pill">🔥 {{ s.streak }}-day</span>
              <span class="notif-btn">🔔</span>
            </div>
          </header>

          <!-- ── Block 1: Day Headline ── -->
          <div class="headline-card glass">
            <div class="headline-icon-wrap">
              <span class="headline-big-icon">{{ headline.icon }}</span>
            </div>
            <h1 class="headline-title">{{ headline.type }}</h1>
            <p class="headline-sub">{{ headline.sub }}</p>
            <div class="info-pill">{{ infoLine }}</div>
            <p class="social-proof">{{ socialProofText }}</p>
          </div>
          <!-- ── Block 2: Energy ── -->
          <section class="section">
            <p class="sec-label">TODAY'S ENERGY</p>
            <div class="energy-grid">
              <div
                v-for="cat in CATS"
                :key="cat.key"
                class="cat-card glass-sm"
                :class="{ 'cat-expanded': expandedCat === cat.key }"
                @click="toggleCat(cat.key)"
              >
                <div class="cat-row">
                  <span class="cat-icon">{{ cat.icon }}</span>
                  <span class="cat-name">{{ cat.label }}</span>
                  <span class="cat-pct" :style="{ color: energyColor(s.scores[cat.key]) }">
                    {{ s.scores[cat.key] }}%
                  </span>
                </div>
                <div class="cat-bar-track">
                  <div
                    class="cat-bar-fill"
                    :style="{ width: s.scores[cat.key] + '%', background: energyColor(s.scores[cat.key]) }"
                  />
                </div>
                <p class="cat-label-text" :style="{ color: energyColor(s.scores[cat.key]) }">
                  {{ energyLabel(s.scores[cat.key]) }}
                </p>
                <transition name="expand">
                  <div v-if="expandedCat === cat.key" class="cat-detail">
                    <p class="cat-detail-tag">{{ cat.planet }} · {{ cat.house }} house</p>
                    <p class="cat-detail-text">{{ CAT_TEXT[cat.key][catBand(cat.key)] }}</p>
                  </div>
                </transition>
              </div>
            </div>
            <p class="tap-hint">Tap a category for planetary context</p>
          </section>

          <!-- ── Block I: Energy Check-In ── -->
          <section class="section">
            <p class="sec-label">HOW ARE YOU ACTUALLY FEELING?</p>
            <div class="checkin-card glass">
              <p class="checkin-question">
                The stars say
                <span :style="{ color: energyColor(avgScore), fontWeight: 700 }">{{ energyLabel(avgScore) }}</span>
                for you today.
              </p>
              <div v-if="!checkinMood" class="mood-row">
                <button
                  v-for="mood in MOODS"
                  :key="mood.key"
                  class="mood-btn"
                  @click="checkinMood = mood.key"
                >
                  <span class="mood-icon">{{ mood.icon }}</span>
                  <span class="mood-label">{{ mood.label }}</span>
                </button>
              </div>
              <div v-else class="checkin-result">
                <div class="checkin-picked">
                  <span class="checkin-picked-icon">{{ MOODS.find(m => m.key === checkinMood)?.icon }}</span>
                  <span class="checkin-picked-label">{{ MOODS.find(m => m.key === checkinMood)?.label }}</span>
                  <button class="checkin-reset" @click="checkinMood = null">↩</button>
                </div>
                <div class="checkin-outcome">
                  <p class="outcome-label">{{ checkinResult(avgScore, checkinMood).label }}</p>
                  <p class="outcome-sub">{{ checkinResult(avgScore, checkinMood).sub }}</p>
                </div>
                <p class="checkin-accuracy">Building your accuracy score · {{ s.streak }} days tracked</p>
              </div>
            </div>
          </section>

          <!-- ── Block 3: Do / Avoid ── -->
          <section class="section">
            <p class="sec-label">DO / AVOID</p>
            <div class="do-avoid glass">
              <div class="da-col">
                <p class="da-head do-head">✅  DO</p>
                <ul class="da-list">
                  <li v-for="tip in s.doTips" :key="tip.text" class="da-item">
                    <p class="da-text">{{ tip.text }}</p>
                    <div class="tip-tags">
                      <span v-for="tag in tip.tags" :key="tag" class="tip-tag tip-tag--do">{{ tag }}</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="da-sep" />
              <div class="da-col">
                <p class="da-head avoid-head">⚡  AVOID</p>
                <ul class="da-list">
                  <li v-for="tip in s.avoidTips" :key="tip.text" class="da-item">
                    <p class="da-text">{{ tip.text }}</p>
                    <div class="tip-tags">
                      <span v-for="tag in tip.tags" :key="tag" class="tip-tag tip-tag--avoid">{{ tag }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <button class="share-btn">📲  Share card · #Bisou</button>
          </section>

          <!-- ── Block VIII: Daily Cosmic Pull ── -->
          <section class="section">
            <p class="sec-label">DAILY COSMIC PULL</p>
            <p class="pull-sub">{{ availablePullSlots.length }} of 3 pulls available today</p>
            <div class="pull-slots">
              <div
                v-for="slot in ['morning','afternoon','evening']"
                :key="slot"
                class="pull-slot"
                :class="{ 'pull-slot--locked': !availablePullSlots.includes(slot), 'pull-slot--revealed': pullRevealed[slot] }"
              >
                <template v-if="pullRevealed[slot]">
                  <div class="pull-card-face" :style="{ borderColor: pullCardFor(slot).color }">
                    <span class="pull-quality-symbol">{{ pullCardFor(slot).symbol }}</span>
                    <p class="pull-quality-name" :style="{ color: pullCardFor(slot).color }">{{ pullCardFor(slot).quality.toUpperCase() }}</p>
                    <p class="pull-msg">{{ pullCardFor(slot).msg }}</p>
                    <p class="pull-attr">{{ s.nakshatra }} · {{ slot.charAt(0).toUpperCase() + slot.slice(1) }}</p>
                  </div>
                </template>
                <template v-else-if="availablePullSlots.includes(slot)">
                  <div class="pull-card-back" @click="revealPull(slot)">
                    <span class="pull-back-symbol">✦</span>
                    <p class="pull-back-label">{{ slot.charAt(0).toUpperCase() + slot.slice(1) }} pull</p>
                    <p class="pull-back-hint">Tap to reveal</p>
                  </div>
                </template>
                <template v-else>
                  <div class="pull-card-locked">
                    <span class="pull-lock-icon">🔒</span>
                    <p class="pull-lock-label">{{ slot.charAt(0).toUpperCase() + slot.slice(1) }}</p>
                    <p class="pull-lock-time">{{ slot === 'afternoon' ? 'Opens at noon' : 'Opens at 6 PM' }}</p>
                  </div>
                </template>
              </div>
            </div>
          </section>

          <!-- ── Block 4: Today's Vibe ── -->
          <section class="section">
            <p class="sec-label">TODAY'S VIBE</p>
            <div class="vibe-card glass">
              <p class="vibe-text">{{ s.vibeText }}</p>
              <p class="vibe-foot">✦ AI · refreshes at midnight</p>
            </div>
          </section>

          <!-- ── Block 5: Your Day ── -->
          <section class="section">
            <p class="sec-label">YOUR DAY IN THREE PARTS</p>
            <div class="your-day">
              <div
                v-for="slot in yourDaySlots"
                :key="slot.slot"
                class="day-slot"
                :class="{ 'day-slot--now': slot.active }"
              >
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


          <!-- ── Block IV: Power Windows ── -->
          <section class="section">
            <p class="sec-label">POWER WINDOWS</p>
            <p class="pw-sub">{{ s.vaara }}'s key windows · tap any to see why</p>
            <div class="pw-list">
              <div
                v-for="(w, i) in powerWindows"
                :key="i"
                class="pw-row"
                :class="[`pw-${w.quality}`, { 'pw-now': w.slot === s.timeOfDay, 'pw-open': expandedWindow === i }]"
                @click="expandedWindow = expandedWindow === i ? null : i"
              >
                <div class="pw-head">
                  <span class="pw-icon">{{ w.icon }}</span>
                  <div class="pw-center">
                    <p class="pw-title">{{ w.title }}</p>
                    <p class="pw-time">{{ w.time }}</p>
                  </div>
                  <div class="pw-badge-wrap">
                    <span v-if="w.slot === s.timeOfDay" class="pw-now-tag">Now</span>
                    <span class="pw-quality-dot" :class="`dot-${w.quality}`" />
                  </div>
                </div>
                <transition name="expand">
                  <p v-if="expandedWindow === i" class="pw-hint">{{ w.hint }}</p>
                </transition>
              </div>
            </div>
          </section>

          <!-- ── Block VI: Cosmic Body Map ── -->
          <section class="section">
            <p class="sec-label">TODAY'S BODY FOCUS</p>
            <div class="body-map-card glass">
              <div class="body-map-icon-wrap">
                <span class="body-map-big-icon">{{ bodyMapEntry.icon }}</span>
                <span class="body-map-nakshatra">{{ s.nakshatra }}</span>
              </div>
              <div class="body-map-content">
                <p class="body-map-area">{{ bodyMapEntry.area }}</p>
                <p class="body-map-tip">{{ bodyMapEntry.tip }}</p>
              </div>
            </div>
          </section>

          <!-- ── Block II: Daily Oracle ── -->
          <section class="section">
            <p class="sec-label">TODAY'S ORACLE</p>
            <p class="oracle-sub">{{ s.nakshatra }} nakshatra speaks — choose a card</p>
            <div class="oracle-row">
              <div
                v-for="(card, i) in s.oracleCards"
                :key="i"
                class="oracle-card"
                :class="{
                  'oracle-card--flipped': oraclePickedIdx === i,
                  'oracle-card--faded':   oraclePickedIdx !== null && oraclePickedIdx !== i,
                }"
                @click="oraclePickedIdx === null && (oraclePickedIdx = i)"
              >
                <div class="oracle-inner">
                  <div class="oracle-face oracle-back">
                    <div class="oracle-back-symbol">✦</div>
                    <p class="oracle-back-name">{{ card.name }}</p>
                  </div>
                  <div class="oracle-face oracle-front">
                    <p class="oracle-front-icon">{{ card.icon }}</p>
                    <p class="oracle-front-msg">{{ card.message }}</p>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="oraclePickedIdx === null" class="oracle-hint">Tap a card to reveal today's message</p>
            <p v-else class="oracle-hint oracle-hint--done">✓ Your message for today</p>
          </section>

          <!-- ── Block 6: Moon Streak ── -->
          <section class="section">
            <p class="sec-label">MOON STREAK</p>
            <div class="moon-card glass">
              <div class="moon-top">
                <div class="ring-wrap">
                  <svg viewBox="0 0 80 80" class="ring-svg">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="5"/>
                    <circle
                      cx="40" cy="40" r="32" fill="none"
                      :stroke="ringColor" stroke-width="5"
                      :stroke-dasharray="RING_C"
                      :stroke-dashoffset="ringOffset"
                      stroke-linecap="round"
                      transform="rotate(-90 40 40)"
                      style="transition: stroke-dashoffset 0.7s ease"
                    />
                    <text x="40" y="37" text-anchor="middle" fill="white" font-size="14" font-weight="700" font-family="Inter,sans-serif">{{ s.tithi }}</text>
                    <text x="40" y="50" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="7" font-family="Inter,sans-serif">of 30</text>
                  </svg>
                  <p class="ring-phase">{{ getMoonIcon(s.tithi) }}</p>
                </div>

                <div class="streak-info">
                  <div class="streak-row">
                    <p class="streak-big">🔥 {{ s.streak }}</p>
                    <span v-if="s.graceDay" class="grace-tag">🛡️ Protected</span>
                  </div>
                  <p class="streak-sub">day streak</p>
                  <p class="streak-phase">{{ moonPhaseLabel(s.tithi) }}</p>
                  <p class="streak-phase">Day {{ s.tithi }} of lunar cycle</p>
                </div>
              </div>

              <div class="moon-strip">
                <span v-for="(icon, i) in last9" :key="i" class="moon-dot" :class="{ 'moon-dot--today': i === 8 }">{{ icon }}</span>
              </div>
              <p class="strip-caption">Last 9 days</p>

              <div class="streak-goal">
                <template v-if="s.streak < 7"><span>{{ 7 - s.streak }} days to unlock 🔥🔥 First Week</span></template>
                <template v-else-if="s.streak < 14"><span>{{ 14 - s.streak }} days to unlock 🌙 Moonwalker</span></template>
                <template v-else-if="s.streak < 29"><span>{{ 29 - s.streak }} days to Full Lunar Cycle 🌕</span></template>
                <template v-else-if="s.streak < 90"><span>{{ 90 - s.streak }} days to Three Moons ✨</span></template>
                <template v-else><span>✨ {{ s.streak }}-day streak — legendary</span></template>
              </div>

              <p v-if="s.graceDay" class="grace-note">
                🛡️ Your streak was protected yesterday. One grace day used this week.
              </p>
            </div>
          </section>

          <!-- ── Block 7: Achievements ── -->
          <section class="section">
            <div class="section-head-row">
              <p class="sec-label" style="margin-bottom:0">ACHIEVEMENTS</p>
              <button class="view-all" @click="showModal = true">View all →</button>
            </div>
            <div class="badges-row">
              <div
                v-for="badge in s.badges"
                :key="badge.name"
                class="badge-chip"
                :class="`tier-${badge.tier}`"
              >
                <span class="badge-ic">{{ badge.icon }}</span>
                <div class="badge-txt">
                  <p class="badge-name">{{ badge.name }}</p>
                  <p v-if="badge.count" class="badge-count">×{{ badge.count }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- ── Block III: Compatibility Pulse ── -->
          <section class="section">
            <p class="sec-label">TODAY'S COMPATIBILITY</p>

            <!-- Connect onboarding not completed -->
            <div v-if="!s.connectOnboardingDone" class="connect-cta glass">
              <div class="cta-icon">💫</div>
              <div class="cta-body">
                <p class="cta-title">See your energy match with your connections today</p>
                <p class="cta-sub">Compatibility changes every day based on your astrological alignment. Complete your Connect profile to unlock it.</p>
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
                @click="matchExpanded = matchExpanded === i ? null : i"
              >
                <div class="compat-row">
                  <span class="match-avatar">{{ match.avatar }}</span>
                  <div class="match-info">
                    <p class="match-name">{{ match.name }}</p>
                    <p class="match-nakshatra">{{ match.nakshatra }}</p>
                  </div>
                  <div class="match-score-wrap">
                    <p class="match-score" :style="{ color: compColor(match.score) }">{{ match.score }}%</p>
                    <p class="match-score-label" :style="{ color: compColor(match.score) }">{{ compLabel(match.score) }}</p>
                  </div>
                </div>
                <transition name="expand">
                  <p v-if="matchExpanded === i" class="match-insight">{{ match.insight }}</p>
                </transition>
              </div>
              <p class="compat-hint">Tap a match to see today's insight</p>
            </div>
          </section>

          <!-- ── Reflect on Today ── -->
          <section class="section">
            <p class="sec-label">REFLECT ON TODAY</p>
            <div class="journal-card glass">
              <p class="journal-prompt">How did your day actually go?</p>
              <textarea
                v-if="!reflectionSaved"
                v-model="reflection"
                class="journal-input"
                placeholder="What happened, what surprised you, what felt right…"
                rows="3"
              />
              <div v-else class="journal-saved">
                <span class="saved-icon">✓</span>
                <p class="saved-text">{{ reflection }}</p>
              </div>
              <button
                v-if="!reflectionSaved"
                class="journal-btn"
                :disabled="!reflection.trim()"
                @click="saveReflection"
              >Save reflection</button>
            </div>
          </section>

          <!-- ── Block V: Ask the Stars ── -->
          <section class="section">
            <p class="sec-label">ASK THE STARS</p>
            <div class="stars-card glass">
              <template v-if="!starAnswerShown && !starAnswering">
                <p class="stars-prompt">What's on your mind today?</p>
                <p class="stars-hint-text">Type your question — the stars will answer based on today's sky</p>
                <textarea
                  v-model="starQuestion"
                  class="journal-input stars-input"
                  placeholder="Should I take this opportunity? Is now the right time? What do I need to know?"
                  rows="2"
                  @keydown.enter.prevent="submitStarQuestion"
                />
                <button
                  class="stars-btn"
                  :disabled="!starQuestion.trim()"
                  @click="submitStarQuestion"
                >Ask the stars →</button>
              </template>

              <!-- Asking animation -->
              <div v-else-if="starAnswering" class="stars-asking">
                <div class="stars-orb">
                  <span class="stars-orb-icon">✦</span>
                </div>
                <p class="stars-reading">Reading {{ s.nakshatra }} nakshatra…</p>
              </div>

              <!-- Answer revealed -->
              <div v-else class="stars-answer">
                <div class="stars-answer-header">
                  <span class="stars-answer-icon">✦</span>
                  <div class="stars-answer-meta">
                    <p class="stars-answer-question">"{{ starQuestion }}"</p>
                    <p class="stars-answer-source">{{ s.nakshatra }} · Tithi {{ s.tithi }}</p>
                  </div>
                </div>
                <p class="stars-answer-text">{{ STAR_ANSWERS[starAnswerIdx] }}</p>
                <p class="stars-answer-note">This answer is set by today's sky. It won't change until tomorrow.</p>
              </div>
            </div>
          </section>

          <!-- ── Block VII: Vedic Dice ── -->
          <section class="section">
            <p class="sec-label">COSMIC NUMBER</p>
            <p class="dice-sub">Your number for today · resets at midnight</p>
            <div class="dice-card glass">
              <div class="dice-face" :class="{ 'dice-rolling': diceRolling, 'dice-revealed': diceRolled }">
                <span class="dice-number">{{ diceDisplayNum ?? '?' }}</span>
              </div>
              <div class="dice-info" v-if="diceRolled">
                <div class="dice-quality-row">
                  <span class="dice-symbol">{{ cosmicNumberData.symbol }}</span>
                  <span class="dice-quality">{{ cosmicNumberData.quality.toUpperCase() }}</span>
                </div>
                <p class="dice-interpretation">{{ cosmicNumberData.interpretation }}</p>
                <p class="dice-footer">{{ s.nakshatra }} · Tithi {{ s.tithi }}</p>
              </div>
              <div class="dice-prompt" v-else>
                <p class="dice-prompt-text">Roll to reveal your cosmic number</p>
              </div>
              <button
                class="dice-btn"
                :class="{ 'dice-btn--rolled': diceRolled }"
                :disabled="diceRolled || diceRolling"
                @click="rollDice"
              >{{ diceRolled ? 'Rolled ✓' : diceRolling ? 'Rolling…' : 'Roll' }}</button>
            </div>
          </section>

          <!-- ── Block 8: Tomorrow's Preview + Intention ── -->
          <section class="section">
            <p class="sec-label">TOMORROW'S PREVIEW</p>
            <div class="tomorrow-card glass">
              <span class="tomorrow-icon">{{ tomorrowCard.icon }}</span>
              <div class="tomorrow-body">
                <p class="tomorrow-hl">{{ tomorrowCard.headline }}</p>
                <p class="tomorrow-text">{{ tomorrowCard.body }}</p>
              </div>
            </div>
            <p class="demo-note">⏱ Visible after 21:00 in the real app</p>

            <!-- Tomorrow intention -->
            <div class="intention-card glass">
              <p class="intention-label">✦ Set an intention for tomorrow</p>
              <textarea
                v-if="!intentionSaved"
                v-model="intention"
                class="journal-input"
                :placeholder="`${tomorrowCard.headline} — what will you focus on?`"
                rows="2"
              />
              <div v-else class="journal-saved">
                <span class="saved-icon">✓</span>
                <p class="saved-text">{{ intention }}</p>
              </div>
              <button
                v-if="!intentionSaved"
                class="journal-btn intention-save-btn"
                :disabled="!intention.trim()"
                @click="saveIntention"
              >Set intention</button>
            </div>
          </section>

          <!-- ── Block 9: Stories ── -->
          <section class="section">
            <p class="sec-label">STORIES</p>
            <div class="stories-row">
              <div class="story-card" style="background:linear-gradient(180deg,#14003a,#380880)">
                <span>✦ Mercury<br>Retrograde<br>Guide</span>
              </div>
              <div class="story-card" style="background:linear-gradient(180deg,#1a2800,#2a5000)">
                <span>🌿 Moon<br>Rituals<br>101</span>
              </div>
              <div class="story-card" style="background:linear-gradient(180deg,#2a0012,#680032)">
                <span>✦ {{ s.nakshatra }}<br>Nakshatra<br>Decoded</span>
              </div>
              <div class="story-card" style="background:linear-gradient(180deg,#0a1a30,#1a3a70)">
                <span>🌊 Flow<br>State<br>Practice</span>
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
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 100px;
  padding: 6px 10px;
  backdrop-filter: blur(8px);
}

.sc-arrow {
  color: rgba(255,255,255,0.7);
  font-size: 18px;
  line-height: 1;
  padding: 0 4px;
}
.sc-arrow:hover { color: white; }

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
  box-shadow: 0 4px 16px rgba(107,33,214,0.4);
  transition: transform 0.1s, box-shadow 0.1s;
}
.randomize-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(107,33,214,0.5); }
.randomize-btn:active { transform: scale(0.97); }

.demo-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.meta-chip {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.6);
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
    radial-gradient(1px 1px at 12% 8%,  rgba(255,255,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 28% 3%,  rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 62% 6%, rgba(255,255,255,0.9) 0%, transparent 100%),
    radial-gradient(1px 1px at 80% 12%, rgba(255,255,255,0.4) 0%, transparent 100%),
    radial-gradient(1px 1px at 45% 18%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 92% 22%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 18% 30%, rgba(255,255,255,0.3) 0%, transparent 100%),
    radial-gradient(1px 1px at 70% 35%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 5%  45%, rgba(255,255,255,0.4) 0%, transparent 100%),
    radial-gradient(1px 1px at 55% 50%, rgba(255,255,255,0.3) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 88% 55%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 35% 65%, rgba(255,255,255,0.4) 0%, transparent 100%),
    radial-gradient(1px 1px at 75% 72%, rgba(255,255,255,0.3) 0%, transparent 100%),
    radial-gradient(1px 1px at 22% 80%, rgba(255,255,255,0.5) 0%, transparent 100%);
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
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  backdrop-filter: blur(14px);
}

.glass-sm {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
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

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to      { opacity: 0; }

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
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.7);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-close:hover { background: rgba(255,255,255,0.18); color: white; }

.modal-tabs {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 12px;
  flex-shrink: 0;
  scrollbar-width: none;
}
.modal-tabs::-webkit-scrollbar { display: none; }

.modal-tab {
  flex-shrink: 0;
  padding: 5px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.15s;
}
.modal-tab--active {
  background: rgba(255,255,255,0.14);
  border-color: rgba(255,255,255,0.25);
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
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  transition: opacity 0.15s;
}

.modal-badge-row--locked {
  opacity: 0.4;
}

.modal-badge-icon { font-size: 22px; flex-shrink: 0; }

.modal-badge-info { flex: 1; }

.modal-badge-name {
  font-size: 13px;
  font-weight: 700;
  color: white;
  margin-bottom: 2px;
}

.modal-badge-desc {
  font-size: 11px;
  color: rgba(255,255,255,0.45);
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
  color: rgba(255,255,255,0.45);
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
  background: rgba(255,140,0,0.25);
  border: 1px solid rgba(255,160,0,0.4);
  color: #ffcc60;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 100px;
}

.notif-btn { font-size: 18px; opacity: 0.6; cursor: pointer; }

/* ── Block 1: Headline ────────────────────────────────────────────────────── */
.headline-card {
  text-align: center;
  padding: 20px 18px;
  margin-bottom: 20px;
}

.headline-icon-wrap { margin-bottom: 8px; }

.headline-big-icon {
  font-size: 36px;
  line-height: 1;
  filter: drop-shadow(0 0 12px rgba(255,255,255,0.4));
}

.headline-title {
  font-family: var(--font-serif);
  font-size: 26px;
  color: white;
  margin-bottom: 6px;
}

.headline-sub {
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 12px;
  line-height: 1.5;
}

.info-pill {
  display: inline-block;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 100px;
  padding: 5px 14px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.03em;
  margin-bottom: 10px;
}

.social-proof {
  font-size: 11px;
  color: rgba(255,255,255,0.38);
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* ── Sections ─────────────────────────────────────────────────────────────── */
.section { margin-bottom: 22px; }

.sec-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
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
  color: rgba(255,255,255,0.45);
}
.view-all:hover { color: rgba(255,255,255,0.7); }

/* ── Block 2: Energy grid ─────────────────────────────────────────────────── */
.energy-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.cat-card {
  padding: 12px 10px 10px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.cat-card:hover { background: rgba(255,255,255,0.12); }
.cat-expanded { background: rgba(255,255,255,0.13) !important; border-color: rgba(255,255,255,0.2) !important; }

.cat-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
}

.cat-icon  { font-size: 14px; line-height: 1; }
.cat-name  { flex: 1; font-size: 12px; font-weight: 700; color: white; }
.cat-pct   { font-size: 14px; font-weight: 800; font-variant-numeric: tabular-nums; }

.cat-bar-track {
  height: 3px;
  background: rgba(255,255,255,0.12);
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

.expand-enter-active, .expand-leave-active {
  transition: opacity 0.2s, max-height 0.25s ease;
  overflow: hidden;
  max-height: 160px;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.cat-detail {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.cat-detail-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  margin-bottom: 5px;
}

.cat-detail-text {
  font-size: 11px;
  line-height: 1.55;
  color: rgba(255,255,255,0.7);
}

.tap-hint {
  text-align: center;
  font-size: 10px;
  color: rgba(255,255,255,0.25);
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

.da-col   { flex: 1; padding: 14px 10px; }
.da-sep   { width: 1px; background: rgba(255,255,255,0.1); flex-shrink: 0; }

.da-head {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.do-head    { color: #4ade80; }
.avoid-head { color: #fbbf24; }

.da-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.da-item { display: flex; flex-direction: column; gap: 4px; }

.da-text {
  font-size: 11px;
  line-height: 1.5;
  color: rgba(255,255,255,0.75);
  padding-left: 10px;
  position: relative;
}

.da-text::before {
  content: '·';
  position: absolute;
  left: 0;
  color: rgba(255,255,255,0.3);
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

.tip-tag--do    { background: rgba(74,222,128,0.12); border: 1px solid rgba(74,222,128,0.25); color: rgba(74,222,128,0.8); }
.tip-tag--avoid { background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.25); color: rgba(251,191,36,0.8); }

.share-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 12px;
  color: rgba(255,255,255,0.55);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  transition: background 0.15s;
}
.share-btn:hover { background: rgba(255,255,255,0.13); color: rgba(255,255,255,0.8); }

/* ── Block 4: Vibe ────────────────────────────────────────────────────────── */
.vibe-card { padding: 18px 16px; }

.vibe-text {
  font-size: 14px;
  line-height: 1.7;
  color: rgba(255,255,255,0.85);
}

.vibe-foot {
  margin-top: 10px;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255,255,255,0.3);
  letter-spacing: 0.06em;
}

/* ── Block 5: Your Day ────────────────────────────────────────────────────── */
.your-day { display: flex; flex-direction: column; gap: 8px; }

.day-slot {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 16px;
  padding: 12px 14px;
  transition: background 0.2s;
}

.day-slot--now {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.2);
}

.day-slot-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
}

.slot-icon  { font-size: 16px; flex-shrink: 0; }
.slot-name  { font-size: 13px; font-weight: 700; color: white; }
.slot-time  { font-size: 10px; color: rgba(255,255,255,0.4); margin-left: 4px; font-weight: 600; }

.slot-now-tag {
  margin-left: auto;
  background: rgba(255,220,80,0.2);
  border: 1px solid rgba(255,220,80,0.4);
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
  color: rgba(255,255,255,0.7);
}

/* ── Block 6: Moon Streak ─────────────────────────────────────────────────── */
.moon-card { padding: 16px; }

.moon-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
}

.ring-wrap { position: relative; flex-shrink: 0; }
.ring-svg  { width: 76px; height: 76px; }

.ring-phase {
  position: absolute;
  bottom: -6px;
  right: -4px;
  font-size: 18px;
  filter: drop-shadow(0 0 4px rgba(0,0,0,0.5));
}

.streak-info { flex: 1; }

.streak-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.streak-big  { font-size: 24px; font-weight: 800; color: #ffcc60; line-height: 1; }
.streak-sub  { font-size: 11px; color: rgba(255,255,255,0.4); margin-bottom: 8px; font-weight: 600; }
.streak-phase { font-size: 11px; color: rgba(255,255,255,0.55); line-height: 1.5; }

.grace-tag {
  background: rgba(100, 180, 255, 0.18);
  border: 1px solid rgba(100,180,255,0.3);
  color: rgba(160,220,255,0.9);
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

.moon-dot        { font-size: 18px; opacity: 0.5; transition: opacity 0.3s; }
.moon-dot--today { opacity: 1; filter: drop-shadow(0 0 4px rgba(255,255,255,0.6)); }

.strip-caption {
  font-size: 10px;
  color: rgba(255,255,255,0.3);
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.streak-goal {
  background: rgba(255,220,80,0.1);
  border: 1px solid rgba(255,220,80,0.2);
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 11px;
  color: rgba(255,220,100,0.8);
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
}

.grace-note {
  font-size: 11px;
  color: rgba(160,220,255,0.65);
  text-align: center;
  font-weight: 600;
  padding: 6px 10px;
  background: rgba(100,180,255,0.08);
  border: 1px solid rgba(100,180,255,0.15);
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

.tier-standard { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.12); }
.tier-silver   { background: rgba(192,200,240,0.1);  border-color: rgba(200,210,255,0.25); box-shadow: 0 0 10px rgba(180,190,255,0.15); }
.tier-gold     { background: rgba(220,180,40,0.12);  border-color: rgba(255,220,60,0.28);  box-shadow: 0 0 10px rgba(255,200,0,0.2); }
.tier-crown    { background: rgba(220,160,20,0.18);  border-color: rgba(255,220,60,0.45);  box-shadow: 0 0 14px rgba(255,200,0,0.35); }

.badge-ic    { font-size: 20px; line-height: 1; }
.badge-name  { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.85); line-height: 1.3; }
.badge-count { font-size: 10px; color: rgba(255,220,60,0.8); font-weight: 700; }

/* ── Reflection ───────────────────────────────────────────────────────────── */
.journal-card {
  padding: 16px;
}

.journal-prompt {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  margin-bottom: 10px;
}

.journal-input {
  width: 100%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
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
.journal-input:focus { border-color: rgba(255,255,255,0.25); }
.journal-input::placeholder { color: rgba(255,255,255,0.25); }

.journal-saved {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 10px 12px;
  background: rgba(74,222,128,0.08);
  border: 1px solid rgba(74,222,128,0.18);
  border-radius: 12px;
  margin-bottom: 10px;
}

.saved-icon { font-size: 14px; color: #4ade80; flex-shrink: 0; font-weight: 800; }
.saved-text { font-size: 12px; color: rgba(255,255,255,0.7); line-height: 1.5; }

.journal-btn {
  width: 100%;
  padding: 9px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 12px;
  color: white;
  font-size: 12px;
  font-weight: 700;
  transition: background 0.15s, opacity 0.15s;
}
.journal-btn:hover:not(:disabled) { background: rgba(255,255,255,0.18); }
.journal-btn:disabled { opacity: 0.35; cursor: default; }

/* ── Block 8: Tomorrow ────────────────────────────────────────────────────── */
.tomorrow-card {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px;
  margin-bottom: 8px;
}

.tomorrow-icon { font-size: 28px; line-height: 1; flex-shrink: 0; filter: drop-shadow(0 0 6px rgba(255,255,255,0.3)); }
.tomorrow-hl   { font-size: 14px; font-weight: 700; color: white; margin-bottom: 5px; line-height: 1.3; }
.tomorrow-text { font-size: 12px; line-height: 1.6; color: rgba(255,255,255,0.65); }

.demo-note {
  font-size: 10px;
  color: rgba(255,255,255,0.25);
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 12px;
}

.intention-card { padding: 14px 16px; }

.intention-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.5);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.intention-save-btn {
  background: rgba(140,120,255,0.15);
  border-color: rgba(160,140,255,0.3);
  color: rgba(200,190,255,0.9);
}
.intention-save-btn:hover:not(:disabled) {
  background: rgba(140,120,255,0.25);
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
  color: rgba(255,255,255,0.85);
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
}

.bottom-pad { height: 24px; }

/* ── Dark bottom nav ──────────────────────────────────────────────────────── */
.dark-nav {
  display: flex;
  background: rgba(6, 8, 20, 0.85);
  border-top: 1px solid rgba(255,255,255,0.08);
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
  color: rgba(255,255,255,0.35);
  transition: color 0.15s;
}
.dark-tab:hover { color: rgba(255,255,255,0.6); }
.dark-tab--active { color: white; }

.dark-tab-icon  { font-size: 20px; }
.dark-tab-label { font-size: 11px; font-weight: 600; }

/* ── Block I: Energy Check-In ─────────────────────────────────────────────── */
.checkin-card { padding: 16px; }

.checkin-question {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
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
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  transition: background 0.15s, transform 0.1s, border-color 0.15s;
}
.mood-btn:hover {
  background: rgba(255,255,255,0.14);
  border-color: rgba(255,255,255,0.22);
  transform: translateY(-2px);
}
.mood-btn:active { transform: scale(0.94); }

.mood-icon  { font-size: 22px; line-height: 1; }
.mood-label { font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.4); letter-spacing: 0.05em; }

.checkin-result { display: flex; flex-direction: column; gap: 10px; }

.checkin-picked {
  display: flex;
  align-items: center;
  gap: 8px;
}
.checkin-picked-icon  { font-size: 24px; line-height: 1; }
.checkin-picked-label { font-size: 15px; font-weight: 700; color: white; }
.checkin-reset {
  margin-left: auto;
  font-size: 14px;
  color: rgba(255,255,255,0.3);
  padding: 2px 8px;
  border-radius: 8px;
  transition: color 0.15s, background 0.15s;
}
.checkin-reset:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.08); }

.checkin-outcome {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 12px 14px;
}
.outcome-label { font-size: 15px; font-weight: 700; color: white; margin-bottom: 4px; }
.outcome-sub   { font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.5; }

.checkin-accuracy {
  font-size: 10px;
  color: rgba(255,255,255,0.22);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-align: center;
}

/* ── Block II: Daily Oracle ───────────────────────────────────────────────── */
.oracle-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.38);
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: 0.03em;
}

.oracle-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.oracle-card {
  flex: 1;
  perspective: 500px;
  cursor: pointer;
  height: 148px;
  transition: opacity 0.3s;
}
.oracle-card--faded { opacity: 0.28; pointer-events: none; }

.oracle-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
}
.oracle-card--flipped .oracle-inner { transform: rotateY(180deg); }

.oracle-face {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 8px;
  border: 1px solid rgba(255,255,255,0.1);
}

.oracle-back {
  background: linear-gradient(160deg, rgba(28,10,56,0.95) 0%, rgba(8,18,48,0.95) 100%);
}
.oracle-back:hover { border-color: rgba(255,255,255,0.22); }

.oracle-back-symbol {
  font-size: 26px;
  color: rgba(255,255,255,0.22);
  margin-bottom: 8px;
  font-style: normal;
}

.oracle-back-name {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255,255,255,0.28);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: center;
}

.oracle-front {
  background: linear-gradient(160deg, rgba(48,16,96,0.97) 0%, rgba(16,36,80,0.97) 100%);
  transform: rotateY(180deg);
  border-color: rgba(180,140,255,0.2);
  gap: 8px;
}

.oracle-front-icon { font-size: 22px; line-height: 1; }
.oracle-front-msg {
  font-size: 11px;
  line-height: 1.55;
  color: rgba(255,255,255,0.82);
  text-align: center;
}

.oracle-hint {
  text-align: center;
  font-size: 10px;
  color: rgba(255,255,255,0.22);
  font-weight: 600;
  letter-spacing: 0.04em;
}
.oracle-hint--done { color: rgba(74,222,128,0.55); }

/* ── Block III: Compatibility Pulse ──────────────────────────────────────── */
.connect-cta {
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}
.cta-icon { font-size: 34px; line-height: 1; }

.cta-body { display: flex; flex-direction: column; gap: 6px; }
.cta-title {
  font-size: 15px;
  font-weight: 700;
  color: white;
  line-height: 1.35;
}
.cta-sub {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  line-height: 1.6;
}
.cta-btn {
  background: linear-gradient(135deg, rgba(180,140,255,0.22), rgba(100,120,255,0.18));
  border: 1px solid rgba(180,140,255,0.38);
  color: rgba(210,190,255,0.92);
  font-size: 13px;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 100px;
  transition: background 0.15s, transform 0.1s;
  letter-spacing: 0.02em;
}
.cta-btn:hover {
  background: linear-gradient(135deg, rgba(180,140,255,0.34), rgba(100,120,255,0.28));
  transform: translateY(-1px);
}

.compat-list { display: flex; flex-direction: column; gap: 8px; }

.compat-card {
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.compat-card:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.18); }
.compat-card--expanded {
  background: rgba(255,255,255,0.13) !important;
  border-color: rgba(255,255,255,0.2) !important;
}

.compat-row { display: flex; align-items: center; gap: 10px; }

.match-avatar { font-size: 26px; flex-shrink: 0; line-height: 1; }

.match-info { flex: 1; min-width: 0; }
.match-name      { font-size: 13px; font-weight: 700; color: white; line-height: 1.3; }
.match-nakshatra { font-size: 10px; color: rgba(255,255,255,0.38); font-weight: 600; }

.match-score-wrap { text-align: right; flex-shrink: 0; }
.match-score       { font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums; line-height: 1.2; }
.match-score-label { font-size: 9px; font-weight: 700; letter-spacing: 0.06em; }

.match-insight {
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255,255,255,0.68);
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.compat-hint {
  text-align: center;
  font-size: 10px;
  color: rgba(255,255,255,0.22);
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-top: 2px;
}

.expand-enter-active, .expand-leave-active { transition: opacity 0.2s; }
.expand-enter-from, .expand-leave-to       { opacity: 0; }

/* ── Block IV: Power Windows ──────────────────────────────────────────────── */
.pw-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  font-weight: 600;
  margin-bottom: 10px;
  letter-spacing: 0.03em;
}

.pw-list { display: flex; flex-direction: column; gap: 6px; }

.pw-row {
  padding: 11px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.06);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.pw-row:hover { background: rgba(255,255,255,0.1); }
.pw-open { background: rgba(255,255,255,0.11) !important; border-color: rgba(255,255,255,0.18) !important; }

/* Quality variants */
.pw-golden {
  background: rgba(255,210,60,0.08) !important;
  border-color: rgba(255,210,60,0.25) !important;
}
.pw-golden:hover { background: rgba(255,210,60,0.13) !important; }

.pw-avoid {
  background: rgba(248,113,113,0.07) !important;
  border-color: rgba(248,113,113,0.2) !important;
}
.pw-avoid:hover { background: rgba(248,113,113,0.12) !important; }

.pw-rest {
  background: rgba(100,160,255,0.07) !important;
  border-color: rgba(100,160,255,0.18) !important;
}

/* Current slot highlight */
.pw-now {
  border-color: rgba(255,255,255,0.28) !important;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
}

.pw-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pw-icon { font-size: 18px; flex-shrink: 0; line-height: 1; width: 22px; text-align: center; }

.pw-center { flex: 1; min-width: 0; }
.pw-title { font-size: 13px; font-weight: 700; color: white; line-height: 1.3; }
.pw-time  { font-size: 11px; color: rgba(255,255,255,0.45); font-weight: 600; margin-top: 1px; font-variant-numeric: tabular-nums; }

.pw-badge-wrap { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

.pw-now-tag {
  font-size: 9px;
  font-weight: 800;
  color: rgba(74,222,128,0.9);
  background: rgba(74,222,128,0.12);
  border: 1px solid rgba(74,222,128,0.25);
  padding: 2px 7px;
  border-radius: 100px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.pw-quality-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-peak   { background: rgba(74,222,128,0.8); box-shadow: 0 0 5px rgba(74,222,128,0.4); }
.dot-golden { background: rgba(255,210,60,0.9); box-shadow: 0 0 6px rgba(255,210,60,0.5); }
.dot-medium { background: rgba(251,191,36,0.7); }
.dot-avoid  { background: rgba(248,113,113,0.8); }
.dot-rest   { background: rgba(100,160,255,0.7); }

.pw-hint {
  font-size: 11px;
  line-height: 1.55;
  color: rgba(255,255,255,0.55);
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

/* ── Block V: Ask the Stars ───────────────────────────────────────────────── */
.stars-card { padding: 18px; }

.stars-prompt {
  font-size: 15px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}
.stars-hint-text {
  font-size: 11px;
  color: rgba(255,255,255,0.38);
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1.5;
}

.stars-input { margin-bottom: 12px; }

.stars-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, rgba(120,80,255,0.22), rgba(60,80,200,0.18));
  border: 1px solid rgba(140,100,255,0.35);
  color: rgba(200,180,255,0.95);
  font-size: 13px;
  font-weight: 700;
  border-radius: 12px;
  transition: background 0.15s, transform 0.1s, opacity 0.15s;
  letter-spacing: 0.03em;
}
.stars-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(120,80,255,0.34), rgba(60,80,200,0.28));
  transform: translateY(-1px);
}
.stars-btn:disabled { opacity: 0.3; cursor: default; }

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
  background: radial-gradient(circle, rgba(120,80,255,0.4) 0%, rgba(40,20,100,0.3) 100%);
  border: 1px solid rgba(140,100,255,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse-orb 1.2s ease-in-out infinite;
}
.stars-orb-icon {
  font-size: 22px;
  color: rgba(200,180,255,0.8);
  animation: spin-slow 3s linear infinite;
  display: inline-block;
}

@keyframes pulse-orb {
  0%, 100% { box-shadow: 0 0 0 0 rgba(140,100,255,0.3); transform: scale(1); }
  50%       { box-shadow: 0 0 0 10px rgba(140,100,255,0); transform: scale(1.05); }
}
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.stars-reading {
  font-size: 12px;
  color: rgba(200,180,255,0.6);
  font-weight: 600;
  letter-spacing: 0.05em;
}

/* Answer */
.stars-answer { display: flex; flex-direction: column; gap: 12px; }

.stars-answer-header {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.stars-answer-icon {
  font-size: 20px;
  color: rgba(255,210,60,0.8);
  flex-shrink: 0;
  margin-top: 1px;
  filter: drop-shadow(0 0 4px rgba(255,210,60,0.4));
}
.stars-answer-question {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  font-style: italic;
  margin-bottom: 2px;
  line-height: 1.4;
}
.stars-answer-source {
  font-size: 10px;
  color: rgba(200,180,255,0.45);
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
  background: rgba(120,80,255,0.1);
  border: 1px solid rgba(140,100,255,0.2);
  border-radius: 12px;
}

.stars-answer-note {
  font-size: 10px;
  color: rgba(255,255,255,0.22);
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.04em;
}

/* ── Block VI: Cosmic Body Map ────────────────────────────────────────────── */

.body-map-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
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
  color: rgba(255,255,255,0.45);
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
  color: rgba(255,255,255,0.92);
  margin-bottom: 6px;
  text-transform: capitalize;
}
.body-map-tip {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  line-height: 1.55;
}

/* ── Block VII: Vedic Dice ────────────────────────────────────────────────── */

.dice-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
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
  background: rgba(255,255,255,0.07);
  border: 2px solid rgba(255,255,255,0.18);
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
  box-shadow: 0 0 20px rgba(212,175,55,0.2);
}
@keyframes diceShake {
  from { transform: rotate(-4deg) scale(1.02); }
  to   { transform: rotate(4deg)  scale(0.98); }
}
.dice-number {
  font-size: 36px;
  font-weight: 800;
  color: rgba(255,255,255,0.9);
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
.dice-symbol { font-size: 20px; }
.dice-quality {
  font-size: 14px;
  font-weight: 800;
  color: #d4af37;
  letter-spacing: 0.1em;
}
.dice-interpretation {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
  text-align: center;
}
.dice-footer {
  font-size: 10px;
  color: rgba(255,255,255,0.3);
  font-weight: 600;
  letter-spacing: 0.06em;
}
.dice-prompt-text {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
}
.dice-btn {
  padding: 10px 32px;
  border-radius: 50px;
  border: 1.5px solid rgba(212,175,55,0.5);
  background: rgba(212,175,55,0.12);
  color: #d4af37;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s;
}
.dice-btn:hover:not(:disabled) {
  background: rgba(212,175,55,0.22);
  transform: scale(1.04);
}
.dice-btn:disabled { opacity: 0.5; cursor: default; }
.dice-btn--rolled {
  border-color: rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.4);
}

/* ── Block VIII: Daily Cosmic Pull ───────────────────────────────────────── */

.pull-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  text-align: center;
  margin: -6px 0 14px;
  letter-spacing: 0.04em;
}
.pull-slots {
  display: flex;
  gap: 10px;
}
.pull-slot {
  flex: 1;
  min-height: 160px;
  border-radius: 16px;
  overflow: hidden;
}
.pull-card-back {
  height: 100%;
  min-height: 160px;
  background: rgba(255,255,255,0.06);
  border: 1.5px dashed rgba(255,255,255,0.2);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.pull-card-back:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.35);
  transform: scale(1.02);
}
.pull-back-symbol {
  font-size: 24px;
  color: rgba(255,255,255,0.3);
}
.pull-back-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.55);
  text-transform: capitalize;
  letter-spacing: 0.05em;
}
.pull-back-hint {
  font-size: 9px;
  color: rgba(255,255,255,0.25);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.pull-card-locked {
  height: 100%;
  min-height: 160px;
  background: rgba(0,0,0,0.2);
  border: 1.5px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.pull-lock-icon { font-size: 20px; opacity: 0.3; }
.pull-lock-label {
  font-size: 10px;
  font-weight: 700;
  color: rgba(255,255,255,0.2);
  text-transform: capitalize;
  letter-spacing: 0.06em;
}
.pull-lock-time {
  font-size: 9px;
  color: rgba(255,255,255,0.15);
}
.pull-card-face {
  height: 100%;
  min-height: 160px;
  background: rgba(255,255,255,0.05);
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  padding: 14px 10px;
  animation: cardFlip 0.4s ease;
}
@keyframes cardFlip {
  from { transform: rotateY(90deg); opacity: 0; }
  to   { transform: rotateY(0deg);  opacity: 1; }
}
.pull-quality-symbol { font-size: 22px; }
.pull-quality-name {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
}
.pull-msg {
  font-size: 10px;
  color: rgba(255,255,255,0.65);
  line-height: 1.5;
  text-align: center;
  flex: 1;
}
.pull-attr {
  font-size: 9px;
  color: rgba(255,255,255,0.25);
  letter-spacing: 0.05em;
}
</style>
