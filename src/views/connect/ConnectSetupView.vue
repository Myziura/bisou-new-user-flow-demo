<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { flowState } from '../../composables/useFlowState'
import PhoneFrame from '../../components/PhoneFrame.vue'
import ScreenLayout from '../../components/ScreenLayout.vue'
import BisouButton from '../../components/BisouButton.vue'
import WhyWeAsk from '../../components/WhyWeAsk.vue'

const route = useRoute()
const router = useRouter()

const steps = ['intent', 'identity', 'photo', 'preference', 'location']
const step = ref(steps.includes(route.query.step) ? route.query.step : 'intent')

watch(() => route.query.step, (s) => {
  if (s && steps.includes(s)) step.value = s
})

const stepIndex = computed(() => steps.indexOf(step.value))
const progress = computed(() => ((stepIndex.value + 1) / steps.length) * 100)

const intentOptions = [
  { id: 'dating', emoji: '💘', label: 'Dating' },
  { id: 'friends', emoji: '🤝', label: 'Friends' },
  { id: 'business', emoji: '💼', label: 'Business / networking' },
]

const identityOptions = [
  { id: 'woman', label: 'Woman' },
  { id: 'man', label: 'Man' },
  { id: 'nonbinary', label: 'Nonbinary' },
]

const meetOptions = [
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'nonbinary', label: 'Nonbinary' },
  { id: 'everyone', label: 'Open to everyone' },
]

const selectedIntent = ref([...flowState.connectIntent])
const selectedIdentity = ref(flowState.connectGender || '')
const selectedMeet = ref([...flowState.connectMeetPreference])

function toggleIntent(id) {
  const idx = selectedIntent.value.indexOf(id)
  if (idx >= 0) selectedIntent.value.splice(idx, 1)
  else selectedIntent.value.push(id)
}

function selectIdentity(id) {
  selectedIdentity.value = id
}

function addPhoto() {
  if (flowState.connectPhotos.length < 9) {
    flowState.connectPhotos.push({ id: Date.now(), url: null })
  }
}

function removePhoto(i) {
  flowState.connectPhotos.splice(i, 1)
}

function toggleMeet(id) {
  if (id === 'everyone') {
    selectedMeet.value = selectedMeet.value.includes('everyone') ? [] : ['everyone']
    return
  }
  selectedMeet.value = selectedMeet.value.filter((x) => x !== 'everyone')
  const idx = selectedMeet.value.indexOf(id)
  if (idx >= 0) selectedMeet.value.splice(idx, 1)
  else selectedMeet.value.push(id)
}

function enableLocation() {
  flowState.connectLocation = 'Brooklyn, NY · 2 mi'
}

const canNext = computed(() => {
  switch (step.value) {
    case 'intent': return selectedIntent.value.length > 0
    case 'identity': return Boolean(selectedIdentity.value)
    case 'photo': return flowState.connectPhotos.length > 0
    case 'preference': return selectedMeet.value.length > 0
    case 'location': return Boolean(flowState.connectLocation)
    default: return false
  }
})

function goTo(nextStep) {
  router.push(`/connect/setup?step=${nextStep}`)
}

function next() {
  switch (step.value) {
    case 'intent':
      flowState.connectIntent = [...selectedIntent.value]
      goTo('identity')
      break
    case 'identity':
      flowState.connectGender = selectedIdentity.value
      goTo('photo')
      break
    case 'photo':
      goTo('preference')
      break
    case 'preference':
      flowState.connectMeetPreference = [...selectedMeet.value]
      goTo('location')
      break
    case 'location':
      flowState.connectSetupComplete = true
      router.push('/connect/swipe')
      break
  }
}
</script>

