<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { flowState } from '../../composables/useFlowState'
import PhoneFrame from '../../components/PhoneFrame.vue'
import ScreenLayout from '../../components/ScreenLayout.vue'
import BisouButton from '../../components/BisouButton.vue'
import WhyWeAsk from '../../components/WhyWeAsk.vue'

const router = useRouter()

const OTHER = 'Other'

const sources = [
  'Instagram / TikTok',
  'Friend or family',
  'App Store search',
  'Event or QR code',
  OTHER,
]

function initialSelection() {
  const saved = flowState.attribution || ''
  if (!saved) return { selected: '', other: '' }
  if (sources.includes(saved)) return { selected: saved, other: '' }
  return { selected: OTHER, other: saved }
}

const initial = initialSelection()
const selected = ref(initial.selected)
const otherText = ref(initial.other)
const otherInput = ref(null)

watch(selected, async (value) => {
  if (value === OTHER) {
    await nextTick()
    otherInput.value?.focus()
  }
})

const showOtherInput = computed(() => selected.value === OTHER)

const canContinue = computed(() => {
  if (!selected.value) return false
  if (selected.value === OTHER) return otherText.value.trim().length > 0
  return true
})

function selectSource(src) {
  selected.value = src
  if (src !== OTHER) otherText.value = ''
}

function continueFlow() {
  flowState.attribution =
    selected.value === OTHER ? otherText.value.trim() : selected.value

  router.push('/notifications')
}
</script>

<template>
  <PhoneFrame>
    <ScreenLayout title="One quick question" scroll>
      <div class="field">
        <label>How did you hear about us?</label>

        <div class="source-list">
          <div
            v-for="src in sources"
            :key="src"
            class="source-item"
            :class="{ 'source-item--active': selected === src }"
          >
            <button
              type="button"
              class="source-option"
              :class="{ 'source-option--active': selected === src }"
              @click="selectSource(src)"
            >
              <span class="source-option__label">{{ src }}</span>
              <span v-if="selected === src" class="source-option__check" aria-hidden="true">✓</span>
            </button>

            <div v-if="src === OTHER && showOtherInput" class="other-input-wrap">
              <input
                ref="otherInput"
                v-model="otherText"
                type="text"
                class="other-input"
                placeholder="Tell us where you heard about Bisou"
                @keydown.enter.prevent="canContinue && continueFlow()"
              />
            </div>
          </div>
        </div>

        <WhyWeAsk label="Helps us know what's working." />
      </div>

      <template #footer>
        <BisouButton :disabled="!canContinue" @click="continueFlow">
          Continue
        </BisouButton>
      </template>
    </ScreenLayout>
  </PhoneFrame>
</template>

<style scoped>
.field label {
  display: block;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
}

.source-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.source-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.source-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 56px;
  padding: 16px 18px;
  border: 1.5px solid var(--outline);
  border-radius: var(--radius-lg);
  background: var(--neutral-0);
  color: var(--neutral-700);
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, color 0.15s;
}

.source-option:hover {
  border-color: var(--blue-3);
}

.source-option--active {
  background: var(--blue-5);
  color: var(--neutral-0);
  border-color: var(--blue-5);
  box-shadow: 0 4px 16px rgba(62, 78, 162, 0.25);
}

.source-option__label {
  flex: 1;
  line-height: 1.3;
}

.source-option__check {
  flex-shrink: 0;
  font-size: 18px;
  font-weight: 700;
  margin-left: 12px;
}

.other-input-wrap {
  padding: 0 2px;
  animation: slideDown 0.2s ease;
}

.other-input {
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid var(--outline);
  border-radius: var(--radius);
  background: var(--neutral-0);
  font-size: 16px;
  color: var(--neutral-900);
}

.other-input:focus {
  outline: none;
  border-color: var(--blue-5);
  box-shadow: 0 0 0 3px rgba(62, 78, 162, 0.15);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
