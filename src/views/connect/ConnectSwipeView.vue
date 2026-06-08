<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProfileStrength } from '../../composables/useFlowState'
import PhoneFrame from '../../components/PhoneFrame.vue'
import BottomNav from '../../components/BottomNav.vue'
import BisouButton from '../../components/BisouButton.vue'
import ProfileStrengthMeter from '../../components/ProfileStrengthMeter.vue'

const router = useRouter()
const strength = computed(() => getProfileStrength())

const PROFILE_TEMPLATES = [
  { name: 'Maya', age: 28, emoji: '👩🏽', distance: '3 mi', sun: 'Cancer', moon: 'Pisces', rising: 'Scorpio', vibe: "You'll vibe if you love deep talks over wine" },
  { name: 'Jordan', age: 31, emoji: '🧑🏻', distance: '5 mi', sun: 'Leo', moon: 'Gemini', rising: 'Libra', vibe: 'Looking for someone who matches my energy' },
  { name: 'Sam', age: 26, emoji: '🧔🏾', distance: '1 mi', sun: 'Virgo', moon: 'Taurus', rising: 'Capricorn', vibe: 'Bonus points if you know your moon sign' },
  { name: 'Riley', age: 29, emoji: '👩🏻‍🦱', distance: '4 mi', sun: 'Aquarius', moon: 'Sagittarius', rising: 'Aries', vibe: 'Spontaneous adventures > rigid plans' },
  { name: 'Alex', age: 27, emoji: '🧑🏽', distance: '2 mi', sun: 'Scorpio', moon: 'Cancer', rising: 'Pisces', vibe: 'Emotional depth is non-negotiable' },
  { name: 'Priya', age: 30, emoji: '👩🏾', distance: '6 mi', sun: 'Libra', moon: 'Leo', rising: 'Gemini', vibe: 'Great conversation is the best first date' },
  { name: 'Chris', age: 33, emoji: '👨🏼', distance: '8 mi', sun: 'Taurus', moon: 'Virgo', rising: 'Cancer', vibe: 'Slow mornings and good coffee' },
  { name: 'Zoe', age: 25, emoji: '👩🏼‍🎨', distance: '2 mi', sun: 'Gemini', moon: 'Aquarius', rising: 'Sagittarius', vibe: 'Tell me your hot take on Mercury retrograde' },
]

function randomCompat() {
  return Math.floor(Math.random() * 27) + 72
}

function buildDeck() {
  return PROFILE_TEMPLATES
    .map((p, i) => ({ ...p, id: i, compat: randomCompat() }))
    .sort(() => Math.random() - 0.5)
}

const deck = ref(buildDeck())
const index = ref(0)
const dragX = ref(0)
const dragY = ref(0)
const isDragging = ref(false)
const isAnimating = ref(false)
const lastAction = ref(null)

const current = computed(() => deck.value[index.value] ?? null)
const isEmpty = computed(() => index.value >= deck.value.length)
const dragRotation = computed(() => Math.min(Math.max(dragX.value * 0.08, -18), 18))

const cardStyle = computed(() => {
  if (isAnimating.value && lastAction.value) {
    const exit = lastAction.value === 'pass'
      ? { x: -420, r: -24 }
      : { x: 420, r: 24 }
    return {
      transform: `translate(${exit.x}px, 0) rotate(${exit.r}deg)`,
      transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    }
  }
  return {
    transform: `translate(${dragX.value}px, ${dragY.value}px) rotate(${dragRotation.value}deg)`,
    transition: isDragging.value ? 'none' : 'transform 0.25s ease',
  }
})

const stampVisible = computed(() => {
  if (Math.abs(dragX.value) < 40) return null
  return dragX.value > 0 ? 'like' : 'pass'
})

let startX = 0
let startY = 0
let activePointer = null

function onPointerDown(e) {
  if (isAnimating.value || isEmpty.value) return
  activePointer = e.pointerId
  isDragging.value = true
  startX = e.clientX - dragX.value
  startY = e.clientY - dragY.value
  e.currentTarget.setPointerCapture(e.pointerId)
}

function onPointerMove(e) {
  if (!isDragging.value || e.pointerId !== activePointer) return
  dragX.value = e.clientX - startX
  dragY.value = Math.min(Math.max(e.clientY - startY, -30), 30)
}

function onPointerUp(e) {
  if (!isDragging.value || e.pointerId !== activePointer) return
  isDragging.value = false
  activePointer = null

  if (dragX.value > 90) commitSwipe('like')
  else if (dragX.value < -90) commitSwipe('pass')
  else {
    dragX.value = 0
    dragY.value = 0
  }
}

function commitSwipe(action) {
  if (isAnimating.value || isEmpty.value) return
  isAnimating.value = true
  lastAction.value = action
  dragX.value = 0
  dragY.value = 0

  setTimeout(() => {
    index.value += 1
    isAnimating.value = false
    lastAction.value = null
  }, 350)
}

function reloadDeck() {
  deck.value = buildDeck()
  index.value = 0
}

onMounted(reloadDeck)
</script>

