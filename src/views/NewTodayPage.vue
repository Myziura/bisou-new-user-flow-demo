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

// ── Helpers ──────────────────────────────────────────────────────────────────

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

function resolveBackground(sc) {
  const scores = sc.scores
  const avg = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6)
  if (sc.starsAlign)            return 'celestial_event'
  if (sc.isEclipse)             return 'eclipse'
  if (sc.isPurnima)             return 'full_moon'
  if (sc.isAmavasya)            return 'new_moon'
  if (sc.isNakshatraBirthday)   return 'star_day'
  if (sc.isTithiBirthday)       return 'lunar_birthday'
  if (sc.isVaaraBirthday)       return 'your_day'
  if (sc.vaara === 'Friday'     && scores.love   >= 71) return 'venus_evening'
  if (sc.vaara === 'Monday'     && scores.family >= 71) return 'moon_embrace'
  if (sc.vaara === 'Thursday'   && scores.money  >= 71) return 'jupiter_abundance'
  if (sc.vaara === 'Wednesday'  && (scores.social >= 71 || scores.career >= 71)) return 'mercury_mind'
  if (sc.vaara === 'Tuesday'    && (scores.health >= 71 || scores.career >= 71)) return 'mars_fire'
  if (sc.vaara === 'Sunday'     && scores.health >= 71) return 'sun_radiance'
  if (sc.vaara === 'Saturday'   && scores.career >= 71) return 'saturn_clarity'
  if (avg >= 80) return 'golden_hour'
  if (avg >= 65) return 'clear_sky'
  if (avg >= 50) return 'overcast'
  if (avg >= 35) return 'cloudy'
  return 'deep_night'
}

