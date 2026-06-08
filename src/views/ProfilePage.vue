<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { flowState, getProfileStrength, getNextConnectStep } from '../composables/useFlowState'
import PhoneFrame from '../components/PhoneFrame.vue'
import BottomNav from '../components/BottomNav.vue'
import ProfileStrengthMeter from '../components/ProfileStrengthMeter.vue'
import BisouButton from '../components/BisouButton.vue'

const router = useRouter()
const strength = computed(() => getProfileStrength())

const incompleteFields = computed(() =>
  strength.value.optionalFields.filter((f) => !f.filled)
)

function boostProfile() {
  router.push('/connect/profile')
}

function continueConnect() {
  if (!flowState.connectIntent.length) {
    router.push('/connect')
  } else {
    router.push(getNextConnectStep())
  }
}
</script>

<template>
  <PhoneFrame :show-back="false">
    <div class="profile-page">
      <header class="profile-header">
        <div class="avatar">
          <span v-if="flowState.connectPhotos.length">😊</span>
          <span v-else class="avatar-empty">+</span>
        </div>
        <h1>{{ flowState.name || 'Your profile' }}</h1>
        <p class="signs">{{ flowState.sunSign }} · {{ flowState.moonSign }} moon · {{ flowState.risingSign }} rising</p>
      </header>

      <div class="profile-scroll">
        <ProfileStrengthMeter :percent="strength.percent" />

        <div v-if="incompleteFields.length" class="nudge-card">
          <h3>Complete your profile</h3>
          <p>Profiles over 80% get up to <strong>3× more matches</strong>.</p>
          <ul class="nudge-list">
            <li v-for="field in incompleteFields.slice(0, 3)" :key="field.key">
              <span>{{ field.label }}</span>
              <button @click="boostProfile">Add +{{ field.weight }}%</button>
            </li>
          </ul>
          <BisouButton v-if="incompleteFields.length > 3" variant="secondary" @click="boostProfile">
            See all {{ incompleteFields.length }} fields
          </BisouButton>
          <BisouButton v-else @click="boostProfile">Boost my profile</BisouButton>
        </div>

        <div v-else class="nudge-card nudge-card--done">
          <h3>Profile looking great ✨</h3>
          <p>You're at {{ strength.percent }}% — keep swiping to find your matches.</p>
          <BisouButton @click="router.push('/connect/swipe')">Go to Connect</BisouButton>
        </div>

        <div v-if="!flowState.connectSetupComplete" class="connect-cta">
          <p>Ready to meet people matched to your chart?</p>
          <BisouButton @click="continueConnect">Set up Connect</BisouButton>
        </div>

        <section class="chart-section">
          <h3>Your chart</h3>
          <div class="chart-cards">
            <div class="chart-card"><span>Sun</span><strong>{{ flowState.sunSign }}</strong></div>
            <div class="chart-card"><span>Moon</span><strong>{{ flowState.moonSign }}</strong></div>
            <div class="chart-card"><span>Rising</span><strong>{{ flowState.risingSign }}</strong></div>
            <div class="chart-card"><span>Nakshatra</span><strong>{{ flowState.nakshatra }}</strong></div>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  </PhoneFrame>
</template>

<style scoped>
.profile-page {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--blue-1);
  padding: var(--screen-pt-safe) var(--screen-px) 0;
}

.profile-header {
  text-align: center;
  padding-bottom: 20px;
  flex-shrink: 0;
}

.avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: var(--gradient-sky-sun-light);
  border: 3px solid var(--neutral-0);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 12px;
}

.avatar-empty {
  font-size: 32px;
  color: var(--neutral-500);
}

.profile-header h1 {
  font-size: 28px;
  margin-bottom: 4px;
}

.signs {
  font-size: 14px;
  color: var(--neutral-500);
}

.profile-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 8px;
}

.nudge-card {
  background: var(--neutral-0);
  border-radius: var(--radius-xl);
  padding: 20px;
  border: 1px solid var(--outline);
}

.nudge-card--done {
  background: rgba(18, 209, 142, 0.08);
  border-color: var(--success);
}

.nudge-card h3 {
  font-size: 20px;
  margin-bottom: 6px;
}

.nudge-card p {
  font-size: 14px;
  color: var(--neutral-500);
  margin-bottom: 16px;
  line-height: 1.4;
}

.nudge-list {
  list-style: none;
  margin-bottom: 16px;
}

.nudge-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--blue-1);
  font-size: 14px;
}

.nudge-list li:last-child { border-bottom: none; }

.nudge-list button {
  font-size: 13px;
  font-weight: 700;
  color: var(--orange-6);
}

.connect-cta {
  background: var(--orange-2);
  border-radius: var(--radius-lg);
  padding: 20px;
  text-align: center;
}

.connect-cta p {
  font-family: var(--font-serif);
  font-size: 18px;
  margin-bottom: 12px;
}

.chart-section h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.chart-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.chart-card {
  background: var(--neutral-0);
  border-radius: var(--radius);
  padding: 14px;
  border: 1px solid var(--outline);
}

.chart-card span {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--neutral-500);
  margin-bottom: 4px;
}

.chart-card strong {
  font-size: 16px;
}
</style>
