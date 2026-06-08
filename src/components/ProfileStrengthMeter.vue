<script setup>
import { computed } from 'vue'

const props = defineProps({
  percent: { type: Number, required: true },
  compact: { type: Boolean, default: false },
})

const tier = computed(() => {
  if (props.percent >= 80) return { label: 'Strong', color: 'var(--success)' }
  if (props.percent >= 50) return { label: 'Getting there', color: 'var(--orange-6)' }
  return { label: 'Needs work', color: 'var(--neutral-500)' }
})

const multiplier = computed(() => {
  if (props.percent >= 80) return '3×'
  if (props.percent >= 60) return '2×'
  if (props.percent >= 40) return '1.5×'
  return '1×'
})
</script>

<template>
  <div class="strength-meter" :class="{ 'strength-meter--compact': compact }">
    <div class="strength-header">
      <span class="strength-label">Profile strength</span>
      <span class="strength-pct" :style="{ color: tier.color }">{{ percent }}%</span>
    </div>
    <div class="strength-track">
      <div
        class="strength-fill"
        :style="{ width: `${percent}%`, background: tier.color }"
      />
    </div>
    <p v-if="!compact" class="strength-copy">
      <template v-if="percent < 80">
        Profiles over <strong>80%</strong> get up to <strong>3× more matches</strong>.
        You're at {{ multiplier }} visibility.
      </template>
      <template v-else>
        Your profile is strong — you're getting up to <strong>3× more matches</strong>.
      </template>
    </p>
  </div>
</template>

<style scoped>
.strength-meter {
  background: var(--neutral-0);
  border-radius: var(--radius-lg);
  padding: 16px;
  border: 1px solid var(--outline);
}

.strength-meter--compact {
  padding: 12px 14px;
}

.strength-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.strength-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.strength-pct {
  font-size: 20px;
  font-weight: 700;
}

.strength-track {
  height: 8px;
  background: var(--blue-1);
  border-radius: 4px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}

.strength-copy {
  margin-top: 10px;
  font-size: 13px;
  line-height: 1.45;
  color: var(--neutral-500);
}

.strength-copy strong {
  color: var(--neutral-900);
}
</style>
