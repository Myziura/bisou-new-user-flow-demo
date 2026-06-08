<script setup>
defineProps({
  label: String,
})
</script>

<template>
  <p class="why-ask">
    <span class="why-icon">ℹ️</span>
    {{ label }}
  </p>
</template>

<style scoped>
.why-ask {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--neutral-500);
  line-height: 1.4;
  margin-top: 12px;
}

.why-icon {
  flex-shrink: 0;
  font-size: 14px;
}
</style>
