<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { flowState } from "../../composables/useFlowState";
import PhoneFrame from "../../components/PhoneFrame.vue";

const router = useRouter();

onMounted(() => {
  if (!flowState.birthDate) router.replace("/birth-date");
});

const SIGN_EMOJI = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
};

const western = computed(() => flowState.westernSign || "your old sign");
const vedic = computed(
  () => flowState.vedicSign || flowState.sunSign || "your real sign",
);

const benefits = [
  {
    emoji: "☀",
    title: "Daily reading",
    desc: "Personalized every morning, built on your chart",
    accent: "var(--orange-6)",
  },
  {
    emoji: "✨",
    title: "Highlights & watch-fors",
    desc: "What to lean into — and what to watch out for",
    accent: "var(--blue-5)",
  },
  {
    emoji: "🗺",
    title: "Full birth chart",
    desc: "Moon, rising, nakshatra & all 12 houses",
    accent: "#9610ff",
  },
  {
    emoji: "♡",
    title: "Compatibility & Connect",
    desc: "Reports for loved ones + people matched to you",
    accent: "var(--success)",
  },
];

function signup(method) {
  flowState.signupMethod = method;
  flowState.signedUp = true;
  if (method === "email") {
    router.push("/verify");
  } else {
    flowState.name = method === "apple" ? "Alex" : "Jordan";
    router.push("/almost-there");
  }
}
</script>

<template>
  <PhoneFrame>
    <div class="page">
      <div class="page__bg" aria-hidden="true">
        <div class="orb orb--1" />
        <div class="orb orb--2" />
        <div class="stars" />
      </div>

      <div class="page__scroll">
        <header class="reveal">
          <p class="reveal__eyebrow">
            <span class="spark">✦</span>
            Your real sign
            <span class="spark">✦</span>
          </p>

          <div class="sign-hero">
            <div class="sign-hero__halo" aria-hidden="true" />
            <div class="sign-hero__card">
              <span class="sign-hero__emoji">{{ SIGN_EMOJI[vedic] }}</span>
              <span class="sign-hero__name">{{ vedic }}</span>
              <p class="sign-hero__shift">
                Not {{ western }} — you're <strong>{{ vedic }}</strong>
              </p>
            </div>
          </div>

          <p class="reveal__trust">
            Vedic astrology · where the sun was in the sky on your birthday
          </p>
        </header>

        <section class="unlock">
          <h1 class="unlock__title">Unlock your full chart</h1>
          <p class="unlock__sub">Sign up free — here's what's waiting for you</p>

          <ul class="benefits">
            <li
              v-for="(item, i) in benefits"
              :key="item.title"
              class="benefit"
              :style="{ '--accent': item.accent, '--delay': `${0.1 + i * 0.05}s` }">
              <span class="benefit__emoji">{{ item.emoji }}</span>
              <div class="benefit__text">
                <p class="benefit__title">{{ item.title }}</p>
                <p class="benefit__desc">{{ item.desc }}</p>
              </div>
            </li>
          </ul>
        </section>

        <section class="cta">
          <div class="cta__glow" aria-hidden="true" />

          <div class="cta__card">
            <p class="cta__label">Create your free account</p>

            <div class="cta__buttons">
              <button type="button" class="btn btn--primary" @click="signup('apple')">
                <svg class="btn__icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continue with Apple
              </button>

              <button type="button" class="btn btn--primary" @click="signup('google')">
                <svg class="btn__icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <button type="button" class="btn btn--ghost" @click="signup('email')">
                Continue with email
              </button>
            </div>

            <button
              type="button"
              class="cta__signin"
              @click="router.push('/sign-in')">
              Already have an account? <strong>Sign in</strong>
            </button>

            <p class="cta__legal">
              By continuing you agree to our <a href="#">Terms</a> and
              <a href="#">Privacy Policy</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  </PhoneFrame>
</template>

<style scoped>
.page {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
  background: var(--gradient-sky-sun-light);
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
  filter: blur(70px);
  animation: drift 14s ease-in-out infinite;
}

.orb--1 {
  width: 280px;
  height: 280px;
  top: -70px;
  right: -90px;
  background: rgba(255, 138, 82, 0.32);
}

.orb--2 {
  width: 220px;
  height: 220px;
  top: 35%;
  left: -80px;
  background: rgba(62, 78, 162, 0.22);
  animation-delay: -5s;
}

.stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 18% 22%, rgba(255, 255, 255, 0.9) 0%, transparent 100%),
    radial-gradient(1px 1px at 82% 15%, rgba(255, 255, 255, 0.7) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 55% 68%, rgba(255, 255, 255, 0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 38% 88%, rgba(255, 255, 255, 0.75) 0%, transparent 100%);
}