function resolveHeadline(sc) {
  const avg = Math.round(Object.values(sc.scores).reduce((a, b) => a + b, 0) / 6)
  if (sc.starsAlign)           return { icon: '🌟', type: 'Your Special Day',  sub: 'A rare alignment — happens only a few times a year' }
  if (sc.isPurnima)            return { icon: '🌕', type: 'Full Moon Day',      sub: 'Peak energy. Emotions run high' }
  if (sc.isAmavasya)           return { icon: '🌑', type: 'New Moon Day',       sub: 'Time to set new intentions' }
  if (sc.isNakshatraBirthday)  return { icon: '⭐', type: 'Your Star Day',      sub: "Today's sky matches your birth sky" }
  if (sc.isTithiBirthday)      return { icon: '🎂', type: 'Lunar Birthday',     sub: 'The moon returns to your birth phase' }
  if (sc.isEclipse)            return { icon: '🌒', type: 'Eclipse Day',        sub: 'Rare disruption. Observe, don\'t act.' }
  if (avg >= 75)               return { icon: '⚡', type: 'High Energy Day',    sub: 'The stars are working for you today' }
  if (avg >= 50)               return { icon: '🌊', type: 'Flow With It',       sub: 'A steady day — go with the current' }
  return                              { icon: '🌙', type: 'Rest & Reflect',     sub: 'A quiet day. Good for inner work' }
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
  purnima:            { icon: '🌕', headline: 'Tomorrow is Full Moon',            body: 'Full Moon days are rare and powerful. Your Love and Social energy will peak. Come back tomorrow — there\'s a badge waiting.' },
  amavasya:           { icon: '🌑', headline: 'Tomorrow is New Moon',             body: 'New Moon is the best day to set clear intentions and start fresh. Come back tomorrow morning to open a clean cycle.' },
  chaturdashi:        { icon: '⚡', headline: 'Tomorrow is an intense day',       body: 'The 14th tithi carries high tension energy. Avoid major decisions and confrontations — let it pass.' },
  nakshatra_birthday: { icon: '⭐', headline: 'Tomorrow is Your Star Day',        body: 'The Moon returns to your birth nakshatra. A personal high-energy day. Come back tomorrow to collect your badge.' },
  tithi_birthday:     { icon: '🎂', headline: 'Tomorrow is Your Lunar Birthday',  body: 'The Moon reaches the same phase it was in when you were born. A quiet but meaningful personal day.' },
  high_energy:        { icon: '⚡', headline: 'Tomorrow looks powerful',           body: 'Your {top} energy will be at its peak. A good day to act on something important — check back in the morning.' },
  low_energy:         { icon: '🌙', headline: 'Tomorrow is a rest day',           body: 'The stars are quiet tomorrow. A good day for inner work, rest, and letting things settle.' },
  venus_day:          { icon: '💛', headline: 'Tomorrow is Venus Day (Friday)',   body: 'The best day of the week for love, beauty, and connection. Your Love and Social energy will be elevated. Make plans tonight.' },
  jupiter_day:        { icon: '🌟', headline: 'Tomorrow is Jupiter Day (Thursday)', body: 'Jupiter expands what it touches. Tomorrow favours financial decisions and anything you want to build long-term.' },
  moon_day:           { icon: '🌙', headline: 'Tomorrow is Moon Day (Monday)',    body: "The Moon's own day — strongest for family, emotional conversations, and intuitive decisions. Let feeling lead tomorrow." },
  default:            { icon: '🔮', headline: 'Tomorrow\'s energy: {label}',      body: 'Your {top} will be the strongest area. Check back tomorrow morning for the full picture.' },
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
    streak: 14,
    vibeText: "Full Moon energy peaks tonight on Pushya nakshatra — one of the most auspicious stars of the month. Your love and social energy are amplified. Reach out to someone meaningful before the night ends.",
    doTips: ["Release something that no longer serves you on this Full Moon", "Reach out to someone you've been thinking about", "Plan a date or quality time with your partner today"],
    avoidTips: ["Avoid staying up past midnight — your recovery window matters tonight", "Don't make impulsive purchases today — the urge will pass", "Skip the passive-aggressive comment you're considering"],
    badges: [{ icon: '🌕', name: 'Full Moon Witness', count: 3, tier: 'silver' }, { icon: '🌙', name: 'Moonwalker', count: null, tier: 'standard' }, { icon: '🔥🔥', name: 'First Week', count: null, tier: 'standard' }],
    tomorrowKey: 'default', tomorrowTop: 'Love', tomorrowLabel: 'Moderate',
  },
  {
    label: '🌑 New Moon Monday',
    userName: 'Arjun',
    vaara: 'Monday', tithi: 30, tithiName: 'Amavasya', nakshatra: 'Ashlesha',
    isPurnima: false, isAmavasya: true, isChaturdashi: false,
    isNakshatraBirthday: false, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: false, paksha: 'Krishna', timeOfDay: 'morning',
    scores: { love: 38, career: 42, health: 55, money: 35, social: 28, family: 44 },
    streak: 7,
    vibeText: "New Moon on Ashlesha nakshatra invites you to turn inward. This is a potent day for release and intention-setting, not action. Let the old chapter close quietly before writing the new one.",
    doTips: ["Set a powerful new intention during this New Moon — write it down", "Do a breathing or meditation session today — even 10 minutes", "Write down three things you're grateful for this morning"],
    avoidTips: ["Avoid large social gatherings that drain rather than energize you", "Don't make financial decisions based on pressure or urgency", "Avoid starting anything new today — the waning moon favours completion"],
    badges: [{ icon: '🌑', name: 'New Moon Keeper', count: 7, tier: 'gold' }, { icon: '🔥🔥', name: 'First Week', count: null, tier: 'standard' }, { icon: '🌱', name: 'First Steps', count: null, tier: 'standard' }],
    tomorrowKey: 'high_energy', tomorrowTop: 'Career', tomorrowLabel: 'High Energy',
  },
  {
    label: '⭐ Your Star Day',
    userName: 'Maya',
    vaara: 'Wednesday', tithi: 9, tithiName: 'Navami', nakshatra: 'Pushya',
    isPurnima: false, isAmavasya: false, isChaturdashi: false,
    isNakshatraBirthday: true, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: false, paksha: 'Shukla', timeOfDay: 'afternoon',
    scores: { love: 84, career: 88, health: 76, money: 80, social: 92, family: 78 },
    streak: 29,
    vibeText: "The Moon has returned to Pushya — your birth nakshatra. This is your personal cosmic peak day. The alignment between your birth sky and today's sky activates a natural clarity and magnetism that few days can match.",
    doTips: ["Celebrate your Star Day — do something meaningful for yourself", "Schedule the meeting or conversation you've been postponing", "Reach out to someone you've been meaning to reconnect with"],
    avoidTips: ["Don't second-guess decisions you've already made well", "Avoid overthinking future plans — presence beats planning today", "Don't skip a planned commitment without notice"],
    badges: [{ icon: '⭐', name: 'Star Day', count: 12, tier: 'crown' }, { icon: '🌕', name: 'Full Cycle', count: null, tier: 'standard' }, { icon: '✨', name: 'Three Moons', count: null, tier: 'standard' }],
    tomorrowKey: 'venus_day', tomorrowTop: 'Love', tomorrowLabel: 'High Energy',
  },
  {
    label: '🔥 Mars Tuesday',
    userName: 'Lena',
    vaara: 'Tuesday', tithi: 3, tithiName: 'Tritiya', nakshatra: 'Ashwini',
    isPurnima: false, isAmavasya: false, isChaturdashi: false,
    isNakshatraBirthday: false, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: false, paksha: 'Shukla', timeOfDay: 'morning',
    scores: { love: 44, career: 86, health: 90, money: 58, social: 52, family: 40 },
    streak: 5,
    vibeText: "Mars and Ashwini nakshatra combine to give you an unusual burst of physical and mental stamina this Tuesday. The first two hours of the day are your most powerful window — use them on the hardest thing on your list.",
    doTips: ["Start the day with your most important task — energy is with you", "Commit to one physical challenge for the next 30 days — start today", "Get outside for at least 30 minutes — sun energy is high"],
    avoidTips: ["Avoid aggressive negotiations in love — conditions don't favour you", "Don't force social plans on yourself — rest is more valuable tonight", "Skip the confrontation — it's not the right time or place"],
    badges: [{ icon: '🔥', name: 'First Spark', count: null, tier: 'standard' }, { icon: '🌱', name: 'First Steps', count: null, tier: 'standard' }],
    tomorrowKey: 'jupiter_day', tomorrowTop: 'Money', tomorrowLabel: 'High Energy',
  },
  {
    label: '🌟 Rare Alignment',
    userName: 'Dev',
    vaara: 'Thursday', tithi: 13, tithiName: 'Trayodashi', nakshatra: 'Rohini',
    isPurnima: false, isAmavasya: false, isChaturdashi: false,
    isNakshatraBirthday: true, isTithiBirthday: true, isVaaraBirthday: true,
    starsAlign: true, isEclipse: false, paksha: 'Shukla', timeOfDay: 'afternoon',
    scores: { love: 98, career: 96, health: 94, money: 97, social: 95, family: 98 },
    streak: 365,
    vibeText: "A rare triple alignment — your birth nakshatra, lunar day, and weekday all match today's sky simultaneously. This configuration appears only a handful of times in a lifetime. Every category is amplified. Move boldly.",
    doTips: ["Share this rare alignment with someone close — it won't happen again for months", "Use this rare alignment day for the decision you've been putting off", "Apply for the opportunity you've been researching"],
    avoidTips: ["Don't suppress a creative idea because it feels too bold — note it down", "Avoid the temptation to take on more than you can finish", "Don't make your problems someone else's emergency"],
    badges: [{ icon: '🌟', name: 'Rare Alignment', count: 2, tier: 'silver' }, { icon: '🏆', name: 'Year of Stars', count: null, tier: 'crown' }, { icon: '🌌', name: 'One Full Year', count: null, tier: 'standard' }],
    tomorrowKey: 'purnima', tomorrowTop: 'Love', tomorrowLabel: 'High Energy',
  },
  {
    label: '🌙 Saturn Saturday',
    userName: 'Kate',
    vaara: 'Saturday', tithi: 11, tithiName: 'Ekadashi', nakshatra: 'Uttara Phalguni',
    isPurnima: false, isAmavasya: false, isChaturdashi: false,
    isNakshatraBirthday: false, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: false, paksha: 'Shukla', timeOfDay: 'evening',
    scores: { love: 34, career: 78, health: 50, money: 44, social: 30, family: 38 },
    streak: 90,
    vibeText: "Saturn's discipline defines this Saturday. Career and structured effort are your allies today, while social and love energy stay quiet. An excellent day to finish something, release something, and prepare for the week.",
    doTips: ["Tackle the task you've been avoiding most — today you have the energy", "Cancel subscriptions you haven't used in 30 days", "Clean and organize your workspace or home environment"],
    avoidTips: ["Avoid dramatic conversations late at night — mornings are always clearer", "Don't force social plans on yourself — rest is more valuable tonight", "Avoid comparing your progress to others — your path moves at its own speed"],
    badges: [{ icon: '✨', name: 'Three Moons', count: null, tier: 'standard' }, { icon: '🌲', name: 'Three Months', count: null, tier: 'standard' }, { icon: '🔥🔥', name: 'First Week', count: null, tier: 'standard' }],
    tomorrowKey: 'moon_day', tomorrowTop: 'Family', tomorrowLabel: 'Moderate',
  },
  {
    label: '☀️ Sun Sunday',
    userName: 'Leo',
    vaara: 'Sunday', tithi: 6, tithiName: 'Shashthi', nakshatra: 'Hasta',
    isPurnima: false, isAmavasya: false, isChaturdashi: false,
    isNakshatraBirthday: false, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: false, paksha: 'Shukla', timeOfDay: 'morning',
    scores: { love: 62, career: 58, health: 88, money: 64, social: 70, family: 60 },
    streak: 21,
    vibeText: "The Sun shines clearly through Hasta nakshatra — a skilled, practical energy. Your health and vitality peak this morning. Use the energy for physical activity, self-care, and preparing your intentions for the week.",
    doTips: ["Get outside for at least 30 minutes — sun energy is high", "Start a new physical habit today — momentum is on your side", "Write down three things you're grateful for this morning"],
    avoidTips: ["Don't skip your meals to power through work", "Avoid mindless scrolling when you should be resting", "Skip the self-criticism spiral — it changes nothing and drains everything"],
    badges: [{ icon: '☀️', name: 'Solstice Keeper', count: 2, tier: 'silver' }, { icon: '🔥🔥', name: 'First Week', count: null, tier: 'standard' }, { icon: '🌿', name: 'First Week', count: null, tier: 'standard' }],
    tomorrowKey: 'default', tomorrowTop: 'Career', tomorrowLabel: 'High Energy',
  },
  {
    label: '🧠 Mercury Wednesday',
    userName: 'Priya',
    vaara: 'Wednesday', tithi: 7, tithiName: 'Saptami', nakshatra: 'Chitra',
    isPurnima: false, isAmavasya: false, isChaturdashi: false,
    isNakshatraBirthday: false, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: false, paksha: 'Shukla', timeOfDay: 'afternoon',
    scores: { love: 66, career: 90, health: 60, money: 72, social: 86, family: 58 },
    streak: 12,
    vibeText: "Mercury sharpens everything on Chitra nakshatra — precision, beauty, and sharp communication are your gifts today. Your career and social energy peak simultaneously. A well-crafted message today could open something significant.",
    doTips: ["Pitch your idea today — your words carry extra clarity", "Block 2 hours of deep, uninterrupted work this morning", "Reply to messages you've been sitting on"],
    avoidTips: ["Don't send that critical email before rereading it twice", "Avoid multitasking — scattered focus will cost you more than it saves", "Don't suppress a creative idea because it feels too bold"],
    badges: [{ icon: '💫', name: 'First Connection', count: null, tier: 'standard' }, { icon: '📲', name: 'Sky Sharer', count: 4, tier: 'standard' }, { icon: '🌙', name: 'Moonwalker', count: null, tier: 'standard' }],
    tomorrowKey: 'jupiter_day', tomorrowTop: 'Money', tomorrowLabel: 'High Energy',
  },
  {
    label: '💛 Venus Friday',
    userName: 'Nina',
    vaara: 'Friday', tithi: 5, tithiName: 'Panchami', nakshatra: 'Rohini',
    isPurnima: false, isAmavasya: false, isChaturdashi: false,
    isNakshatraBirthday: false, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: false, paksha: 'Shukla', timeOfDay: 'evening',
    scores: { love: 95, career: 60, health: 72, money: 74, social: 88, family: 70 },
    streak: 33,
    vibeText: "Rohini nakshatra is the most romantic star in the Vedic sky — and today it falls on Venus's own day. Love and beauty are supercharged. This is not a day to work late. Make a plan for the evening.",
    doTips: ["Plan a date or quality time with your partner today", "Treat yourself to something beautiful today", "Start the creative project you've been sketching in your head"],
    avoidTips: ["Don't skip family commitments for social plans tonight", "Avoid bringing up old arguments — energy today amplifies conflict", "Don't make assumptions about others' feelings — ask instead"],
    badges: [{ icon: '💛', name: 'Venus Evening', count: 5, tier: 'gold' }, { icon: '💫💫', name: 'Rising Star', count: null, tier: 'standard' }, { icon: '🌕', name: 'Full Cycle', count: null, tier: 'standard' }],
    tomorrowKey: 'default', tomorrowTop: 'Love', tomorrowLabel: 'Moderate',
  },
  {
    label: '🌒 Eclipse Day',
    userName: 'Ravi',
    vaara: 'Tuesday', tithi: 14, tithiName: 'Chaturdashi', nakshatra: 'Jyeshtha',
    isPurnima: false, isAmavasya: false, isChaturdashi: true,
    isNakshatraBirthday: false, isTithiBirthday: false, isVaaraBirthday: false,
    starsAlign: false, isEclipse: true, paksha: 'Krishna', timeOfDay: 'afternoon',
    scores: { love: 30, career: 40, health: 35, money: 28, social: 32, family: 38 },
    streak: 3,
    vibeText: "A lunar eclipse on Chaturdashi — Jyeshtha nakshatra intensifies everything it touches. This is not a day for action; it is a day for observation and quiet. The disruption you feel today is clearing space for what comes next.",
    doTips: ["Do a breathing or meditation session today — even 10 minutes", "Journal about your emotional journey on this day", "Practice saying no to one thing that drains your energy"],
    avoidTips: ["Avoid all major decisions today — tomorrow's energy is significantly clearer", "Don't confront difficult people today — wait for the moon to shift", "Skip risky or extreme activities today — this is a high-tension tithi"],
    badges: [{ icon: '🌒', name: 'Eclipse Chaser', count: 1, tier: 'silver' }, { icon: '🔥', name: 'First Spark', count: null, tier: 'standard' }],
    tomorrowKey: 'amavasya', tomorrowTop: 'Health', tomorrowLabel: 'Low Energy',
  },
]

