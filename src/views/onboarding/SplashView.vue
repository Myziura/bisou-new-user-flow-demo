<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { flowState } from '../../composables/useFlowState'
import PhoneFrame from '../../components/PhoneFrame.vue'

const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    if (flowState.onboardingComplete) {
      router.replace('/today')
    } else if (flowState.signedUp && flowState.birthPlace && flowState.sunSign) {
      router.replace('/today')
    } else if (flowState.signedUp && flowState.birthPlace) {
      router.replace('/scanning')
    } else if (flowState.signedUp && flowState.preSignupNotificationsAnswered) {
      router.replace('/birth-place')
    } else if (flowState.signedUp && flowState.attribution && flowState.name) {
      router.replace('/notifications')
    } else if (flowState.signedUp && flowState.name) {
      router.replace('/attribution')
    } else if (flowState.signedUp) {
      router.replace('/almost-there')
    } else if (flowState.vedicSign) {
      router.replace('/signup')
    } else {
      router.replace('/hook')
    }
  }, 1800)
})
</script>

<template>
  <PhoneFrame :show-back="false">
    <div class="splash">
      <div class="splash-bg" />
      <div class="splash-content">
        <div class="logo">✦ bisou</div>
        <div class="spinner" />
        <p class="tagline">Your stars, decoded</p>
      </div>
    </div>
  </PhoneFrame>
</template>

<style scoped>
.splash {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: var(--gradient-night);
  min-height: 100%;
}

.splash-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 30% 20%, rgba(150, 16, 255, 0.25) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(255, 138, 82, 0.15) 0%, transparent 50%);
}

.splash-content {
  position: relative;
  text-align: center;
  color: var(--neutral-0);
}

.logo {
  font-family: var(--font-serif);
  font-size: 48px;
  letter-spacing: 0.05em;
  margin-bottom: 32px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--orange-6);
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 0.8s linear infinite;
}

.tagline {
  font-size: 14px;
  opacity: 0.7;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