<template>
  <PhoneFrame>
    <ScreenLayout scroll>
      <div class="setup-progress">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${progress}%` }" />
        </div>
        <span class="progress-label">Connect setup · {{ stepIndex + 1 }}/{{ steps.length }}</span>
      </div>

      <!-- 1. What are you looking for -->
      <template v-if="step === 'intent'">
        <h2 class="step-title">What are you looking for?</h2>
        <p class="step-sub">Pick all that apply — you can change this any time.</p>
        <div class="intent-options">
          <button
            v-for="opt in intentOptions"
            :key="opt.id"
            class="intent-card"
            :class="{ 'intent-card--selected': selectedIntent.includes(opt.id) }"
            @click="toggleIntent(opt.id)"
          >
            <span class="intent-emoji">{{ opt.emoji }}</span>
            <span class="intent-label">{{ opt.label }}</span>
            <span v-if="selectedIntent.includes(opt.id)" class="check">✓</span>
          </button>
        </div>
        <WhyWeAsk label="This changes who appears in your stack and how we match you." />
      </template>

      <!-- 2. Who are you -->
      <template v-else-if="step === 'identity'">
        <h2 class="step-title">Who are you?</h2>
        <p class="step-sub">Helps us show your profile to the right people.</p>
        <div class="option-list">
          <button
            v-for="opt in identityOptions"
            :key="opt.id"
            class="option-card"
            :class="{ 'option-card--active': selectedIdentity === opt.id }"
            @click="selectIdentity(opt.id)"
          >
            {{ opt.label }}
            <span v-if="selectedIdentity === opt.id" class="check">✓</span>
          </button>
        </div>
        <WhyWeAsk label="Helps with accurate matching." />
      </template>

      <!-- 3. Photo -->
      <template v-else-if="step === 'photo'">
        <h2 class="step-title">Add a photo</h2>
        <p class="step-sub">People connect with faces. Add a clear photo to appear in the deck.</p>
        <div class="photo-grid">
          <button
            v-for="(photo, i) in flowState.connectPhotos"
            :key="photo.id"
            class="photo-slot photo-slot--filled"
            @click="removePhoto(i)"
          >
            <span class="photo-avatar">😊</span>
            <span class="photo-remove">×</span>
          </button>
          <button
            v-if="flowState.connectPhotos.length < 9"
            class="photo-slot photo-slot--add"
            @click="addPhoto"
          >
            <span>+</span>
            <small>Add photo</small>
          </button>
        </div>
        <WhyWeAsk label="Up to 9 photos. Drag to reorder in the full app." />
      </template>

      <!-- 4. Who you're looking for -->
      <template v-else-if="step === 'preference'">
        <h2 class="step-title">Who are you looking for?</h2>
        <p class="step-sub">We'll only show you people you're open to.</p>
        <div class="meet-chips">
          <button
            v-for="opt in meetOptions"
            :key="opt.id"
            class="meet-chip"
            :class="{ 'meet-chip--active': selectedMeet.includes(opt.id) }"
            @click="toggleMeet(opt.id)"
          >
            {{ opt.label }}
          </button>
        </div>
        <WhyWeAsk label="You can change this any time in settings." />
      </template>

      <!-- 5. Location -->
      <template v-else>
        <h2 class="step-title">Your location</h2>
        <p class="step-sub">So we can show you people nearby.</p>
        <div class="location-card">
          <div class="map-placeholder">
            <span>🗺️</span>
          </div>
          <p v-if="flowState.connectLocation" class="location-set">{{ flowState.connectLocation }}</p>
          <BisouButton v-if="!flowState.connectLocation" @click="enableLocation">
            Enable location
          </BisouButton>
          <p v-else class="location-confirmed">✓ Location confirmed</p>
        </div>
        <WhyWeAsk label="We only show approximate distance — never your exact address." />
      </template>

      <template #footer>
        <BisouButton :disabled="!canNext" @click="next">
          {{ step === 'location' ? 'Start swiping' : 'Next' }}
        </BisouButton>
      </template>
    </ScreenLayout>
  </PhoneFrame>
</template>

<style scoped>
.setup-progress {
  margin-bottom: 24px;
}

.progress-track {
  height: 4px;
  background: var(--blue-2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: var(--orange-6);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.step-title {
  font-size: 26px;
  margin-bottom: 8px;
}

.step-sub {
  font-size: 15px;
  color: var(--neutral-500);
  line-height: 1.5;
  margin-bottom: 24px;
}

.intent-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.intent-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: var(--neutral-0);
  border: 2px solid var(--outline);
  border-radius: var(--radius-lg);
  text-align: left;
  transition: all 0.15s;
}

.intent-card--selected {
  border-color: var(--blue-5);
  background: rgba(62, 78, 162, 0.06);
}

.intent-emoji {
  font-size: 28px;
}

.intent-label {
  font-size: 16px;
  font-weight: 600;
  flex: 1;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border: 2px solid var(--outline);
  border-radius: var(--radius-lg);
  font-size: 16px;
  font-weight: 600;
  background: var(--neutral-0);
  text-align: left;
  transition: all 0.15s;
}

.option-card--active {
  border-color: var(--blue-5);
  background: rgba(62, 78, 162, 0.06);
  color: var(--blue-5);
}

.check {
  width: 24px;
  height: 24px;
  background: var(--blue-5);
  color: var(--neutral-0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.photo-slot {
  aspect-ratio: 3/4;
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.photo-slot--add {
  border: 2px dashed var(--outline);
  color: var(--neutral-500);
  font-size: 28px;
  gap: 4px;
}

.photo-slot--add small {
  font-size: 11px;
}

.photo-slot--filled {
  background: var(--gradient-sky-sun-light);
  border: 2px solid var(--blue-5);
}

.photo-avatar {
  font-size: 40px;
}

.photo-remove {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meet-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.meet-chip {
  padding: 14px 20px;
  border: 2px solid var(--outline);
  border-radius: 100px;
  font-size: 15px;
  font-weight: 600;
  background: var(--neutral-0);
  transition: all 0.15s;
}

.meet-chip--active {
  background: var(--blue-5);
  color: var(--neutral-0);
  border-color: var(--blue-5);
}

.location-card {
  text-align: center;
}

.map-placeholder {
  height: 160px;
  background: var(--blue-2);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  margin-bottom: 16px;
}

.location-set {
  font-weight: 600;
  margin-bottom: 12px;
}

.location-confirmed {
  color: var(--success);
  font-weight: 600;
  font-size: 14px;
}
</style>
