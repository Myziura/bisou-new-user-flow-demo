<script setup>
import { useRouter } from "vue-router";
import PhoneFrame from "../../components/PhoneFrame.vue";
import BisouButton from "../../components/BisouButton.vue";

const router = useRouter();

const stars = [
  { left: 8, top: 12, size: 2, delay: 0.3 },
  { left: 22, top: 28, size: 1.5, delay: 1.1 },
  { left: 78, top: 8, size: 2, delay: 0.7 },
  { left: 88, top: 34, size: 1, delay: 1.8 },
  { left: 45, top: 18, size: 1.5, delay: 2.2 },
  { left: 62, top: 42, size: 1, delay: 0.5 },
  { left: 15, top: 52, size: 1, delay: 1.4 },
  { left: 92, top: 58, size: 1.5, delay: 0.9 },
  { left: 35, top: 68, size: 1, delay: 2.6 },
  { left: 70, top: 72, size: 2, delay: 1.6 },
];

const promises = [
  {
    emoji: "♈",
    label: "Your real Vedic sun sign — not the one you grew up with",
  },
  { emoji: "☀", label: "Daily readings built on where the stars are tonight" },
  { emoji: "♡", label: "Compatibility that actually matches your chart" },
];
</script>

<template>
  <PhoneFrame :show-back="false">
    <div class="hook-page">
      <div class="hook-page__sky" aria-hidden="true">
        <div class="orb orb--1" />
        <div class="orb orb--2" />
        <div class="orb orb--3" />
        <div
          v-for="(star, i) in stars"
          :key="i"
          class="star"
          :style="{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }" />
      </div>

      <div class="hook-scroll">
        <header class="hook-hero">
          <p class="hook-eyebrow">
            <span class="hook-spark">✦</span>
            The sky moved. Your sign didn't.
            <span class="hook-spark">✦</span>
          </p>

          <h1 class="hook-title">
            Your zodiac sign is<br />
            <span class="hook-title__accent">probably wrong.</span>
          </h1>

          <div class="drift-visual" aria-hidden="true">
            <div class="drift-card drift-card--old">
              <span class="drift-card__label">Western</span>
              <span class="drift-card__sub">
                Fixed sky<br />
                ~300 AD
              </span>
            </div>
            <div class="drift-bridge">
              <span class="drift-bridge__line" />
              <span class="drift-bridge__badge">
                ~23°<br />
                drift
              </span>
              <span class="drift-bridge__line" />
            </div>
            <div class="drift-card drift-card--new">
              <span class="drift-card__label">Vedic</span>
              <span class="drift-card__sub">
                Live sky<br />
                tonight
              </span>
            </div>
          </div>

          <p class="hook-lead">
            Western astrology still uses a star map that's roughly
            <strong>1,500 years out of date</strong>. Vedic astrology tracks
            where the constellations actually sit right now — and for many
            people, that changes everything.
          </p>
        </header>

        <section class="promise-block">
          <p class="promise-headline">
            In <strong>20 seconds</strong>, we'll find your real sign — and show
            you what it means for you.
          </p>
          <ul class="promise-list">
            <li v-for="item in promises" :key="item.label">
              <span class="promise-list__emoji">{{ item.emoji }}</span>
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </section>
      </div>

      <footer class="hook-footer">
        <BisouButton @click="router.push('/birth-date')">
          Find my real sign
        </BisouButton>
        <button
          type="button"
          class="sign-in-link"
          @click="router.push('/sign-in')">
          I already have an account
        </button>
      </footer>
    </div>
  </PhoneFrame>
</template>

<style scoped>
.hook-page {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #0b1650 0%,
    #3e4ea2 38%,
    #9cd4f2 72%,
    #ffcdb5 100%
  );
}

.hook-page__sky {
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
  width: 260px;
  height: 260px;
  top: -80px;
  left: -40px;
  background: rgba(150, 16, 255, 0.35);
}

