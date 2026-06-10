<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { flowState, getRevealSnapshot } from '../../composables/useFlowState'
import PhoneFrame from '../../components/PhoneFrame.vue'

const router = useRouter()

onMounted(() => {
  if (!flowState.birthDate || !flowState.birthPlace) router.replace('/birth-details')
  else if (!flowState.sunSign) router.replace('/scanning')
})

const SIGN_EMOJI = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
}

const western  = computed(() => flowState.westernSign || '')
const vedic    = computed(() => flowState.vedicSign || flowState.sunSign || '')
const shifted  = computed(() => western.value && vedic.value && western.value !== vedic.value)

// Two real personal insights shown above the wall
const snapshot = computed(() => getRevealSnapshot(flowState))

const nakshatra = computed(() => ({
  name:  flowState.nakshatra      || 'Rohini',
  trait: flowState.nakshatraTrait || 'Creative abundance',
  super: flowState.nakshatraSuperpower || 'Magnetic charm and artistry',
}))

// What unlocks after signup — described, not locked
const unlocks = [
  { emoji: '↑',  title: 'Rising sign (Lagna)',         desc: 'The energy you project — how the world sees you before you say a word.' },
  { emoji: '⏳', title: 'Life period (Mahadasha)',      desc: 'Which planet is running your life right now and what that means for you.' },
  { emoji: '🏠', title: 'Houses — money, love, career', desc: 'Every planet in your chart mapped to a specific life area.' },
  { emoji: '👑', title: 'Yogas — destiny codes',        desc: 'Rare planetary combos that shape wealth, status, and fate.' },
  { emoji: '📅', title: 'Daily chart readings',         desc: 'Personalised guidance each day based on your actual chart.' },
]

const ctaRef = ref(null)