<template>
  <PhoneFrame :show-back="false">
    <div class="swipe-page">
      <header class="swipe-header">
        <button type="button" class="strength-link" @click="router.push('/connect/profile')">
          <ProfileStrengthMeter :percent="strength.percent" compact />
        </button>
        <button type="button" class="boost-link" @click="router.push('/connect/profile')">
          Boost profile →
        </button>
      </header>

      <div v-if="!strength.canSwipe" class="blocked">
        <p class="blocked-emoji">📷</p>
        <h2>Add a photo to start swiping</h2>
        <BisouButton @click="router.push('/connect/setup?step=photo')">Add photo</BisouButton>
      </div>

      <div v-else-if="isEmpty" class="blocked">
        <p class="blocked-emoji">✨</p>
        <h2>No profiles left</h2>
        <p class="blocked-sub">Try widening your filters or distance.</p>
        <BisouButton @click="reloadDeck">Refresh deck</BisouButton>
      </div>

      <div v-else class="card-stack">
        <div class="deck-area">
          <!-- peek of next card -->
          <div v-if="deck[index + 1]" class="swipe-card swipe-card--behind">
            <div class="card-photo card-photo--muted">
              <span class="card-emoji">{{ deck[index + 1].emoji }}</span>
            </div>
          </div>

          <div
            class="swipe-card swipe-card--active"
            :style="cardStyle"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
          >
            <div
              v-if="stampVisible === 'like'"
              class="stamp stamp--like"
            >LIKE</div>
            <div
              v-if="stampVisible === 'pass'"
              class="stamp stamp--pass"
            >NOPE</div>

            <div class="card-photo">
              <span class="card-emoji">{{ current.emoji }}</span>
              <div class="card-compat">{{ current.compat }}% match</div>
            </div>
            <div class="card-info">
              <h2>{{ current.name }}, {{ current.age }}</h2>
              <p class="card-meta">
                {{ current.distance }} · ☉ {{ current.sun }} · ☽ {{ current.moon }} · ↑ {{ current.rising }}
              </p>
              <p class="card-vibe">"{{ current.vibe }}"</p>
            </div>
          </div>
        </div>

        <p class="deck-count">{{ deck.length - index }} left in your area</p>

        <div class="swipe-actions">
          <button class="action-btn action-btn--pass" @click="commitSwipe('pass')">✕</button>
          <button class="action-btn action-btn--like" @click="commitSwipe('like')">♥</button>
        </div>
      </div>

      <BottomNav />
    </div>
  </PhoneFrame>
</template>

<style scoped>
.swipe-page {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--blue-1);
  padding: var(--screen-pt-safe) var(--screen-px) 0;
}

.swipe-header {
  flex-shrink: 0;
  padding-bottom: 12px;
}

.strength-link {
  display: block;
  width: 100%;
  text-align: left;
  border-radius: var(--radius-lg);
  transition: transform 0.15s, box-shadow 0.15s;
}

.strength-link:hover {
  transform: translateY(-1px);
}

.strength-link:active {
  transform: translateY(0);
}

.boost-link {
  display: block;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--blue-5);
  margin-top: 8px;
}

.blocked {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
  gap: 12px;
}

.blocked-emoji { font-size: 48px; }
.blocked h2 { font-size: 22px; }
.blocked-sub { font-size: 14px; color: var(--neutral-500); }

.card-stack {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding-bottom: 8px;
}

.deck-area {
  flex: 1;
  min-height: 0;
  position: relative;
}

.swipe-card {
  background: var(--neutral-0);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  touch-action: none;
  user-select: none;
}

.swipe-card--behind {
  position: absolute;
  inset: 8px 4px 0;
  transform: scale(0.96);
  opacity: 0.55;
  z-index: 0;
}

.swipe-card--active {
  position: absolute;
  inset: 0;
  z-index: 1;
  cursor: grab;
}

.swipe-card--active:active {
  cursor: grabbing;
}

.card-photo {
  flex: 1;
  min-height: 180px;
  background: var(--gradient-sky-sun-light);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.card-photo--muted {
  min-height: 100%;
}

.card-emoji { font-size: 80px; }

.card-compat {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--blue-5);
  color: white;
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 700;
}

.stamp {
  position: absolute;
  top: 40px;
  z-index: 2;
  padding: 6px 14px;
  border: 4px solid;
  border-radius: 8px;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.06em;
  transform: rotate(-18deg);
  pointer-events: none;
}

.stamp--like {
  left: 24px;
  color: var(--success);
  border-color: var(--success);
}

.stamp--pass {
  right: 24px;
  color: var(--error);
  border-color: var(--error);
  transform: rotate(18deg);
}

.card-info {
  padding: 20px;
  flex-shrink: 0;
}

.card-info h2 {
  font-size: 26px;
  margin-bottom: 4px;
}

.card-meta {
  font-size: 13px;
  color: var(--neutral-500);
  margin-bottom: 12px;
}

.card-vibe {
  font-size: 15px;
  font-style: italic;
  color: var(--neutral-700);
  line-height: 1.4;
}

.deck-count {
  text-align: center;
  font-size: 12px;
  color: var(--neutral-500);
  padding: 8px 0 4px;
  flex-shrink: 0;
}

.swipe-actions {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 12px 0 8px;
  flex-shrink: 0;
}

.action-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: transform 0.15s;
}

.action-btn:active { transform: scale(0.92); }
.action-btn--pass { background: var(--neutral-0); color: var(--error); border: 2px solid var(--outline); }
.action-btn--like { background: var(--orange-6); color: white; }
</style>
