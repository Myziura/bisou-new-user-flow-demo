<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { flowState } from '../../composables/useFlowState'
import PhoneFrame from '../../components/PhoneFrame.vue'
import ScreenLayout from '../../components/ScreenLayout.vue'
import BisouButton from '../../components/BisouButton.vue'
import WhyWeAsk from '../../components/WhyWeAsk.vue'

const router = useRouter()

const name = ref(flowState.name || '')

const canContinue = computed(() => name.value.trim().length > 0)

function continueFlow() {
  flowState.name = name.value.trim()
  router.push('/attribution')
}
</script>

<template>
  <PhoneFrame>
    <ScreenLayout title="Almost there">
      <div class="field">
        <label>What should we call you?</label>
        <input v-model="name" type="text" placeholder="Your name" />
        <WhyWeAsk label="Used for your daily greeting and your profile." />
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
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.field input {
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid var(--outline);
  border-radius: var(--radius);
  background: var(--neutral-0);
  font-size: 16px;
}
</style>
