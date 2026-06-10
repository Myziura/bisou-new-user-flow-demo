<script setup>
import { useRouter } from "vue-router";
import PhoneFrame from "../../components/PhoneFrame.vue";
import BisouButton from "../../components/BisouButton.vue";

const router = useRouter();

const stars = [
  { left: 6,  top: 8,  size: 1.5, delay: 0.0 },
  { left: 18, top: 20, size: 2,   delay: 1.2 },
  { left: 82, top: 6,  size: 2,   delay: 0.6 },
  { left: 91, top: 30, size: 1,   delay: 1.9 },
  { left: 48, top: 14, size: 1.5, delay: 2.3 },
  { left: 65, top: 38, size: 1,   delay: 0.4 },
  { left: 12, top: 48, size: 1,   delay: 1.5 },
  { left: 94, top: 54, size: 1.5, delay: 0.8 },
  { left: 30, top: 64, size: 1,   delay: 2.7 },
  { left: 74, top: 70, size: 2,   delay: 1.7 },
  { left: 55, top: 82, size: 1,   delay: 0.2 },
  { left: 38, top: 90, size: 1.5, delay: 3.1 },
];

const claims = [
  { icon: "↑", text: "Your rising sign — who you really are" },
  { icon: "🌙", text: "Moon sign — your emotional blueprint" },
  { icon: "✦", text: "Nakshatra — 27× more precise than Western" },
];
</script>

<template>
  <PhoneFrame :show-back="false">
    <div class="page">
      <!-- Ambient background -->
      <div class="page__bg" aria-hidden="true">
        <div class="orb orb--1" />
        <div class="orb orb--2" />
        <div class="orb orb--3" />
        <div
          v-for="(s, i) in stars"
          :key="i"
          class="star"
          :style="{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
          }"
        />
      </div>

      <div class="page__scroll">
        <!-- Hero -->
        <header class="hero">
          <div class="hero__badge">
            <span class="hero__badge-dot" />
            Vedic Astrology
          </div>

          <h1 class="hero__title">
            Your zodiac sign<br />
            is <span class="hero__title-accent">probably wrong.</span>
          </h1>

          <p class="hero__hook">
            Western astrology is frozen in <strong>300 AD</strong>. The sky has shifted
            23° since then — and so has your real sign.
          </p>
        </header>

        <!-- Western → Vedic comparison -->
        <div class="compare">
          <div class="compare__card compare__card--old">
            <span class="compare__tag">Western</span>
            <p class="compare__desc">Fixed star map<br />~300 AD</p>
          </div>

          <div class="compare__arrow">
            <div class="compare__arrow-line" />
            <div class="compare__arrow-badge">23° drift</div>
            <div class="compare__arrow-line" />
          </div>

          <div class="compare__card compare__card--new">
            <span class="compare__tag compare__tag--active">Vedic</span>
            <p class="compare__desc">Live sky<br />tonight</p>
            <div class="compare__glow" />
          </div>
        </div>

        <!-- What you'll discover -->
        <div class="discover">
          <p class="discover__label">What you'll discover</p>
          <ul class="discover__list">
            <li v-for="item in claims" :key="item.text" class="discover__item">
              <span class="discover__icon">{{ item.icon }}</span>
              <span class="discover__text">{{ item.text }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Sticky footer -->
      <footer class="page__footer">
        <div class="footer__trust">
          <div class="footer__trust-dots">
            <span v-for="n in 5" :key="n" class="footer__dot" />
          </div>
          <span class="footer__trust-text">Free · Takes 20 seconds</span>
        </div>
        <BisouButton class="cta-btn" @click="router.push('/birth-details')">
          Find my real sign
        </BisouButton>
        <button
          type="button"
          class="signin-link"
          @click="router.push('/sign-in')"
        >
          I already have an account
        </button>
      </footer>
    </div>
  </PhoneFrame>
</template>

<style scoped>
.page {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    175deg,
    #060d2e 0%,
    #1a1f6e 30%,
    #2e3595 55%,
    #7b5ea7 78%,
    #c4806a 92%,
    #f0b490 100%
  );
  color: var(--neutral-0);
}

/* ── Background ── */
.page__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float 16s ease-in-out infinite;
}

.orb--1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -80px;
  background: rgba(120, 40, 255, 0.4);
}

.orb--2 {
  width: 240px;
  height: 240px;
  top: 25%;
  right: -70px;
  background: rgba(255, 120, 60, 0.28);
  animation-delay: -6s;
}

