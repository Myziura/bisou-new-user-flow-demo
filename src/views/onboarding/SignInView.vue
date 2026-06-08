<script setup>
import { useRouter } from 'vue-router'
import { flowState } from '../../composables/useFlowState'
import PhoneFrame from '../../components/PhoneFrame.vue'
import ScreenLayout from '../../components/ScreenLayout.vue'
import BisouButton from '../../components/BisouButton.vue'

const router = useRouter()

function signIn(method) {
  flowState.signupMethod = method
  flowState.signedUp = true
  flowState.onboardingComplete = true

  if (method === 'email') {
    flowState.name = flowState.name || 'Friend'
    router.push('/verify')
    return
  }

  flowState.name = method === 'apple' ? 'Alex' : 'Jordan'
  if (!flowState.sunSign) {
    flowState.sunSign = 'Cancer'
    flowState.moonSign = 'Pisces'
    flowState.risingSign = 'Scorpio'
    flowState.nakshatra = 'Rohini'
  }
  router.push('/today')
}
</script>

<template>
  <PhoneFrame>
    <ScreenLayout
      title="Welcome back"
      subtitle="Sign in to pick up where you left off — your chart and daily readings are waiting."
      centered
    >
      <template #footer>
        <div class="sso-buttons">
          <BisouButton variant="sso" @click="signIn('apple')">
            Continue with Apple
          </BisouButton>
          <BisouButton variant="sso" @click="signIn('google')">
            Continue with Google
          </BisouButton>
          <BisouButton variant="secondary" @click="signIn('email')">
            Continue with email
          </BisouButton>
        </div>
        <p class="legal">
          By continuing you agree to our
          <a href="#">Terms of Service</a> and
          <a href="#">Privacy Policy</a>.
        </p>
      </template>
    </ScreenLayout>
  </PhoneFrame>
</template>

<style scoped>
.sso-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legal {
  font-size: 12px;
  color: var(--neutral-500);
  text-align: center;
  line-height: 1.5;
  margin-top: 8px;
}
</style>
