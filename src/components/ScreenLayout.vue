<script setup>
defineProps({
  title: String,
  subtitle: String,
  centered: { type: Boolean, default: false },
  scroll: { type: Boolean, default: false },
  /** Parent already handles padding (e.g. .hook wrapper) */
  bare: { type: Boolean, default: false },
})
</script>

<template>
  <div
    class="screen-layout"
    :class="{
      'screen-layout--centered': centered,
      'screen-layout--scroll': scroll,
      'screen-layout--bare': bare,
    }"
  >
    <header v-if="title || subtitle" class="screen-header">
      <h1 v-if="title" class="screen-title">{{ title }}</h1>
      <p v-if="subtitle" class="screen-subtitle">{{ subtitle }}</p>
    </header>
    <div class="screen-body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="screen-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.screen-layout {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: var(--screen-pt) var(--screen-px) var(--screen-pb);
}

.screen-layout--bare {
  padding: 0;
}

.screen-layout--scroll .screen-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.screen-layout--centered {
  justify-content: center;
  text-align: center;
}

.screen-header {
  margin-bottom: 24px;
  flex-shrink: 0;
}

.screen-title {
  font-size: 32px;
  color: var(--neutral-900);
  margin-bottom: 12px;
}

.screen-subtitle {
  font-size: 16px;
  line-height: 1.5;
  color: var(--neutral-500);
}

.screen-body {
  flex: 1;
  min-height: 0;
}

.screen-footer {
  flex-shrink: 0;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