.orb--3 {
  width: 200px;
  height: 200px;
  bottom: 20%;
  left: 10%;
  background: rgba(60, 80, 180, 0.3);
  animation-delay: -10s;
}

.star {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
  animation: twinkle 3.5s ease-in-out infinite;
}

/* ── Scroll content ── */
.page__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: var(--screen-pt-safe) var(--screen-px) 20px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ── Hero ── */
.hero {
  animation: riseIn 0.7s ease both;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 18px;
  backdrop-filter: blur(8px);
}

.hero__badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--orange-5);
  box-shadow: 0 0 8px var(--orange-5);
  animation: pulse-dot 2s ease infinite;
}

.hero__title {
  font-family: var(--font-serif);
  font-size: 40px;
  line-height: 1.07;
  color: var(--neutral-0);
  margin-bottom: 16px;
  text-shadow: 0 4px 32px rgba(0, 0, 0, 0.3);
}

.hero__title-accent {
  background: linear-gradient(125deg, #ffd4b8 0%, #ff9f71 45%, #ff6b35 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero__hook {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.72);
}

.hero__hook strong {
  color: var(--orange-5);
  font-weight: 600;
}

/* ── Compare widget ── */
.compare {
  display: flex;
  align-items: center;
  gap: 0;
  animation: riseIn 0.7s ease 0.1s both;
}

.compare__card {
  flex: 1;
  min-width: 0;
  padding: 16px 12px;
  border-radius: var(--radius-lg);
  text-align: center;
  position: relative;
}

.compare__card--old {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.compare__card--new {
  background: rgba(255, 255, 255, 0.14);
  border: 1.5px solid rgba(255, 138, 82, 0.7);
  box-shadow:
    0 0 32px rgba(255, 138, 82, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  overflow: hidden;
}

.compare__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 100%, rgba(255, 138, 82, 0.18) 0%, transparent 70%);
  pointer-events: none;
}

.compare__tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 8px;
}

.compare__tag--active {
  color: var(--orange-5);
}

.compare__desc {
  font-size: 13px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.6);
}

.compare__card--new .compare__desc {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.compare__arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 52px;
  flex-shrink: 0;
  gap: 5px;
}

.compare__arrow-line {
  width: 1px;
  height: 18px;
  background: linear-gradient(180deg, transparent, rgba(255, 138, 82, 0.7), transparent);
}

.compare__arrow-badge {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--orange-5);
  background: rgba(255, 138, 82, 0.15);
  border: 1px solid rgba(255, 138, 82, 0.4);
  padding: 5px 7px;
  border-radius: 999px;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
}

/* ── Discover ── */
.discover {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius-xl);
  padding: 18px 18px 16px;
  animation: riseIn 0.7s ease 0.2s both;
}

.discover__label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 14px;
}

.discover__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.discover__item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.discover__icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.discover__text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.35;
}

/* ── Footer ── */
.page__footer {
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  padding: 16px var(--screen-px) var(--screen-pb);
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: linear-gradient(180deg, transparent 0%, rgba(10, 16, 58, 0.92) 28%);
}

.footer__trust {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.footer__trust-dots {
  display: flex;
  gap: 3px;
}

.footer__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--orange-5);
  opacity: 0.7;
}

.footer__dot:nth-child(3) {
  opacity: 1;
  box-shadow: 0 0 8px var(--orange-5);
}

.footer__trust-text {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.02em;
}

:deep(.cta-btn) {
  font-size: 17px;
  font-weight: 700;
  padding: 18px 24px;
  background: linear-gradient(135deg, #ff9f52 0%, #ff6e26 100%);
  box-shadow:
    0 8px 32px rgba(255, 110, 38, 0.5),
    0 0 0 1px rgba(255, 160, 82, 0.3);
  letter-spacing: 0.01em;
  transition: transform 0.15s, box-shadow 0.15s;
}

:deep(.cta-btn:hover) {
  transform: translateY(-2px);
  box-shadow:
    0 12px 40px rgba(255, 110, 38, 0.6),
    0 0 0 1px rgba(255, 160, 82, 0.4);
}

.signin-link {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
}

.signin-link:hover {
  color: rgba(255, 255, 255, 0.7);
}

/* ── Animations ── */
@keyframes riseIn {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.25; transform: scale(0.8); }
  50%       { opacity: 1;    transform: scale(1.2); }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  33%       { transform: translate(12px, -18px); }
  66%       { transform: translate(-8px, 10px); }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 0.7; }
  50%       { opacity: 1; box-shadow: 0 0 14px var(--orange-5); }
}
</style>
