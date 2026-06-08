<script setup>
import { useRouter } from 'vue-router'

defineProps({
  showBack: { type: Boolean, default: true },
  dark: { type: Boolean, default: false },
})

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <div class="phone-frame">
    <div class="phone-notch" />
    <div class="phone-screen" :class="{ 'phone-screen--dark': dark }">
      <button v-if="showBack" class="back-btn" @click="goBack">←</button>
      <div class="phone-content">
        <slot />
      </div>
    </div>
    <div class="phone-home-bar" />
  </div>
</template>

<style scoped>
.phone-frame {
  width: 390px;
  max-width: 100%;
  background: #111;
  border-radius: 44px;
  padding: 12px;
  box-shadow: var(--shadow-lg), 0 0 0 1px rgba(255, 255, 255, 0.08);
  position: relative;
}

.phone-notch {
  width: 120px;
  height: 28px;
  background: #111;
  border-radius: 0 0 18px 18px;
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.phone-screen {
  background: var(--blue-1);
  border-radius: 36px;
  overflow: hidden;
  height: min(844px, calc(100vh - 80px));
  min-height: 680px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.phone-screen--dark {
  background: var(--gradient-night);
  color: var(--neutral-0);
}

.phone-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 20;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--blue-5);
  box-shadow: var(--shadow-sm);
}

.phone-screen--dark .back-btn {
  background: rgba(255, 255, 255, 0.15);
  color: var(--neutral-0);
}

.phone-home-bar {
  width: 120px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin: 8px auto 0;
}

@media (max-width: 420px) {
  .phone-frame {
    width: 100%;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
    background: transparent;
  }

  .phone-notch,
  .phone-home-bar {
    display: none;
  }

  .phone-screen {
    border-radius: 0;
    height: 100vh;
    min-height: 100vh;
  }
}
</style>