.orb--2 {
  width: 200px;
  height: 200px;
  top: 20%;
  right: -60px;
  background: rgba(255, 138, 82, 0.3);
  animation-delay: -5s;
}

.orb--3 {
  width: 180px;
  height: 180px;
  bottom: 30%;
  left: 20%;
  background: rgba(62, 78, 162, 0.25);
  animation-delay: -8s;
}

.star {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
  animation: twinkle 3s ease infinite;
}

.hook-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: var(--screen-pt-safe) var(--screen-px) 16px;
  position: relative;
  z-index: 1;
}

.hook-hero {
  text-align: center;
  animation: riseIn 0.8s ease both;
}

.hook-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 16px;
}

.hook-spark {
  color: var(--orange-5);
  font-size: 10px;
  animation: twinkle 2s ease infinite;
}

.hook-spark:last-child {
  animation-delay: 1s;
}

.hook-title {
  font-family: var(--font-serif);
  font-size: 38px;
  line-height: 1.08;
  color: var(--neutral-0);
  margin-bottom: 28px;
  text-shadow: 0 2px 24px rgba(4, 10, 27, 0.25);
}

.hook-title__accent {
  background: linear-gradient(135deg, #ffe3d5 0%, #ff9f71 50%, #ff8a52 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.drift-visual {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin: 0 auto 24px;
  width: 100%;
  animation: riseIn 0.8s ease 0.15s both;
}

.drift-card {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 10px;
  border-radius: var(--radius-lg);
}

.drift-card__label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.drift-card__icon {
  font-size: 36px;
  line-height: 1;
}

.drift-card__sub {
  font-size: 11px;
  line-height: 1.3;
  text-align: center;
  opacity: 0.75;
}

.drift-card--old {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.55);
}

.drift-card--new {
  background: rgba(255, 255, 255, 0.18);
  border: 2px solid var(--orange-6);
  color: var(--neutral-0);
  box-shadow: 0 8px 28px rgba(255, 138, 82, 0.35);
}

.drift-card--new .drift-card__sub {
  color: var(--orange-5);
  opacity: 1;
}

.drift-bridge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 44px;
  flex-shrink: 0;
  gap: 4px;
}

.drift-bridge__line {
  width: 1px;
  height: 12px;
  flex-shrink: 0;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(255, 138, 82, 0.6),
    transparent
  );
}

.drift-bridge__badge {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--orange-5);
  background: rgba(255, 138, 82, 0.2);
  border: 1px solid rgba(255, 138, 82, 0.4);
  padding: 5px 6px;
  border-radius: 999px;
  text-align: center;
  line-height: 1.15;
  flex-shrink: 0;
}

.hook-lead {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.88);
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-lg);
  padding: 16px 18px;
  margin-bottom: 20px;
  animation: riseIn 0.8s ease 0.25s both;
}

.hook-lead strong {
  color: var(--orange-5);
  font-weight: 600;
}

.promise-block {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  border-radius: var(--radius-xl);
  padding: 20px 18px;
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 12px 40px rgba(4, 10, 27, 0.12);
  animation: riseIn 0.8s ease 0.35s both;
}

.promise-headline {
  font-family: var(--font-serif);
  font-size: 22px;
  line-height: 1.3;
  color: var(--blue-5);
  margin-bottom: 16px;
}

.promise-headline strong {
  color: var(--orange-6);
  font-weight: 400;
}

.promise-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.promise-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  line-height: 1.45;
  color: var(--neutral-700);
}

.promise-list__emoji {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: var(--blue-1);
  border-radius: 10px;
}

.hook-footer {
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  padding: 12px var(--screen-px) var(--screen-pb);
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 205, 181, 0.95) 30%
  );
}

.sign-in-link {
  font-size: 14px;
  font-weight: 600;
  color: var(--blue-5);
  text-align: center;
  padding: 4px;
}

@keyframes riseIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.85);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}

@keyframes drift {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(18px, -12px);
  }
}
</style>
