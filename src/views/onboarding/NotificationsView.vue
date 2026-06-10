<script setup>
import { useRouter } from 'vue-router'
import { flowState } from '../../composables/useFlowState'
import PhoneFrame from '../../components/PhoneFrame.vue'
import ScreenLayout from '../../components/ScreenLayout.vue'
import BisouButton from '../../components/BisouButton.vue'

const router = useRouter()

function enableNotifications() {
  flowState.notificationsEnabled = true
  finish()
}

function finish() {
  flowState.preSignupNotificationsAnswered = true
  flowState.onboardingComplete = true
  router.push('/today')
}
</script>

<template>
  <PhoneFrame>
    <ScreenLayout centered>
      <div class="notif-content">
        <div class="notif-icon">🔔</div>
        <h2 class="notif-title">Want your reading delivered each morning?</h2>
        <p class="notif-sub">
          Get a personalized horoscope in your pocket every day —
          framed around the chart you just unlocked.
        </p>
      </div>

      <template #footer>
        <BisouButton @click="enableNotifications">Turn on daily readings</BisouButton>
        <BisouButton variant="ghost" @click="finish">Not now</BisouButton>
      </template>
    </ScreenLayout>
  </PhoneFrame>
</template>

<style scoped>
.notif-content {
  padding: 24px 0;
}

.notif-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.notif-title {
  font-family: var(--font-serif);
  font-size: 28px;
  margin-bottom: 12px;
  color: var(--neutral-900);
}

.notif-sub {
  font-size: 16px;
  line-height: 1.5;
  color: var(--neutral-500);
}
</style>
