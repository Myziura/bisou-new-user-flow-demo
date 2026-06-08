<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { flowState, getNextConnectStep } from '../composables/useFlowState'

defineProps({
  showChats: { type: Boolean, default: false },
})

const route = useRoute()
const router = useRouter()

const tabs = [
  { id: 'today', label: 'Today', icon: '☀️', path: '/today' },
  { id: 'connect', label: 'Connect', icon: '💫' },
  { id: 'you', label: 'You', icon: '✨', path: '/profile' },
]

const connectPath = computed(() => {
  if (!flowState.connectIntent.length) return '/connect'
  if (flowState.connectSetupComplete) return '/connect/swipe'
  return getNextConnectStep()
})

function isActive(tab) {
  if (tab.id === 'connect') return route.path.startsWith('/connect')
  return route.path === tab.path
}

function go(tab) {
  router.push(tab.id === 'connect' ? connectPath.value : tab.path)
}
</script>

<template>
  <nav class="bottom-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="nav-tab"
      :class="{ 'nav-tab--active': isActive(tab) }"
      @click="go(tab)"
    >
      <span class="nav-icon">{{ tab.icon }}</span>
      <span class="nav-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: flex;
  border-top: 1px solid var(--outline);
  background: var(--neutral-0);
  padding: 8px 0 20px;
  flex-shrink: 0;
}

.nav-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px;
  color: var(--neutral-500);
  transition: color 0.15s;
}

.nav-tab--active {
  color: var(--blue-5);
}

.nav-icon {
  font-size: 20px;
}

.nav-label {
  font-size: 11px;
  font-weight: 600;
}
</style>
