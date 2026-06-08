import { reactive, watch } from 'vue'

const STORAGE_KEY = 'bisou-flow-demo'

const defaultState = () => ({
  birthDate: null,
  birthPlace: '',
  birthTime: '12:00',
  westernSign: '',
  vedicSign: '',
  sunSign: '',
  moonSign: '',
  risingSign: '',
  nakshatra: '',
  name: '',
  attribution: '',
  notificationsEnabled: false,
  preSignupNotificationsAnswered: false,
  signedUp: false,
  signupMethod: null,
  connectIntent: [],
  connectPhotos: [],
  connectLocation: '',
  connectMeetPreference: [],
  connectBio: '',
  connectVibePrompt: '',
  connectPronouns: '',
  connectGender: '',
  connectDatingType: '',
  connectKidsPreference: '',
  connectDistance: '',
  connectSetupComplete: false,
  onboardingComplete: false,
})

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState()
  } catch {
    return defaultState()
  }
}

export const flowState = reactive(loadState())

watch(
  flowState,
  (val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)),
  { deep: true }
)

export function resetFlow() {
  Object.assign(flowState, defaultState())
  localStorage.removeItem(STORAGE_KEY)
}

const WESTERN_SIGNS = [
  { name: 'Capricorn', emoji: '♑', start: [1, 1], end: [1, 19] },
  { name: 'Aquarius', emoji: '♒', start: [1, 20], end: [2, 18] },
  { name: 'Pisces', emoji: '♓', start: [2, 19], end: [3, 20] },
  { name: 'Aries', emoji: '♈', start: [3, 21], end: [4, 19] },
  { name: 'Taurus', emoji: '♉', start: [4, 20], end: [5, 20] },
  { name: 'Gemini', emoji: '♊', start: [5, 21], end: [6, 20] },
  { name: 'Cancer', emoji: '♋', start: [6, 21], end: [7, 22] },
  { name: 'Leo', emoji: '♌', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', emoji: '♍', start: [8, 23], end: [9, 22] },
  { name: 'Libra', emoji: '♎', start: [9, 23], end: [10, 22] },
  { name: 'Scorpio', emoji: '♏', start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', emoji: '♐', start: [11, 22], end: [12, 21] },
  { name: 'Capricorn', emoji: '♑', start: [12, 22], end: [12, 31] },
]

const VEDIC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

const VEDIC_EMOJI = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
}

const NAKSHATRAS = [
  { name: 'Ashwini', trait: 'Pioneering spirit', superpower: 'Quick to act and inspire' },
  { name: 'Bharani', trait: 'Transformative energy', superpower: 'Turning endings into beginnings' },
  { name: 'Rohini', trait: 'Creative abundance', superpower: 'Magnetic charm and artistry' },
  { name: 'Mrigashira', trait: 'Curious seeker', superpower: 'Finding beauty everywhere' },
  { name: 'Ardra', trait: 'Emotional depth', superpower: 'Weathering storms with grace' },
]

function isInRange(month, day, start, end) {
  const d = month * 100 + day
  const s = start[0] * 100 + start[1]
  const e = end[0] * 100 + end[1]
  return d >= s && d <= e
}

export function getWesternSign(month, day) {
  return WESTERN_SIGNS.find((s) => isInRange(month, day, s.start, s.end)) ?? WESTERN_SIGNS[0]
}

/** Demo approximation: Vedic sun sign is ~1 sign earlier than Western */
export function getVedicSign(month, day) {
  const western = getWesternSign(month, day)
  const idx = VEDIC_SIGNS.indexOf(western.name)
  const vedicIdx = (idx - 1 + 12) % 12
  const name = VEDIC_SIGNS[vedicIdx]
  return { name, emoji: VEDIC_EMOJI[name] }
}

export function computeChart(birthDate, birthPlace, birthTime) {
  const [year, month, day] = birthDate.split('-').map(Number)
  const western = getWesternSign(month, day)
  const vedic = getVedicSign(month, day)

  const moonIdx = (month + day) % 12
  const risingIdx = (parseInt(birthTime.split(':')[0], 10) + day) % 12
  const nakshatra = NAKSHATRAS[(month + day + year) % NAKSHATRAS.length]

  return {
    westernSign: western.name,
    westernEmoji: western.emoji,
    vedicSign: vedic.name,
    vedicEmoji: vedic.emoji,
    sunSign: vedic.name,
    moonSign: VEDIC_SIGNS[moonIdx],
    risingSign: VEDIC_SIGNS[risingIdx],
    nakshatra,
  }
}

export function getAge(birthDate) {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export function getDailyReading(sunSign) {
  const readings = {
    Cancer: 'Today invites you to trust your intuition over logic. A conversation you\'ve been avoiding could unlock something meaningful — your moon energy is especially strong this morning.',
    Leo: 'Your natural radiance is amplified today. Lead with warmth, not performance — someone nearby needs your encouragement more than they\'ll admit.',
    default: 'The stars align in your favor today. Pay attention to synchronicities — they\'re pointing you toward an opportunity you\'ve been overlooking.',
  }
  return readings[sunSign] ?? readings.default
}

const MOON_TRAIT = {
  Aries: 'someone who needs emotional space — independence is how you reset',
  Taurus: 'someone who needs calm and consistency to feel safe inside',
  Gemini: 'someone who processes feelings by talking — silence can spiral you',
  Cancer: 'someone who protects what matters — home and loyalty run deep',
  Leo: 'someone who needs to feel valued — appreciation lands more than logic',
  Virgo: 'someone who settles through order — small rituals quiet your mind',
  Libra: 'someone who needs fairness and beauty — imbalance drains you fast',
  Scorpio: 'someone who needs honesty and depth — small talk feels empty',
  Sagittarius: 'someone who needs freedom and hope — routine without meaning suffocates you',
  Capricorn: 'someone who needs respect and progress — feeling stuck hits hard',
  Aquarius: 'someone who needs room to be different — conformity feels suffocating',
  Pisces: 'someone who needs quiet and compassion — harshness exhausts you quickly',
}

const RISING_TRAIT = {
  Aries: 'direct and hard to ignore — people notice your momentum first',
  Taurus: 'calm and grounded — you read as steady before anything else',
  Gemini: 'curious and quick-witted — you come across as always in motion',
  Cancer: 'warm and approachable — people sense your emotional radar early',
  Leo: 'magnetic and expressive — you naturally draw attention in a room',
  Virgo: 'put-together and thoughtful — details show before you even speak',
  Libra: 'charming and balanced — easy to talk to, easy to trust at first',
  Scorpio: 'intense and private — people feel there\'s more beneath the surface',
  Sagittarius: 'open and upbeat — you seem adventure-ready from hello',
  Capricorn: 'composed and capable — older-than-your-years, even when you\'re young',
  Aquarius: 'unique and intriguing — friendly, but not instantly readable',
  Pisces: 'soft and gentle — people underestimate your inner depth at first',
}

const TODAY_HIGHLIGHT = {
  Aries: 'A good day to start something — your instinct is sharper than usual.',
  Taurus: 'Slow and steady wins today — trust what already feels solid.',
  Gemini: 'Conversations open doors — say the thing you\'ve been thinking.',
  Cancer: 'Trust your gut on a personal matter — your intuition is spot-on.',
  Leo: 'Your warmth lands well today — lead with encouragement, not ego.',
  Virgo: 'Small fixes compound — tidy one thing and the rest follows.',
  Libra: 'Collaboration beats solo — the right person shows up if you ask.',
  Scorpio: 'Depth over small talk — an honest chat could shift something stuck.',
  Sagittarius: 'Say yes to something new — a small adventure resets your mood.',
  Capricorn: 'Focus pays off — one disciplined push moves a goal forward.',
  Aquarius: 'Your offbeat idea is the answer — don\'t sand it down for others.',
  Pisces: 'Creative or quiet time refuels you — protect a pocket of solitude.',
}

const TODAY_LOWLIGHT = {
  Aries: 'Impatience spikes easily — pause before pushing when others hesitate.',
  Taurus: 'Stubborn moods — flexibility will save you more than digging in.',
  Gemini: 'Scattered attention — pick one thread or nothing gets finished.',
  Cancer: 'Sensitivity runs high — don\'t take distance from someone personally.',
  Leo: 'Pride stings fast — criticism isn\'t rejection, even when it feels like it.',
  Virgo: 'Overthinking loops — done beats perfect today.',
  Libra: 'People-pleasing drains you — your opinion counts too.',
  Scorpio: 'All-or-nothing reactions — not every slight needs a full investigation.',
  Sagittarius: 'Restlessness — don\'t escape a hard talk by changing the subject.',
  Capricorn: 'Work-mode overload — schedule something that isn\'t productive.',
  Aquarius: 'Emotional detachment — check in with how you actually feel, not just why.',
  Pisces: 'Absorbing others\' moods — return to your own needs before helping everyone else.',
}

export function getRevealSnapshot(state = flowState) {
  const sun = state.sunSign || 'Aries'
  const moon = state.moonSign || 'Cancer'
  const rising = state.risingSign || 'Libra'
  const nakshatra = state.nakshatra || 'your nakshatra'
  const nTrait = state.nakshatraTrait || 'deeply nuanced'
  const nPower = state.nakshatraSuperpower || 'you move through life with a distinct inner rhythm'

  const layers = [
    {
      emoji: '🌙',
      label: `${moon} moon`,
      prefix: `Your ${moon} moon tells us that you are`,
      body: MOON_TRAIT[moon] || MOON_TRAIT.Cancer,
    },
    {
      emoji: '↑',
      label: `${rising} rising`,
      prefix: `Your ${rising} rising tells us that you are`,
      body: RISING_TRAIT[rising] || RISING_TRAIT.Libra,
    },
    {
      emoji: '✦',
      label: nakshatra,
      prefix: `Your ${nakshatra} nakshatra tells us that you are`,
      body: `${nTrait.toLowerCase()} — ${nPower.charAt(0).toLowerCase()}${nPower.slice(1)}`,
    },
  ]

  return {
    layers,
    todayHighlight: TODAY_HIGHLIGHT[sun] || TODAY_HIGHLIGHT.Aries,
    todayLowlight: TODAY_LOWLIGHT[sun] || TODAY_LOWLIGHT.Aries,
  }
}

export function getChartInsights(state = flowState) {
  const sun = state.sunSign || 'your sign'
  const moon = state.moonSign || 'your moon'
  const rising = state.risingSign || 'your rising'

  return [
    {
      emoji: '☉',
      title: `You're a ${sun} at your core`,
      body: `Your sun sign shapes how you express yourself and what drives you day to day.`,
    },
    {
      emoji: '☽',
      title: `${moon} moon — how you feel`,
      body: `Your moon sign explains your emotional instincts and what helps you feel safe.`,
    },
    {
      emoji: '↑',
      title: `${rising} rising — your first impression`,
      body: `Your rising sign is the energy people pick up before they really know you.`,
    },
    {
      emoji: '✦',
      title: state.nakshatra ? `${state.nakshatra} energy` : 'Your nakshatra',
      body: state.nakshatraTrait || 'A deeper layer of your chart that adds nuance to how you move through the world.',
    },
  ]
}

const OPTIONAL_FIELDS = [
  { key: 'connectBio', label: 'Bio', hint: 'Give people a reason to swipe right.', weight: 12 },
  { key: 'connectVibePrompt', label: 'You\'ll vibe with me if…', hint: 'The #1 thing people read on your profile.', weight: 15 },
  { key: 'connectPronouns', label: 'Pronouns', hint: 'Let people know how to refer to you.', weight: 5 },
  { key: 'connectDatingType', label: 'What kind of dating', hint: 'We\'ll prioritize people who want the same thing.', weight: 10, datingOnly: true },
  { key: 'connectKidsPreference', label: 'Kids preference', hint: 'Match with people on the same page.', weight: 5, datingOnly: true },
  { key: 'connectDistance', label: 'Distance preference', hint: 'Down the street or down to travel?', weight: 5 },
]

export function getProfileStrength(state = flowState) {
  const hasDating = state.connectIntent.includes('dating')
  let earned = 0
  let total = 40

  if (state.connectIntent.length > 0) earned += 8
  if (state.connectGender) earned += 8
  if (state.connectPhotos.length > 0) earned += 8
  if (state.connectMeetPreference.length > 0) earned += 8
  if (state.connectLocation) earned += 8

  const optionalFields = OPTIONAL_FIELDS.filter((f) => !f.datingOnly || hasDating)
  optionalFields.forEach((f) => {
    total += f.weight
    if (state[f.key]) earned += f.weight
  })

  const percent = total > 0 ? Math.round((earned / total) * 100) : 0

  return {
    percent,
    canSwipe:
      state.connectIntent.length > 0
      && state.connectGender
      && state.connectPhotos.length > 0
      && state.connectMeetPreference.length > 0
      && state.connectLocation,
    optionalFields: optionalFields.map((f) => ({
      ...f,
      filled: Boolean(state[f.key]),
      value: state[f.key],
    })),
    required: {
      intent: state.connectIntent.length > 0,
      identity: Boolean(state.connectGender),
      photo: state.connectPhotos.length > 0,
      meetPreference: state.connectMeetPreference.length > 0,
      location: Boolean(state.connectLocation),
    },
  }
}

export function getNextConnectStep(state = flowState) {
  const strength = getProfileStrength(state)
  if (!strength.required.intent) return '/connect/setup?step=intent'
  if (!strength.required.identity) return '/connect/setup?step=identity'
  if (!strength.required.photo) return '/connect/setup?step=photo'
  if (!strength.required.meetPreference) return '/connect/setup?step=preference'
  if (!strength.required.location) return '/connect/setup?step=location'
  return '/connect/swipe'
}