// ── State ────────────────────────────────────────────────────────────────────

const scenarioIdx = ref(0)
const expandedCat = ref(null)

const s = computed(() => SCENARIOS[scenarioIdx.value])
const bgKey = computed(() => resolveBackground(s.value))
const headline = computed(() => resolveHeadline(s.value))
const bg = computed(() => BG[bgKey.value] || BG.clear_sky)
const tint = computed(() => TIME_TINT[s.value.timeOfDay])

const avgScore = computed(() =>
  Math.round(Object.values(s.value.scores).reduce((a, b) => a + b, 0) / 6)
)

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

function step(dir) {
  scenarioIdx.value = (scenarioIdx.value + dir + SCENARIOS.length) % SCENARIOS.length
  expandedCat.value = null
}

function randomize() {
  const prev = scenarioIdx.value
  let next = prev
  while (next === prev && SCENARIOS.length > 1) next = Math.floor(Math.random() * SCENARIOS.length)
  scenarioIdx.value = next
  expandedCat.value = null
}

function toggleCat(key) {
  expandedCat.value = expandedCat.value === key ? null : key
}

function catBand(key) {
  const score = s.value.scores[key]
  return score >= 71 ? 'high' : score >= 41 ? 'moderate' : 'low'
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
    </div>

    <!-- ── Phone ── -->
    <PhoneFrame :show-back="false">
      <div class="today-page" :style="{ background: bg }">

        <!-- Stars pattern -->
        <div class="stars" />

        <!-- Time-of-day tint -->
        <div class="tint" :style="{ background: tint }" />

        <!-- Scrollable content -->
        <div class="scroll">

          <!-- ── Block 0: Header ── -->
          <header class="ph-header">
            <div>
              <p class="ph-date">{{ todayDate }}</p>
              <p class="ph-greeting">{{ greeting }}, {{ s.userName }}</p>
            </div>
            <div class="ph-header-right">
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

          <!-- ── Block 3: Do / Avoid ── -->
          <section class="section">
            <p class="sec-label">DO / AVOID</p>
            <div class="do-avoid glass">
              <div class="da-col">
                <p class="da-head do-head">✅  DO</p>
                <ul class="da-list">
                  <li v-for="tip in s.doTips" :key="tip">{{ tip }}</li>
                </ul>
              </div>
              <div class="da-sep" />
              <div class="da-col">
                <p class="da-head avoid-head">⚡  AVOID</p>
                <ul class="da-list">
                  <li v-for="tip in s.avoidTips" :key="tip">{{ tip }}</li>
                </ul>
              </div>
            </div>
            <button class="share-btn">📲  Share card · #Bisou</button>
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

          <!-- ── Block 6: Moon Streak ── -->
          <section class="section">
            <p class="sec-label">MOON STREAK</p>
            <div class="moon-card glass">
              <div class="moon-top">
                <!-- SVG progress ring -->
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
                  <p class="streak-big">🔥 {{ s.streak }}</p>
                  <p class="streak-sub">day streak</p>
                  <p class="streak-phase">{{ moonPhaseLabel(s.tithi) }}</p>
                  <p class="streak-phase">Day {{ s.tithi }} of lunar cycle</p>
                </div>
              </div>

              <!-- Last 9 days moon strip -->
              <div class="moon-strip">
                <span v-for="(icon, i) in last9" :key="i" class="moon-dot" :class="{ 'moon-dot--today': i === 8 }">{{ icon }}</span>
              </div>
              <p class="strip-caption">Last 9 days</p>

              <!-- Progress goal -->
              <div class="streak-goal">
                <template v-if="s.streak < 7">
                  <span>{{ 7 - s.streak }} days to unlock 🔥🔥 First Week</span>
                </template>
                <template v-else-if="s.streak < 14">
                  <span>{{ 14 - s.streak }} days to unlock 🌙 Moonwalker</span>
                </template>
                <template v-else-if="s.streak < 29">
                  <span>{{ 29 - s.streak }} days to Full Lunar Cycle 🌕</span>
                </template>
                <template v-else-if="s.streak < 90">
                  <span>{{ 90 - s.streak }} days to Three Moons ✨</span>
                </template>
                <template v-else>
                  <span>✨ {{ s.streak }}-day streak — legendary</span>
                </template>
              </div>
            </div>
          </section>

          <!-- ── Block 7: Achievements ── -->
          <section class="section">
            <div class="section-head-row">
              <p class="sec-label" style="margin-bottom:0">ACHIEVEMENTS</p>
              <button class="view-all">View all →</button>
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

          <!-- ── Block 8: Tomorrow's Preview ── -->
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
  gap: 8px;
  flex-shrink: 0;
  padding-top: 2px;
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

.notif-btn {
  font-size: 18px;
  opacity: 0.6;
  cursor: pointer;
}

/* ── Block 1: Headline ────────────────────────────────────────────────────── */
.headline-card {
  text-align: center;
  padding: 20px 18px;
  margin-bottom: 20px;
}

.headline-icon-wrap {
  margin-bottom: 8px;
}

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

.cat-icon { font-size: 14px; line-height: 1; }

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

/* Expand animation */
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

.da-col {
  flex: 1;
  padding: 14px 12px;
}

.da-sep {
  width: 1px;
  background: rgba(255,255,255,0.1);
  flex-shrink: 0;
}

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
  gap: 7px;
}

