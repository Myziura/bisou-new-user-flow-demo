<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  flowState,
  getWesternSign,
  getVedicSign,
  getAge,
} from "../../composables/useFlowState";
import PhoneFrame from "../../components/PhoneFrame.vue";
import BisouButton from "../../components/BisouButton.vue";

const router = useRouter();

const day = ref("");
const month = ref("");
const year = ref("");
const showUnder18 = ref(false);

const placeQuery = ref(flowState.birthPlace || "");
const birthTime = ref(flowState.birthTime || "12:00");
const displayConf = ref(0);

if (flowState.birthDate) {
  const [y, m, d] = flowState.birthDate.split("-");
  year.value = y;
  month.value = String(Number(m));
  day.value = String(Number(d));
}

const CITIES = [
  "Kyiv, Ukraine",
  "New York, USA",
  "Los Angeles, USA",
  "London, UK",
  "Paris, France",
  "Berlin, Germany",
  "Tokyo, Japan",
  "Sydney, Australia",
  "Toronto, Canada",
  "Mumbai, India",
  "São Paulo, Brazil",
  "Mexico City, Mexico",
  "Cape Town, South Africa",
];

const dateValid = computed(() =>
  Boolean(day.value && month.value && year.value),
);
const westernSign = computed(() =>
  dateValid.value
    ? getWesternSign(Number(month.value), Number(day.value))
    : null,
);
const vedicSign = computed(() =>
  dateValid.value ? getVedicSign(Number(month.value), Number(day.value)) : null,
);
const signShift = computed(
  () =>
    westernSign.value &&
    vedicSign.value &&
    westernSign.value.name !== vedicSign.value.name,
);
const suggestions = computed(() => {
  if (!placeQuery.value || placeQuery.value.length < 2) return [];
  const q = placeQuery.value.toLowerCase();
  return CITIES.filter(c => c.toLowerCase().includes(q)).slice(0, 5);
});
const placeSelected = computed(() => CITIES.includes(placeQuery.value));
const canReveal = computed(() => dateValid.value && placeSelected.value);

const targetConf = computed(() => {
  if (!dateValid.value) return 0;
  if (placeSelected.value) return 90;
  return 70;
});

onMounted(() => {
  displayConf.value = targetConf.value;
});

watch(targetConf, next => {
  const start = displayConf.value;
  const diff = next - start;
  if (!diff) return;
  const steps = Math.abs(diff);
  let step = 0;
  const tick = () => {
    step += 1;
    displayConf.value = start + Math.round((diff * step) / steps);
    if (step < steps) requestAnimationFrame(tick);
    else displayConf.value = next;
  };
  tick();
});

function selectCity(city) {
  placeQuery.value = city;
}

function continueFlow() {
  const birthDate = `${year.value}-${String(month.value).padStart(2, "0")}-${String(day.value).padStart(2, "0")}`;
  if (getAge(birthDate) < 18) {
    showUnder18.value = true;
    return;
  }
  flowState.birthDate = birthDate;
  flowState.birthPlace = placeQuery.value;
  flowState.birthTime = birthTime.value || "12:00";
  flowState.westernSign = westernSign.value.name;
  flowState.vedicSign = vedicSign.value.name;
  router.push("/scanning");
}
</script>