.page__scroll {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: var(--screen-pt-safe) var(--screen-px) var(--screen-pb);
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ── Reveal ── */
.reveal {
  text-align: center;
  animation: fadeUp 0.65s ease both;
}

.reveal__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--blue-5);
  margin-bottom: 18px;
}

.spark {
  color: var(--orange-6);
  font-size: 9px;
}

.sign-hero {
  position: relative;
  display: inline-block;
  margin-bottom: 14px;
}

.sign-hero__halo {
  position: absolute;
  inset: -12px -20px;
  background: radial-gradient(circle, rgba(255, 138, 82, 0.28) 0%, transparent 68%);
  pointer-events: none;
}

.sign-hero__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 28px 44px 22px;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  border-radius: var(--radius-xl);
  border: 1.5px solid rgba(255, 255, 255, 0.9);
  box-shadow:
    0 16px 48px rgba(62, 78, 162, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.sign-hero__emoji {
  font-size: 60px;
  line-height: 1;
  filter: drop-shadow(0 4px 14px rgba(255, 138, 82, 0.3));
}

.sign-hero__name {
  font-family: var(--font-serif);
  font-size: 34px;
  color: var(--blue-5);
  letter-spacing: 0.02em;
  line-height: 1.1;
}

.sign-hero__shift {
  font-size: 14px;
  color: var(--neutral-500);
  margin-top: 4px;
}

.sign-hero__shift strong {
  color: var(--blue-5);
  font-weight: 600;
}

.reveal__trust {
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  color: var(--neutral-500);
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.45);
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.65);
}

/* ── Unlock ── */
.unlock {
  animation: fadeUp 0.65s ease 0.08s both;
}

.unlock__title {
  font-family: var(--font-serif);
  font-size: 24px;
  color: var(--neutral-900);
  text-align: center;
  line-height: 1.15;
  margin-bottom: 4px;
}

.unlock__sub {
  font-size: 14px;
  color: var(--neutral-500);
  text-align: center;
  margin-bottom: 14px;
}

.benefits {
  list-style: none;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  position: relative;
  animation: fadeUp 0.5s ease var(--delay) both;
}

.benefit:not(:last-child) {
  border-bottom: 1px solid rgba(199, 203, 228, 0.45);
}

.benefit::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--accent);
}

.benefit__emoji {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: var(--neutral-0);
  border-radius: 11px;
  box-shadow: var(--shadow-sm);
}

.benefit__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: 1px;
  line-height: 1.3;
}

.benefit__desc {
  font-size: 12px;
  line-height: 1.4;
  color: var(--neutral-500);
}

/* ── CTA ── */
.cta {
  position: relative;
  animation: fadeUp 0.65s ease 0.14s both;
}

.cta__glow {
  position: absolute;
  top: -16px;
  left: 10%;
  right: 10%;
  height: 50px;
  background: radial-gradient(ellipse, rgba(255, 138, 82, 0.45) 0%, transparent 70%);
  filter: blur(16px);
  pointer-events: none;
}

.cta__card {
  position: relative;
  background: var(--gradient-night);
  border-radius: var(--radius-xl);
  padding: 20px 18px 14px;
  border: 1.5px solid rgba(255, 138, 82, 0.38);
  box-shadow: 0 16px 48px rgba(4, 10, 27, 0.22);
  overflow: hidden;
}

.cta__card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
}

.cta__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
  margin-bottom: 14px;
}

.cta__buttons {
  display: flex;
  flex-direction: column;
  gap: 9px;
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

.btn--primary {
  color: var(--neutral-900);
  background: var(--neutral-0);
  box-shadow: 0 2px 12px rgba(4, 10, 27, 0.14);
}

.btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 18px rgba(4, 10, 27, 0.2);
}

.btn--ghost {
  color: rgba(255, 255, 255, 0.8);
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.16);
}

.btn--ghost:hover {
  background: rgba(255, 255, 255, 0.07);
}

.btn__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.cta__signin {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.42);
  padding: 8px 4px 2px;
  background: none;
  border: none;
  cursor: pointer;
}

.cta__signin strong {
  color: var(--orange-5);
  font-weight: 600;
}

.cta__legal {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.28);
  text-align: center;
  line-height: 1.5;
  margin-top: 4px;
}

.cta__legal a {
  color: rgba(255, 255, 255, 0.4);
  text-decoration: underline;
  text-underline-offset: 2px;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes drift {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(16px, -12px); }
}
</style>