function scrollToCta() {
  ctaRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

function signup(method) {
  flowState.signupMethod = method
  flowState.signedUp = true
  if (method === 'email') {
    router.push('/verify')
  } else {
    flowState.name = method === 'apple' ? 'Alex' : 'Jordan'
    router.push('/almost-there')
  }
}
</script>

<template>
  <PhoneFrame>
    <div class="page">
      <div class="page__bg" aria-hidden="true">
        <div class="orb orb--1" /><div class="orb orb--2" /><div class="orb orb--3" />
      </div>

      <div class="page__scroll">

        <!-- ── Sign reveal ── -->
        <header class="reveal" role="banner">
          <p class="reveal__eyebrow">
            <span class="spark">✦</span> Your real Vedic sign <span class="spark">✦</span>
          </p>
          <div class="sign-hero">
            <div class="sign-hero__halo" aria-hidden="true" />
            <div class="sign-hero__card">
              <span class="sign-hero__emoji">{{ SIGN_EMOJI[vedic] || '✦' }}</span>
              <span class="sign-hero__name">{{ vedic }}</span>
              <p v-if="shifted" class="sign-hero__shift">
                Not {{ western }} — Vedic astrology places you in <strong>{{ vedic }}</strong>
              </p>
              <p v-else class="sign-hero__shift">
                <strong>{{ vedic }}</strong> — confirmed in both systems
              </p>
            </div>
          </div>
        </header>

        <!-- ── Two real personal insights ── -->
        <section class="insights">
          <!-- Nakshatra — most exotic/compelling, shown first -->
          <div class="insight-card insight-card--nakshatra">
            <div class="insight-card__accent" />
            <div class="insight-card__head">
              <span class="insight-card__icon">✦</span>
              <div>
                <p class="insight-card__kicker">Your birth star (Nakshatra)</p>
                <p class="insight-card__title">{{ nakshatra.name }}</p>
              </div>
            </div>
            <p class="insight-card__body">
              <strong>{{ nakshatra.trait }}</strong> — {{ nakshatra.super.charAt(0).toLowerCase() + nakshatra.super.slice(1) }}.
            </p>
            <div class="insight-card__footer">
              <p class="insight-card__footnote">27× more precise than your Western sun sign</p>
              <button type="button" class="insight-card__more" @click="scrollToCta()">Full analysis →</button>
            </div>
          </div>

          <!-- Moon sign -->
          <div v-if="snapshot.layers[0]" class="insight-card insight-card--moon">
            <div class="insight-card__accent" />
            <div class="insight-card__head">
              <span class="insight-card__icon">🌙</span>
              <div>
                <p class="insight-card__kicker">Your moon sign</p>
                <p class="insight-card__title">{{ snapshot.layers[0].label }}</p>
              </div>
            </div>
            <p class="insight-card__body">
              You are {{ snapshot.layers[0].body }}.
            </p>
            <div class="insight-card__footer">
              <button type="button" class="insight-card__more" @click="scrollToCta()">Read full reading →</button>
            </div>
          </div>
        </section>

        <!-- ── CTA ── -->
        <section ref="ctaRef" class="cta">
          <div class="cta__glow" aria-hidden="true" />
          <div class="cta__card">
            <div class="cta__shine" />
            <p class="cta__headline">Get your full Vedic chart</p>
            <p class="cta__sub">Sign up free — takes 10 seconds.</p>

            <div class="cta__buttons">
              <button type="button" class="btn btn--apple" @click="signup('apple')">
                <svg class="btn__icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continue with Apple
              </button>
              <button type="button" class="btn btn--google" @click="signup('google')">
                <svg class="btn__icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <button type="button" class="btn btn--email" @click="signup('email')">
                Continue with email
              </button>
            </div>

            <button type="button" class="cta__signin" @click="router.push('/sign-in')">
              Already have an account? <strong>Sign in</strong>
            </button>
            <p class="cta__legal">
              By continuing you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
            </p>
          </div>
        </section>

        <!-- ── What else is waiting ── -->
        <section class="more">
          <p class="more__eyebrow">Also included in your full chart</p>
          <ul class="more__list">
            <li v-for="item in unlocks" :key="item.title" class="more__item">
              <span class="more__item-icon">{{ item.emoji }}</span>
              <div class="more__item-body">
                <p class="more__item-title">{{ item.title }}</p>
                <p class="more__item-desc">{{ item.desc }}</p>
              </div>
              <span class="more__item-badge">Free</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  </PhoneFrame>
</template>

<style scoped>
/* ── Page ── */
.page {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
  background: linear-gradient(175deg, #0b1130 0%, #181e58 28%, #2e1f6e 58%, #3a2060 80%, #1c1240 100%);
}

.page__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float 16s ease-in-out infinite;
}
.orb--1 { width: 300px; height: 300px; top: -80px;  right: -100px; background: rgba(200, 80, 40, 0.18); }
.orb--2 { width: 240px; height: 240px; top: 30%;    left: -90px;   background: rgba(60, 40, 180, 0.22); animation-delay: -5s; }
.orb--3 { width: 200px; height: 200px; bottom: 10%; right: -60px;  background: rgba(140, 70, 200, 0.15); animation-delay: -10s; }

/* ── Scroll ── */
.page__scroll {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: var(--screen-pt-safe) var(--screen-px) var(--screen-pb);
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ── Sign reveal ── */
.reveal {
  text-align: center;
  animation: fadeUp 0.6s ease both;
}

.reveal__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 12px;
}

.spark {
  color: var(--orange-5);
  font-size: 9px;
  animation: twinkle 2s ease-in-out infinite;
}
.spark:last-child { animation-delay: 1s; }

.sign-hero {
  position: relative;
  display: inline-block;
}

.sign-hero__halo {
  position: absolute;
  inset: -16px -24px;
  background: radial-gradient(circle, rgba(255, 138, 82, 0.28) 0%, transparent 65%);
}

.sign-hero__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 20px 40px 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.sign-hero__emoji {
  font-size: 48px;
  line-height: 1;
  filter: drop-shadow(0 4px 14px rgba(255, 138, 82, 0.35));
  animation: gentle-pulse 3s ease-in-out infinite;
}

.sign-hero__name {
  font-family: var(--font-serif);
  font-size: 28px;
  color: var(--neutral-0);
  letter-spacing: 0.02em;
}

.sign-hero__shift {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
}

.sign-hero__shift strong {
  color: rgba(255, 200, 150, 0.95);
  font-weight: 600;
}

/* ── Personal insight cards ── */
.insights {
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: fadeUp 0.6s ease 0.07s both;
}

.insight-card {
  position: relative;
  padding: 14px 14px 14px 18px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.insight-card__accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  border-radius: 2px 0 0 2px;
}

.insight-card--nakshatra .insight-card__accent { background: #a855f7; box-shadow: 0 0 10px #a855f7; }
.insight-card--moon      .insight-card__accent { background: #7b8cf7; box-shadow: 0 0 10px #7b8cf7; }

.insight-card__head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.insight-card__icon {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.insight-card__kicker {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 1px;
}

.insight-card__title {
  font-size: 16px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.2;
}

.insight-card__body {
  font-size: 13.5px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.7);
}

.insight-card__body strong {
  color: rgba(255, 255, 255, 0.92);
  font-weight: 600;
}

.insight-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  gap: 8px;
}

.insight-card__footnote {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  font-style: italic;
  margin: 0;
}

.insight-card__more {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 0;
  transition: color 0.15s;
  letter-spacing: 0.01em;
}

.insight-card__more:hover { color: rgba(255, 255, 255, 0.85); }

/* ── "More" section ── */
.more {
  animation: fadeUp 0.6s ease 0.18s both;
}

.more__eyebrow {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 10px;
}

.more__list {
  list-style: none;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.more__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  transition: background 0.15s;
}

.more__item:last-child { border-bottom: none; }
.more__item:hover { background: rgba(255, 255, 255, 0.05); }

.more__item-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 9px;
}

.more__item-body { flex: 1; min-width: 0; }

.more__item-title {
  font-size: 13.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.2;
  margin-bottom: 1px;
}

.more__item-desc {
  font-size: 11.5px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.45);
}