<template>
  <PhoneFrame :dark="true">
    <div class="page">
      <!-- Header -->
      <div class="page__header">
        <div class="header__orb" aria-hidden="true" />
        <div class="header__stars" aria-hidden="true">
          <span
            v-for="n in 8"
            :key="n"
            class="hstar"
            :style="{
              left: `${((n * 11.3) % 90) + 5}%`,
              top: `${((n * 17.7) % 70) + 10}%`,
              animationDelay: `${n * 0.4}s`,
            }" />
        </div>

        <div class="header__content">
          <p class="header__eyebrow">
            <span class="eyebrow__spark">✦</span>
            Your birth chart
          </p>
          <h1 class="header__title">When & where<br />were you born?</h1>
        </div>
      </div>

      <!-- Form -->
      <div class="page__form">
        <!-- Date -->
        <div class="field-group">
          <label class="field-label">Date of birth</label>
          <div class="date-row">
            <div class="field">
              <select v-model="day" class="select">
                <option value="" disabled>Day</option>
                <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
            <div class="field">
              <select v-model="month" class="select">
                <option value="" disabled>Month</option>
                <option
                  v-for="(m, i) in [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ]"
                  :key="i"
                  :value="i + 1">
                  {{ m }}
                </option>
              </select>
            </div>
            <div class="field field--year">
              <select v-model="year" class="select">
                <option value="" disabled>Year</option>
                <option v-for="y in 80" :key="y" :value="2026 - y">
                  {{ 2026 - y }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Compact micro-wow -->
        <Transition name="wow">
          <div v-if="dateValid && vedicSign" class="wow-card">
            <div class="wow-card__inner">
              <div class="wow-signs">
                <span class="wow-sign wow-sign--old">
                  {{ westernSign.emoji }} {{ westernSign.name }}
                </span>
                <span class="wow-sep">→</span>
                <span class="wow-sign wow-sign--mystery">???</span>
              </div>
            </div>
            <p class="wow-card__desc">
              In Western you're <strong>{{ westernSign.name }}</strong> — keep
              going to reveal your <strong>real Vedic sign</strong> and much
              more.
            </p>
            <div class="wow-bar">
              <div
                class="wow-bar__fill"
                :style="{ width: `${displayConf}%` }" />
            </div>
          </div>
        </Transition>

        <!-- Birthplace -->
        <Transition name="slide-up">
          <div v-if="dateValid" class="field-group">
            <label class="field-label"> Birth city </label>
            <input
              v-model="placeQuery"
              type="text"
              class="input"
              placeholder="e.g. Kyiv, London, New York…"
              autocomplete="off" />
            <ul v-if="suggestions.length && !placeSelected" class="suggestions">
              <li
                v-for="city in suggestions"
                :key="city"
                class="suggestions__item"
                @click="selectCity(city)">
                <span>📍</span>{{ city }}
              </li>
            </ul>
            <!-- <Transition name="fade">
              <p v-if="placeSelected" class="field-confirm">
                ✓ {{ placeQuery }}
              </p>
            </Transition> -->
          </div>
        </Transition>

        <!-- Birth time — always visible once place is selected, default 12:00 -->
        <Transition name="slide-up">
          <div v-if="placeSelected" class="field-group">
            <label class="field-label">
              Birth time
              <span class="field-badge field-badge--dim">(optional)</span>
            </label>
            <input v-model="birthTime" type="time" class="input" />
            <p class="time-note">
              Don't know it? Noon (12:00) is used by default — refine later in
              settings.
            </p>
          </div>
        </Transition>

        <div class="spacer" />
      </div>

      <!-- CTA footer -->
      <Transition name="footer-rise">
        <footer v-if="canReveal" class="page__footer">
          <BisouButton class="reveal-btn" @click="continueFlow">
            Reveal my Vedic chart →
          </BisouButton>
        </footer>
      </Transition>

      <!-- Under-18 dialog -->
      <Transition name="fade">
        <div
          v-if="showUnder18"
          class="overlay"
          @click.self="showUnder18 = false">
          <div class="dialog">
            <p class="dialog__emoji">✨</p>
            <h2>Bisou is for ages 18+</h2>
            <p>Come back when you're ready ✨</p>
            <BisouButton variant="secondary" @click="showUnder18 = false"
              >OK</BisouButton
            >
          </div>
        </div>
      </Transition>
    </div>
  </PhoneFrame>
</template>

<style scoped>
/* ─────────────────────────────────────────────
   Page — full dark, single consistent gradient
───────────────────────────────────────────── */
.page {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  background: linear-gradient(
    175deg,
    #07102e 0%,
    #0e1852 35%,
    #1c2278 65%,
    #261e80 100%
  );
  overflow: hidden;
  color: var(--neutral-0);
}

/* ── Header ── */
.page__header {
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  padding: var(--screen-pt-safe) var(--screen-px) 20px;
}

.header__orb {
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(120, 60, 255, 0.32);
  filter: blur(90px);
  top: -100px;
  right: -60px;
}

.header__stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hstar {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  animation: twinkle 3s ease-in-out infinite;
}

.header__content {
  position: relative;
  z-index: 1;
  margin-bottom: 20px;
}

.header__eyebrow {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);
  margin-bottom: 10px;
}

.eyebrow__spark {
  color: var(--orange-5);
  font-size: 10px;
  animation: twinkle 2s ease-in-out infinite;
}

.header__title {
  font-family: var(--font-serif);
  font-size: 30px;
  line-height: 1.1;
  color: var(--neutral-0);
}

/* ── Steps ── */
.steps {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
}

.step {
  display: flex;
  align-items: center;
  gap: 5px;
  transition: opacity 0.3s;
}

.step--dim {
  opacity: 0.3;
}

.step__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  flex-shrink: 0;
  transition:
    background 0.3s,
    box-shadow 0.3s;
}

.step--active .step__dot {
  background: var(--orange-5);
  box-shadow: 0 0 10px rgba(255, 138, 82, 0.65);
}
.step--done .step__dot {
  background: #5cd685;
  box-shadow: 0 0 8px rgba(92, 214, 133, 0.5);
}

.step__label {
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
}

.step__optional {
  font-size: 10px;
  opacity: 0.5;
}

.step__connector {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin: 0 6px;
}

/* ── Form area ── */
.page__form {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 24px var(--screen-px) 8px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.82);
  display: flex;
  align-items: center;
  gap: 6px;
}

