<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { flowState } from '../../composables/useFlowState'
import PhoneFrame from '../../components/PhoneFrame.vue'
import ScreenLayout from '../../components/ScreenLayout.vue'

const router = useRouter()
const digits = ref(['', '', '', '', '', ''])
const inputs = ref([])

function afterVerify() {
  const dest = flowState.onboardingComplete ? '/today' : '/almost-there'
  setTimeout(() => router.push(dest), 400)
}

function onInput(index, event) {
  const val = event.target.value.replace(/\D/g, '').slice(-1)
  digits.value[index] = val
  if (val && index < 5) {
    inputs.value[index + 1]?.focus()
  }
  if (digits.value.every((d) => d)) {
    afterVerify()
  }
}

function onPaste(event) {
  const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
  pasted.split('').forEach((d, i) => { digits.value[i] = d })
  if (pasted.length === 6) {
    afterVerify()
  }
}

watch(digits, (d) => {
  if (d.every((x) => x)) {
    afterVerify()
  }
}, { deep: true })
</script>

<template>
  <PhoneFrame>
    <ScreenLayout
      title="Check your email"
      subtitle="Enter the 6-digit code we sent you."
    >
      <div class="code-inputs" @paste="onPaste">
        <input
          v-for="(_, i) in 6"
          :key="i"
          :ref="(el) => { if (el) inputs[i] = el }"
          :value="digits[i]"
          type="text"
          inputmode="numeric"
          maxlength="1"
          class="code-digit"
          @input="onInput(i, $event)"
        />
      </div>
      <p class="resend">Didn't get it? <button class="resend-btn">Resend code</button> (30s)</p>
    </ScreenLayout>
  </PhoneFrame>
</template>

<style scoped>
.code-inputs {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 32px 0;
}

.code-digit {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  border: 1.5px solid var(--outline);
  border-radius: var(--radius);
  background: var(--neutral-0);
}

.code-digit:focus {
  outline: none;
  border-color: var(--blue-5);
  box-shadow: 0 0 0 3px rgba(62, 78, 162, 0.15);
}

.resend {
  text-align: center;
  font-size: 14px;
  color: var(--neutral-500);
}

.resend-btn {
  color: var(--blue-5);
  font-weight: 600;
  text-decoration: underline;
}
</style>
