<script setup>
import { RouterView, useRouter } from 'vue-router'
import { resetFlow } from './composables/useFlowState'

const router = useRouter()

function restartDemo() {
  resetFlow()
  router.push('/hook')
}
</script>

<template>
  <div class="app-shell">
    <RouterView />
    <button
      type="button"
      class="demo-restart"
      title="Clear data and restart from hook"
      @click="restartDemo"
    >
      <span class="demo-restart__icon" aria-hidden="true">↺</span>
      Restart
    </button>
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-restart {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.82);
  font-size: 13px;
  font-weight: 600;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  transition: background 0.15s, transform 0.15s, color 0.15s;
}

.demo-restart:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  transform: translateY(-1px);
}

.demo-restart:active {
  transform: scale(0.98);
}

.demo-restart__icon {
  font-size: 16px;
  line-height: 1;
}

@media (max-width: 420px) {
  .demo-restart {
    right: 12px;
    bottom: 12px;
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>