.more__item-badge {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #5cd685;
  background: rgba(92, 214, 133, 0.1);
  padding: 3px 8px;
  border-radius: 100px;
  border: 1px solid rgba(92, 214, 133, 0.25);
}

/* ── CTA ── */
.cta {
  position: relative;
  animation: fadeUp 0.6s ease 0.12s both;
}

.cta__glow {
  position: absolute;
  top: -20px;
  left: 8%; right: 8%;
  height: 60px;
  background: radial-gradient(ellipse, rgba(255, 138, 82, 0.45) 0%, transparent 70%);
  filter: blur(16px);
  pointer-events: none;
}

.cta__card {
  position: relative;
  background: linear-gradient(145deg, #0d1444, #171f60 50%, #0f1a50);
  border-radius: var(--radius-xl);
  padding: 20px 18px 14px;
  border: 1.5px solid rgba(255, 138, 82, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.07);
  overflow: hidden;
}

.cta__shine {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.28), transparent);
}

.cta__headline {
  font-family: var(--font-serif);
  font-size: 24px;
  color: var(--neutral-0);
  text-align: center;
  margin-bottom: 4px;
  line-height: 1.15;
}

.cta__sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  margin-bottom: 16px;
}

.cta__buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 15px 20px;
  border-radius: var(--radius);
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.btn:active { transform: scale(0.98); }

.btn--apple,
.btn--google {
  color: var(--neutral-900);
  background: var(--neutral-0);
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.18);
}

.btn--apple:hover,
.btn--google:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.22);
}

.btn--email {
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.07);
  border: 1.5px solid rgba(255, 255, 255, 0.13);
}

.btn__icon { width: 20px; height: 20px; flex-shrink: 0; }

.cta__signin {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.32);
  padding: 8px 4px 2px;
  background: none;
  border: none;
  cursor: pointer;
}

.cta__signin strong { color: var(--orange-5); font-weight: 600; }

.cta__legal {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.2);
  text-align: center;
  line-height: 1.5;
  margin-top: 4px;
}

.cta__legal a { color: rgba(255, 255, 255, 0.3); text-decoration: underline; text-underline-offset: 2px; }

/* ── Animations ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  33%       { transform: translate(12px, -16px); }
  66%       { transform: translate(-8px, 10px); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.35; transform: scale(0.85); }
  50%       { opacity: 1;    transform: scale(1.15); }
}

@keyframes gentle-pulse {
  0%, 100% { filter: drop-shadow(0 4px 14px rgba(255, 138, 82, 0.35)); }
  50%       { filter: drop-shadow(0 6px 22px rgba(255, 138, 82, 0.6)); }
}
</style>
