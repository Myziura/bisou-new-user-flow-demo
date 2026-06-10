<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { flowState } from '../../composables/useFlowState'
import PhoneFrame from '../../components/PhoneFrame.vue'
import ScreenLayout from '../../components/ScreenLayout.vue'
import BisouButton from '../../components/BisouButton.vue'

const router = useRouter()

onMounted(() => {
  if (!flowState.signedUp) router.replace('/signup')
  else if (!flowState.preSignupNotificationsAnswered) router.replace('/notifications')
})

const placeQuery = ref(flowState.birthPlace || '')
const birthTime = ref(flowState.birthTime && flowState.birthTime !== '12:00' ? flowState.birthTime : '12:00')
const showBirthTime = ref(Boolean(flowState.birthTime && flowState.birthTime !== '12:00'))
const displayScore = ref(70)

const CITIES = [
  'New York, USA', 'Los Angeles, USA', 'London, UK', 'Paris, France',
  'Berlin, Germany', 'Tokyo, Japan', 'Sydney, Australia', 'Toronto, Canada',
  'Mumbai, India', 'São Paulo, Brazil', 'Mexico City, Mexico', 'Cape Town, South Africa',
]

const suggestions = computed(() => {
  if (!placeQuery.value || placeQuery.value.length < 2) return []
  const q = placeQuery.value.toLowerCase()
  return CITIES.filter((c) => c.toLowerCase().includes(q)).slice(0, 5)
})

const placeSelected = computed(() => CITIES.includes(placeQuery.value))

const accuracyScore = computed(() => {
  let score = 70
  if (placeSelected.value) score += 20
  if (showBirthTime.value && birthTime.value) score += 10
  return score
})

const isMaxAccuracy = computed(() => accuracyScore.value === 100)

watch(accuracyScore, (next) => {
  const start = displayScore.value
  const diff = next - start
  if (diff === 0) return

  const steps = Math.abs(diff)
  const stepMs = Math.min(40, 280 / steps)
  let step = 0

  const tick = () => {
    step += 1
    displayScore.value = start + Math.round((diff * step) / steps)
    if (step < steps) requestAnimationFrame(() => setTimeout(tick, stepMs))
    else displayScore.value = next
  }

  tick()
})

function selectCity(city) {
  placeQuery.value = city
}

function openBirthTime() {
  showBirthTime.value = true
}

const unlockItems = [
  { emoji: '🌙', title: 'Moon', body: 'How you feel' },
  { emoji: '↑', title: 'Rising', body: 'How you seem' },
  { emoji: '✦', title: 'Nakshatra', body: 'Your deeper vibe' },
]

function continueFlow() {
  flowState.birthPlace = placeQuery.value
  flowState.birthTime = showBirthTime.value ? birthTime.value : '12:00'
  router.push('/scanning')
}
</script>

<template>
  <PhoneFrame>
    <ScreenLayout
      title="Almost there — one more step"
      subtitle="You're signed up! Add your birth details to unlock your complete astrological blueprint."
    >
      <div
        class="accuracy-badge"
        :class="{ 'accuracy-badge--max': isMaxAccuracy }"
        aria-live="polite"
      >
        <span class="accuracy-badge__sparkle" aria-hidden="true">✦</span>
        <div class="accuracy-badge__copy">
          <span class="accuracy-badge__label">Chart accuracy</span>
          <span class="accuracy-badge__value">{{ displayScore }}%</span>
        </div>
        <svg class="accuracy-badge__ring" viewBox="0 0 44 44" aria-hidden="true">
          <circle class="accuracy-badge__ring-track" cx="22" cy="22" r="18" />
          <circle
            class="accuracy-badge__ring-fill"
            cx="22"
            cy="22"
            r="18"
            :style="{ strokeDashoffset: 113 - (113 * displayScore) / 100 }"
          />
        </svg>
      </div>

      <ul class="unlock-list">
        <li v-for="item in unlockItems" :key="item.title">
          <span class="unlock-list__emoji">{{ item.emoji }}</span>
          <span class="unlock-list__title">{{ item.title }}</span>
          <span class="unlock-list__dot">·</span>
          <span class="unlock-list__body">{{ item.body }}</span>
        </li>
      </ul>

      <div class="fields">
        <div class="field-group">
          <label>
            Birth place
            <span v-if="!placeSelected" class="label-hint">(+20% accuracy)</span>
          </label>
          <input
            v-model="placeQuery"
            type="text"
            placeholder="Search city..."
            autocomplete="off"
          />
          <ul v-if="suggestions.length && !placeSelected" class="suggestions">
            <li v-for="city in suggestions" :key="city" @click="selectCity(city)">
              📍 {{ city }}
            </li>
          </ul>
        </div>

        <div class="field-group field-group--time">
          <p v-if="!showBirthTime" class="time-hint">
            You can skip for now — we'll estimate your chart, and you can add
            your birth time later.
          </p>

          <button
            v-if="!showBirthTime"
            type="button"
            class="time-toggle"
            @click="openBirthTime"
          >
            <span class="time-toggle__icon">+</span>
            I know my exact birth time
          </button>

          <Transition name="time-expand">
            <div v-if="showBirthTime" class="time-panel">
              <label>
                Birth time
                <span class="label-hint">(+10% for 100% precision)</span>
              </label>
              <input v-model="birthTime" type="time" />
            </div>
          </Transition>
        </div>
      </div>

      <template #footer>
        <BisouButton
          :disabled="!placeSelected"
          :class="{ 'reveal-btn--max': isMaxAccuracy && placeSelected }"
          @click="continueFlow"
        >
          Reveal my chart
        </BisouButton>
      </template>
    </ScreenLayout>
  </PhoneFrame>