.da-list li {
  font-size: 11px;
  line-height: 1.5;
  color: rgba(255,255,255,0.75);
  padding-left: 10px;
  position: relative;
}

.da-list li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: rgba(255,255,255,0.3);
}

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
.vibe-card {
  padding: 18px 16px;
}

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
.your-day {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

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

.slot-icon { font-size: 16px; flex-shrink: 0; }

.slot-name {
  font-size: 13px;
  font-weight: 700;
  color: white;
}

.slot-time {
  font-size: 10px;
  color: rgba(255,255,255,0.4);
  margin-left: 4px;
  font-weight: 600;
}

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
  filter: drop-shadow(0 0 4px rgba(0,0,0,0.5));
}

.streak-info {
  flex: 1;
}

.streak-big {
  font-size: 24px;
  font-weight: 800;
  color: #ffcc60;
  line-height: 1;
  margin-bottom: 2px;
}

.streak-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  margin-bottom: 8px;
  font-weight: 600;
}

.streak-phase {
  font-size: 11px;
  color: rgba(255,255,255,0.55);
  line-height: 1.5;
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

.badge-ic { font-size: 20px; line-height: 1; }

.badge-name {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.85);
  line-height: 1.3;
}

.badge-count {
  font-size: 10px;
  color: rgba(255,220,60,0.8);
  font-weight: 700;
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
  filter: drop-shadow(0 0 6px rgba(255,255,255,0.3));
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
  color: rgba(255,255,255,0.65);
}

.demo-note {
  font-size: 10px;
  color: rgba(255,255,255,0.25);
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.04em;
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
</style>
