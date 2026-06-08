<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  block: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <button
    class="bisou-btn"
    :class="[`bisou-btn--${variant}`, { 'bisou-btn--block': block }]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.bisou-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border-radius: var(--radius);
  font-size: 16px;
  font-weight: 600;
  transition: transform 0.15s, opacity 0.15s, box-shadow 0.15s;
}

.bisou-btn--block {
  width: 100%;
}

.bisou-btn--primary {
  background: var(--orange-6);
  color: var(--neutral-0);
  box-shadow: 0 4px 16px rgba(255, 138, 82, 0.35);
}

.bisou-btn--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 138, 82, 0.45);
}

.bisou-btn--secondary {
  background: var(--neutral-0);
  color: var(--neutral-900);
  border: 1.5px solid var(--outline);
}

.bisou-btn--accent {
  background: var(--blue-5);
  color: var(--neutral-0);
}

.bisou-btn--ghost {
  background: transparent;
  color: var(--blue-5);
  font-weight: 600;
}

.bisou-btn--sso {
  background: var(--neutral-0);
  color: var(--neutral-900);
  border: 1.5px solid var(--outline);
  font-weight: 500;
}

.bisou-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