</template>

<style scoped>
.accuracy-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: linear-gradient(135deg, var(--blue-1) 0%, rgba(255, 227, 213, 0.5) 100%);
  border: 1px solid var(--outline);
  border-radius: var(--radius-lg);
  transition: border-color 0.35s, box-shadow 0.35s, background 0.35s;
}

.accuracy-badge--max {
  border-color: var(--orange-5);
  background: linear-gradient(135deg, #fff4ed 0%, #ffe3d5 100%);
  box-shadow: 0 8px 24px rgba(255, 138, 82, 0.2);
}

.accuracy-badge__sparkle {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--orange-6);
  background: var(--neutral-0);
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(255, 138, 82, 0.45);
  animation: sparkle 2.4s ease-in-out infinite;
}

.accuracy-badge--max .accuracy-badge__sparkle {
  color: var(--info);
  box-shadow: 0 0 16px rgba(150, 16, 255, 0.45);
}

.accuracy-badge__copy {
  flex: 1;
  min-width: 0;
}

.accuracy-badge__label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--neutral-500);
  margin-bottom: 2px;
}

.accuracy-badge__value {
  font-family: var(--font-serif);
  font-size: 28px;
  line-height: 1;
  color: var(--blue-5);
  transition: color 0.3s;
}

.accuracy-badge--max .accuracy-badge__value {
  color: var(--orange-6);
}

.accuracy-badge__ring {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  transform: rotate(-90deg);
}

.accuracy-badge__ring-track {
  fill: none;
  stroke: var(--outline);
  stroke-width: 3;
}

.accuracy-badge__ring-fill {
  fill: none;
  stroke: var(--orange-6);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 113;
  transition: stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.accuracy-badge--max .accuracy-badge__ring-fill {
  stroke: var(--info);
}

.unlock-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
  padding: 14px 16px;
  background: var(--neutral-0);
  border: 1px solid var(--outline);
  border-radius: var(--radius-lg);
}

.unlock-list li {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  line-height: 1.3;
}

.unlock-list__emoji {
  flex-shrink: 0;
  width: 22px;
  text-align: center;
}

.unlock-list__title {
  font-weight: 600;
  color: var(--blue-5);
}

.unlock-list__dot {
  color: var(--neutral-500);
}

.unlock-list__body {
  color: var(--neutral-500);
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.field-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--neutral-700);
}

.label-hint {
  font-weight: 500;
  font-size: 12px;
  color: var(--orange-6);
  margin-left: 4px;
}

.field-group input[type="text"],
.field-group input[type="time"] {
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid var(--outline);
  border-radius: var(--radius);
  background: var(--neutral-0);
  font-size: 16px;
}

.suggestions {
  list-style: none;
  margin-top: 4px;
  border: 1.5px solid var(--outline);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--neutral-0);
}

.suggestions li {
  padding: 12px 16px;
  cursor: pointer;
  font-size: 15px;
  border-bottom: 1px solid var(--blue-1);
}

.suggestions li:hover {
  background: var(--blue-1);
}

.suggestions li:last-child {
  border-bottom: none;
}

.field-group--time {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.time-hint {
  font-size: 13px;
  line-height: 1.4;
  color: var(--neutral-500);
}

.time-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  padding: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--blue-5);
  background: none;
  cursor: pointer;
  transition: color 0.15s;
}

.time-toggle:hover {
  color: var(--blue-6);
}

.time-toggle__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  border: 1.5px solid var(--blue-3);
  border-radius: 50%;
  color: var(--blue-5);
}

.time-panel {
  overflow: hidden;
}

.time-expand-enter-active,
.time-expand-leave-active {
  transition: opacity 0.3s ease, max-height 0.35s ease, transform 0.3s ease;
  max-height: 120px;
}

.time-expand-enter-from,
.time-expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-6px);
}

:deep(.reveal-btn--max) {
  animation: reveal-glow 2s ease-in-out infinite;
  box-shadow:
    0 4px 16px rgba(255, 138, 82, 0.35),
    0 0 24px rgba(150, 16, 255, 0.25) !important;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

@keyframes reveal-glow {
  0%,
  100% {
    box-shadow:
      0 4px 16px rgba(255, 138, 82, 0.35),
      0 0 20px rgba(150, 16, 255, 0.2);
  }
  50% {
    box-shadow:
      0 6px 24px rgba(255, 138, 82, 0.5),
      0 0 32px rgba(150, 16, 255, 0.35);
  }
}
</style>
