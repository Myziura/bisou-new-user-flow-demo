<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { flowState } from '../../composables/useFlowState'
import PhoneFrame from '../../components/PhoneFrame.vue'
import ScreenLayout from '../../components/ScreenLayout.vue'
import BisouButton from '../../components/BisouButton.vue'
import WhyWeAsk from '../../components/WhyWeAsk.vue'

const router = useRouter()

onMounted(() => {
  if (!flowState.signedUp) router.replace('/signup')
  else if (!flowState.preSignupNotificationsAnswered) router.replace('/notifications')
})

const placeQuery = ref(flowState.birthPlace || '')
const birthTime = ref(flowState.birthTime || '12:00')
const skipTime = ref(false)

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

function selectCity(city) {
  placeQuery.value = city
}

const unlockItems = [
  { emoji: '🌙', title: 'Moon', body: 'How you feel' },
  { emoji: '↑', title: 'Rising', body: 'How you seem' },
  { emoji: '✦', title: 'Nakshatra', body: 'Your deeper vibe' },
]

function continueFlow() {
  flowState.birthPlace = placeQuery.value
  flowState.birthTime = skipTime.value ? '12:00' : birthTime.value
  router.push('/scanning')
}
</script>

<template>
  <PhoneFrame>
    <ScreenLayout
      title="Almost there — one more step"
      subtitle="You're signed up. Add birth place and time to unlock moon, rising, and nakshatra."
    >
      <div class="chart-meter">
        <div class="chart-meter__track">
          <div class="chart-meter__fill chart-meter__fill--done" />
          <div class="chart-meter__fill chart-meter__fill--next" />
        </div>
        <div class="chart-meter__labels">
          <span>70% · Sun sign ✓</span>
          <span>+30% · Place & time</span>
        </div>
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
          <label>Birth place</label>
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

        <div class="field-group">
          <label>Birth time <span class="optional">(optional)</span></label>
          <input
            v-model="birthTime"
            type="time"
            :disabled="skipTime"
          />
          <label class="checkbox">
            <input v-model="skipTime" type="checkbox" />
            I don't know my birth time
          </label>
          <WhyWeAsk label="No time? We'll estimate — you can add it later." />
        </div>
      </div>

      <template #footer>
        <BisouButton :disabled="!placeSelected" @click="continueFlow">
          Reveal my chart
        </BisouButton>
      </template>
    </ScreenLayout>
  </PhoneFrame>
</template>

<style scoped>
.chart-meter {
  margin-bottom: 20px;
}

.chart-meter__track {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: var(--blue-1);
}

.chart-meter__fill--done {
  width: 70%;
  background: var(--blue-5);
}

.chart-meter__fill--next {
  flex: 1;
  background: linear-gradient(90deg, var(--orange-5), var(--orange-6));
  opacity: 0.85;
}

.chart-meter__labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: var(--neutral-500);
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
  gap: 28px;
}

.field-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--neutral-700);
}

.optional {
  font-weight: 400;
  color: var(--neutral-500);
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

.field-group input:disabled {
  opacity: 0.4;
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

.checkbox {
  display: flex !important;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-weight: 400 !important;
  font-size: 14px !important;
  color: var(--neutral-500) !important;
  cursor: pointer;
}

.checkbox input {
  width: 18px;
  height: 18px;
  accent-color: var(--blue-5);
}
</style>
