<script setup>
import { useRouter } from 'vue-router'
import PhoneFrame from '../../components/PhoneFrame.vue'
import BottomNav from '../../components/BottomNav.vue'
import BisouButton from '../../components/BisouButton.vue'

const router = useRouter()

const stars = [
  { left: 12, top: 18, delay: 0.2 }, { left: 78, top: 8, delay: 1.1 },
  { left: 45, top: 32, delay: 0.5 }, { left: 88, top: 42, delay: 1.8 },
  { left: 22, top: 55, delay: 0.9 }, { left: 65, top: 22, delay: 2.1 },
  { left: 8, top: 72, delay: 1.4 }, { left: 92, top: 68, delay: 0.3 },
  { left: 38, top: 78, delay: 1.7 }, { left: 55, top: 12, delay: 2.4 },
  { left: 18, top: 38, delay: 0.7 }, { left: 72, top: 58, delay: 1.2 },
  { left: 48, top: 48, delay: 2.0 }, { left: 32, top: 65, delay: 0.4 },
  { left: 82, top: 28, delay: 1.6 }, { left: 5, top: 48, delay: 2.3 },
  { left: 58, top: 85, delay: 0.8 }, { left: 95, top: 15, delay: 1.0 },
  { left: 28, top: 8, delay: 1.9 }, { left: 68, top: 75, delay: 0.6 },
]
</script>

<template>
  <PhoneFrame :show-back="false" dark>
    <div class="connect-intro">
      <div class="intro-visual">
        <div class="stars-bg">
          <span
            v-for="(star, i) in stars"
            :key="i"
            class="star"
            :style="{ left: `${star.left}%`, top: `${star.top}%`, animationDelay: `${star.delay}s` }"
          >✦</span>
        </div>
        <div class="match-count">500+</div>
        <p class="match-label">chart-matched people nearby</p>
      </div>

      <div class="intro-copy">
        <h1>500+ people are waiting — matched to your stars.</h1>
        <p>
          Bisou pairs you by real astrological compatibility.
          Tell us who you're here for and we'll build your match list.
        </p>
      </div>

      <div class="intro-cta">
        <BisouButton @click="router.push('/connect/setup?step=intent')">Get started</BisouButton>
      </div>

      <BottomNav />
    </div>
  </PhoneFrame>
</template>

<style scoped>
.connect-intro {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: var(--gradient-night);
  color: var(--neutral-0);
}

.intro-visual {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: var(--screen-pt-safe) var(--screen-px) 24px;
}

.stars-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.star {
  position: absolute;
  font-size: 10px;
  opacity: 0.4;
  animation: twinkle 2s ease infinite;
}

.match-count {
  font-family: var(--font-serif);
  font-size: 72px;
  line-height: 1;
  background: var(--gradient-orange);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.match-label {
  font-size: 14px;
  opacity: 0.7;
  margin-top: 8px;
  position: relative;
}

.intro-copy {
  padding: 0 var(--screen-px) 24px;
  position: relative;
}

.intro-copy h1 {
  font-size: 28px;
  margin-bottom: 12px;
  line-height: 1.2;
}

.intro-copy p {
  font-size: 15px;
  line-height: 1.5;
  opacity: 0.8;
}

.intro-cta {
  padding: 0 var(--screen-px) var(--screen-pb);
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.2); }
}
</style>
