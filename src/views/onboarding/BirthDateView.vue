<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { flowState, getWesternSign, getVedicSign, getAge } from '../../composables/useFlowState'
import PhoneFrame from '../../components/PhoneFrame.vue'
import ScreenLayout from '../../components/ScreenLayout.vue'
import BisouButton from '../../components/BisouButton.vue'
import WhyWeAsk from '../../components/WhyWeAsk.vue'

const router = useRouter()

const day = ref('')
const month = ref('')
const year = ref('')
const showUnder18 = ref(false)

const isValid = computed(() => day.value && month.value && year.value)

function continueFlow() {
  const birthDate = `${year.value}-${String(month.value).padStart(2, '0')}-${String(day.value).padStart(2, '0')}`
  const age = getAge(birthDate)

  if (age < 18) {
    showUnder18.value = true
    return
  }

  const western = getWesternSign(Number(month.value), Number(day.value))
  const vedic = getVedicSign(Number(month.value), Number(day.value))

  flowState.birthDate = birthDate
  flowState.westernSign = western.name
  flowState.vedicSign = vedic.name
  router.push('/signup')
}
</script>

<template>
  <PhoneFrame>
    <ScreenLayout
      title="When were you born?"
      subtitle="This alone is enough to find your true sun sign."
    >
      <div class="date-inputs">
        <div class="field">
          <label>Day</label>
          <select v-model="day">
            <option value="" disabled>DD</option>
            <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>
        <div class="field">
          <label>Month</label>
          <select v-model="month">
            <option value="" disabled>MM</option>
            <option v-for="(m, i) in ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']" :key="i" :value="i + 1">{{ m }}</option>
          </select>
        </div>
        <div class="field field--year">
          <label>Year</label>
          <select v-model="year">
            <option value="" disabled>YYYY</option>
            <option v-for="y in 80" :key="y" :value="2026 - y">{{ 2026 - y }}</option>
          </select>
        </div>
      </div>
      <WhyWeAsk label="Your birth date sets your core sign." />

      <template #footer>
        <BisouButton :disabled="!isValid" @click="continueFlow">Continue</BisouButton>
      </template>
    </ScreenLayout>

    <Transition name="fade">
      <div v-if="showUnder18" class="overlay" @click.self="showUnder18 = false">
        <div class="dialog">
          <p class="dialog-emoji">✨</p>
          <h2>Bisou is for ages 18 and up.</h2>
          <p>Come back when you're ready ✨</p>
          <BisouButton variant="secondary" @click="showUnder18 = false">OK</BisouButton>
        </div>
      </div>
    </Transition>
  </PhoneFrame>
</template>

<style scoped>
.date-inputs {
  display: flex;
  gap: 12px;
}

.field {
  flex: 1;
}

.field--year {
  flex: 1.3;
}

.field label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--neutral-500);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field select {
  width: 100%;
  padding: 14px 12px;
  border: 1.5px solid var(--outline);
  border-radius: var(--radius);
  background: var(--neutral-0);
  font-size: 16px;
  color: var(--neutral-900);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%235A6484' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(4, 10, 27, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 30;
}

.dialog {
  background: var(--neutral-0);
  border-radius: var(--radius-xl);
  padding: 32px 24px;
  text-align: center;
  max-width: 300px;
}

.dialog-emoji {
  font-size: 40px;
  margin-bottom: 16px;
}

.dialog h2 {
  font-size: 22px;
  margin-bottom: 8px;
}

.dialog p {
  color: var(--neutral-500);
  margin-bottom: 24px;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