.field-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--orange-5);
  background: rgba(255, 138, 82, 0.14);
  padding: 2px 8px;
  border-radius: 100px;
  border: 1px solid rgba(255, 138, 82, 0.3);
}

.field-badge--dim {
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
}

.date-row {
  display: flex;
  gap: 10px;
}
.field {
  flex: 1;
}
.field--year {
  flex: 1.35;
}

/* Dark-native inputs */
.select,
.input {
  width: 100%;
  padding: 14px;
  border: 1.5px solid rgba(255, 255, 255, 0.16);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.07);
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  -webkit-appearance: none;
  appearance: none;
}

.select option {
  background: #151d60;
  color: #fff;
}

.select:focus,
.input:focus {
  outline: none;
  border-color: rgba(255, 138, 82, 0.6);
  box-shadow: 0 0 0 3px rgba(255, 138, 82, 0.12);
  background: rgba(255, 255, 255, 0.1);
}

.select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='rgba(255,255,255,0.45)' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px 8px;
  padding-right: 32px;
  cursor: pointer;
}

/* Fix: merge our gradient with the select background */
.select {
  background-color: rgba(255, 255, 255, 0.07);
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.field-confirm {
  font-size: 13px;
  font-weight: 600;
  color: #5cd685;
}

/* ── Suggestions ── */
.suggestions {
  list-style: none;
  border: 1.5px solid rgba(255, 255, 255, 0.14);
  border-top: none;
  border-radius: 0 0 var(--radius) var(--radius);
  overflow: hidden;
  background: rgba(14, 22, 72, 0.96);
  box-shadow: 0 12px 32px rgba(0, 0, 10, 0.4);
}

.suggestions__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  transition: background 0.15s;
}

.suggestions__item:hover {
  background: rgba(255, 255, 255, 0.07);
}
.suggestions__item:last-child {
  border-bottom: none;
}

/* ── Compact micro-wow ── */
.wow-card {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.wow-card__inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  flex-wrap: wrap;
}

.wow-signs {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.wow-sign {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.wow-sign--old {
  color: rgba(255, 255, 255, 0.38);
}

.wow-sign--mystery {
  color: var(--orange-5);
  opacity: 0.75;
  font-size: 14px;
  letter-spacing: 0.04em;
  animation: mystery-pulse 1.8s ease-in-out infinite;
}

@keyframes mystery-pulse {
  0%,
  100% {
    opacity: 0.55;
    text-shadow: none;
  }
  50% {
    opacity: 1;
    text-shadow: 0 0 10px rgba(255, 138, 82, 0.7);
  }
}

.wow-sep {
  color: var(--orange-5);
  font-size: 12px;
  flex-shrink: 0;
}

.wow-msg {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--orange-5);
  background: rgba(255, 138, 82, 0.12);
  padding: 2px 8px;
  border-radius: 100px;
  border: 1px solid rgba(255, 138, 82, 0.25);
  white-space: nowrap;
  flex-shrink: 0;
}

.wow-card__desc {
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.55);
  padding: 0 14px 10px;
}

.wow-card__desc strong {
  color: rgba(255, 255, 255, 0.88);
  font-weight: 600;
}

.wow-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.wow-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #6b7ff0, var(--orange-5));
  transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Time field ── */
.time-note {
  font-size: 12px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.38);
}

.spacer {
  height: 80px;
}

/* ── Footer ── */
.page__footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px var(--screen-px) var(--screen-pb);
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(7, 16, 46, 0.97) 30%
  );
  z-index: 10;
}

:deep(.reveal-btn) {
  font-size: 17px;
  font-weight: 700;
  padding: 18px 24px;
  background: linear-gradient(135deg, #ff9f52 0%, #ff6e26 100%);
  box-shadow:
    0 8px 32px rgba(255, 110, 38, 0.5),
    0 0 0 1px rgba(255, 160, 82, 0.3);
  letter-spacing: 0.01em;
}

/* ── Dialog ── */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(4, 10, 27, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 30;
}

.dialog {
  background: rgba(18, 24, 76, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-xl);
  padding: 32px 24px;
  text-align: center;
  max-width: 300px;
}

.dialog__emoji {
  font-size: 40px;
  margin-bottom: 16px;
}
.dialog h2 {
  font-size: 22px;
  margin-bottom: 8px;
  color: var(--neutral-0);
}
.dialog p {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 24px;
}

/* ── Transitions ── */
.wow-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.4s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.wow-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

.slide-up-enter-active {
  transition:
    opacity 0.3s ease,
    max-height 0.38s ease,
    transform 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}
.slide-up-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.footer-rise-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.32s ease;
}
.footer-rise-enter-from {
  opacity: 0;
  transform: translateY(14px);
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(0.7);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.3);
  }
}
</style>
