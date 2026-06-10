<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { flowState, computeChart } from '../../composables/useFlowState'
import PhoneFrame from '../../components/PhoneFrame.vue'

const router = useRouter()

onMounted(() => {
  if (!flowState.birthPlace || !flowState.birthDate) {
    router.replace('/birth-details')
    return
  }

  const chart = computeChart(flowState.birthDate, flowState.birthPlace, flowState.birthTime)
  Object.assign(flowState, {
    sunSign: chart.sunSign,
    moonSign: chart.moonSign,
    risingSign: chart.risingSign,
    nakshatra: chart.nakshatra.name,
    nakshatraTrait: chart.nakshatra.trait,
    nakshatraSuperpower: chart.nakshatra.superpower,
    vedicEmoji: chart.vedicEmoji,
  })

  setTimeout(() => router.replace('/signup'), 3000)
})
</script>

<template>
  <PhoneFrame :show-back="false" dark>
    <div class="scanning">
      <div class="orbit">
        <div class="planet planet-1">☉</div>
        <div class="planet planet-2">☽</div>
        <div class="planet planet-3">↑</div>
      </div>
      <h2 class="scan-title">Scanning the stars…</h2>
      <p class="scan-sub">Building your birth chart from {{ flowState.birthPlace }}</p>
      <div class="progress-bar">
        <div class="progress-fill" />
      </div>
    </div>
  </PhoneFrame>
</template>

<style scoped>
.scanning {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--screen-pt-safe) var(--screen-px) var(--screen-pb);
  text-align: center;
  color: var(--neutral-0);
}

.orbit {
  width: 200px;
  height: 200px;
  position: relative;
  margin-bottom: 40px;
}

.orbit::before {
  content: '';
  position: absolute;
  inset: 20px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: pulse 2s ease infinite;
}

.planet {
  position: absolute;
  font-size: 28px;
  animation: orbit 3s linear infinite;
}

.planet-1 { top: 0; left: 50%; transform: translateX(-50%); animation-delay: 0s; }
.planet-2 { bottom: 20px; left: 20px; animation-delay: -1s; font-size: 24px; }
.planet-3 { bottom: 20px; right: 20px; animation-delay: -2s; font-size: 22px; }

.scan-title {
  font-size: 28px;
  margin-bottom: 8px;
}

.scan-sub {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 32px;
}

.progress-bar {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--orange-6);
  border-radius: 2px;
  animation: progress 3s ease forwards;
}

@keyframes orbit {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}

@keyframes progress {
  from { width: 0; }
  to { width: 100%; }
}
</style>
