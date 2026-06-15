<template>
  <div class="wg-page">
    <!-- ── Page header ── -->
    <div class="wg-page-header">
      <h1 class="wg-page-title">Widgets</h1>
      <p class="wg-page-sub">Home screen widgets · 6 designs</p>
    </div>

    <!-- ── Scenario picker ── -->
    <div class="scenario-bar">
      <button
        v-for="sc in SCENARIOS"
        :key="sc.id"
        class="sc-btn"
        :class="{ 'sc-btn--active': activeId === sc.id }"
        @click="activeId = sc.id"
      >{{ sc.label }}</button>
    </div>

    <!-- ── Wallpaper preview frame ── -->
    <div class="phone-canvas" :class="`phone-canvas--${d.theme}`">
      <div class="wg-os-bar">
        <span class="wg-os-time">{{ d.time }}</span>
        <span class="wg-os-date">{{ d.dateLabel }}</span>
      </div>

      <!-- Row 1: 3 small widgets -->
      <div class="wg-row">

        <!-- S1: Today's Pulse -->
        <div class="widget widget--sm glass-widget">
          <div class="ws-bloom" :style="{ background: bloomColor }"></div>
          <span class="ws-icon">{{ d.icon }}</span>
          <div class="ws-state-pill" :style="{ color: bandColor(d.avgBand) }">{{ d.avgBand }}</div>
          <p class="ws-nstar">{{ d.nakshatraName }}</p>
          <div class="ws-dots">
            <span class="ws-dot" v-for="e in d.energy3" :key="e.key"
              :style="{ background: energyColor(e.band) }" />
          </div>
        </div>

        <!-- S2: Cosmic Clock -->
        <div class="widget widget--sm glass-widget">
          <span class="ws-hora-icon">{{ d.horaIcon }}</span>
          <p class="ws-hora-label">HORA</p>
          <p class="ws-hora-planet">{{ d.horaPlanet }}</p>
          <div class="ws-divider"></div>
          <p class="ws-next-label">Next: {{ d.nextHora }}</p>
        </div>

        <!-- S3: My Cycle -->
        <div class="widget widget--sm glass-widget">
          <div class="ws-ring-wrap">
            <svg class="ws-ring-svg" viewBox="0 0 60 60">
              <circle class="ws-ring-track" cx="30" cy="30" r="23" />
              <circle
                class="ws-ring-fill"
                cx="30" cy="30" r="23"
                :stroke="d.dashaColor"
                :stroke-dasharray="`${d.cycleProgress * 1.445} 144.5`"
              />
            </svg>
            <span class="ws-ring-center-icon">{{ d.dashaIcon }}</span>
          </div>
          <p class="ws-dasha-name">{{ d.dashaPlanet }}</p>
          <p class="ws-dasha-pct">{{ d.cycleProgress }}%</p>
        </div>
      </div>

      <!-- Row 2: Medium – Day Summary -->
      <div class="widget widget--md glass-widget">
        <div class="wm-left">
          <span class="wm-icon">{{ d.icon }}</span>
          <p class="wm-sentence">{{ d.shortSentence }}</p>
          <div class="info-pill-sm">{{ d.pill }}</div>
        </div>
        <div class="wm-right">
          <div v-for="e in d.energy3" :key="e.key" class="wm-energy-row">
            <span class="wm-e-icon">{{ e.icon }}</span>
            <span class="wm-e-dot" :style="{ background: energyColor(e.band) }"></span>
            <span class="wm-e-band" :style="{ color: energyColor(e.band) }">{{ shortBand(e.band) }}</span>
          </div>
        </div>
      </div>

      <!-- Row 3: Medium – Panchanga -->
      <div class="widget widget--md glass-widget">
        <p class="wm-panchanga-title">PANCHANGA</p>
        <div class="wm-panchanga-grid">
          <div v-for="item in d.panchanga" :key="item.label" class="wm-panch-cell">
            <p class="wm-panch-label">{{ item.label }}</p>
            <p class="wm-panch-val">{{ item.value }}</p>
          </div>
        </div>
      </div>

      <!-- Row 4: Large – Full Today -->
      <div class="widget widget--lg glass-widget">
        <!-- Top: icon + sentence -->
        <div class="wl-top">
          <span class="wl-icon">{{ d.icon }}</span>
          <p class="wl-sentence">{{ d.sentence }}</p>
        </div>
        <div class="wl-divider"></div>
        <!-- Energy rows -->
        <div class="wl-energy-rows">
          <div v-for="e in d.energy3" :key="e.key" class="wl-erow">
            <span class="wl-erow-icon" :class="`wl-erow-icon--${e.key}`">{{ e.icon }}</span>
            <span class="wl-erow-name">{{ e.name }}</span>
            <span class="wl-erow-dot" :style="{ background: energyColor(e.band) }"></span>
            <span class="wl-erow-band" :style="{ color: energyColor(e.band) }">{{ e.band }}</span>
          </div>
        </div>
        <div class="wl-divider"></div>
        <!-- Bottom: nakshatra + dasha -->
        <div class="wl-footer">
          <span class="wl-footer-item">{{ d.nakshatraEmoji }} {{ d.nakshatraName }}</span>
          <span class="wl-footer-sep">·</span>
          <span class="wl-footer-item">{{ d.dashaIcon }} {{ d.dashaPlanet }} Mahadasha</span>
        </div>
      </div>

    </div><!-- /phone-canvas -->

    <!-- ── Widget catalogue labels ── -->
    <div class="wg-catalogue">
      <div class="wg-cat-section">
        <p class="wg-cat-size">Small  2×2</p>
        <div class="wg-cat-row">
          <div class="wg-cat-card">
            <p class="wg-cat-name">Today's Pulse</p>
            <p class="wg-cat-desc">Overall energy state + nakshatra of the day + per-category dots</p>
          </div>
          <div class="wg-cat-card">
            <p class="wg-cat-name">Cosmic Clock</p>
            <p class="wg-cat-desc">Active Hora planet + next Hora transition time</p>
          </div>
          <div class="wg-cat-card">
            <p class="wg-cat-name">My Cycle</p>
            <p class="wg-cat-desc">Vimshottari Mahadasha progress ring with active planet</p>
          </div>
        </div>
      </div>
      <div class="wg-cat-section">
        <p class="wg-cat-size">Medium  4×2</p>
        <div class="wg-cat-row">
          <div class="wg-cat-card">
            <p class="wg-cat-name">Day Summary</p>
            <p class="wg-cat-desc">Day synthesis sentence + 3 energy states at a glance</p>
          </div>
          <div class="wg-cat-card">
            <p class="wg-cat-name">Panchanga</p>
            <p class="wg-cat-desc">Tithi · Vara · Nakshatra · Yoga · Karana · Sunrise in a grid</p>
          </div>
        </div>
      </div>
      <div class="wg-cat-section">
        <p class="wg-cat-size">Large  4×4</p>
        <div class="wg-cat-row">
          <div class="wg-cat-card wg-cat-card--wide">
            <p class="wg-cat-name">Full Today</p>
            <p class="wg-cat-desc">Complete daily snapshot — synthesis · 3 energy rows · nakshatra · dasha</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ── Scenarios ───────────────────────────────────────────────────────────────
const SCENARIOS = [
  { id: 'full_moon',    label: '🌕 Full Moon' },
  { id: 'mercury_mind', label: '☿ Mercury' },
  { id: 'rahu_kaal',    label: '🔴 Rahu Kaal' },
]
const activeId = ref('full_moon')

const SCENARIO_DATA = {
  full_moon: {
    theme: 'moon',
    time: '20:14',
    dateLabel: 'Friday, 13 Jun',
    icon: '🌕',
    avgBand: 'HIGH',
    shortSentence: 'Full Moon — emotions run high. Set an intention before midnight.',
    sentence: 'Full Moon day — emotions are amplified and the sky is at its brightest. Set an intention before midnight.',
    pill: 'Friday · Full Moon',
    nakshatraName: 'Pushya',
    nakshatraEmoji: '💎',
    horaIcon: '🌕',
    horaPlanet: 'Moon',
    nextHora: 'Saturn 21:01',
    dashaIcon: '♃',
    dashaPlanet: 'Jupiter',
    dashaColor: '#f9a8d4',
    cycleProgress: 62,
    energy3: [
      { key: 'health',    icon: '🌿', name: 'Health',        band: 'HIGH' },
      { key: 'relations', icon: '💛', name: 'Relationships', band: 'HIGH' },
      { key: 'affairs',   icon: '⚡', name: 'Career',        band: 'MODERATE' },
    ],
    panchanga: [
      { label: 'Tithi',    value: 'Purnima' },
      { label: 'Vara',     value: 'Friday' },
      { label: 'Nakshatra',value: 'Pushya' },
      { label: 'Yoga',     value: 'Siddha' },
      { label: 'Sunrise',  value: '06:28' },
      { label: 'Rahu',     value: '10:30–12:00' },
    ],
  },
  mercury_mind: {
    theme: 'teal',
    time: '14:22',
    dateLabel: 'Wednesday, 15 Jun',
    icon: '☿',
    avgBand: 'MODERATE',
    shortSentence: 'Mercury sharpens your mind. Write, plan, communicate.',
    sentence: 'Mercury sharpens your mind. Write, plan, communicate — this is your best day for it.',
    pill: 'Wednesday · Waxing Crescent',
    nakshatraName: 'Ardra',
    nakshatraEmoji: '💫',
    horaIcon: '☿',
    horaPlanet: 'Mercury',
    nextHora: 'Moon 15:06',
    dashaIcon: '♄',
    dashaPlanet: 'Saturn',
    dashaColor: '#94a3b8',
    cycleProgress: 38,
    energy3: [
      { key: 'health',    icon: '🌿', name: 'Health',        band: 'MODERATE' },
      { key: 'relations', icon: '💛', name: 'Relationships', band: 'MODERATE' },
      { key: 'affairs',   icon: '⚡', name: 'Career',        band: 'HIGH' },
    ],
    panchanga: [
      { label: 'Tithi',    value: 'Dvitiya' },
      { label: 'Vara',     value: 'Wednesday' },
      { label: 'Nakshatra',value: 'Ardra' },
      { label: 'Yoga',     value: 'Shubha' },
      { label: 'Sunrise',  value: '06:24' },
      { label: 'Rahu',     value: '12:00–13:30' },
    ],
  },
  rahu_kaal: {
    theme: 'dark',
    time: '13:40',
    dateLabel: 'Sunday, 8 Jun',
    icon: '🌙',
    avgBand: 'LOW',
    shortSentence: 'Rahu Kaal is active. Pause important decisions until 15:00.',
    sentence: 'Rahu Kaal is active until 15:00. Energy is scattered — ideal for reflection, not action.',
    pill: 'Sunday · Rahu Kaal',
    nakshatraName: 'Ashlesha',
    nakshatraEmoji: '🐍',
    horaIcon: '♃',
    horaPlanet: 'Jupiter',
    nextHora: 'Mars 14:18',
    dashaIcon: '☉',
    dashaPlanet: 'Sun',
    dashaColor: '#fbbf24',
    cycleProgress: 15,
    energy3: [
      { key: 'health',    icon: '🌿', name: 'Health',        band: 'LOW' },
      { key: 'relations', icon: '💛', name: 'Relationships', band: 'MODERATE' },
      { key: 'affairs',   icon: '⚡', name: 'Career',        band: 'LOW' },
    ],
    panchanga: [
      { label: 'Tithi',    value: 'Navami' },
      { label: 'Vara',     value: 'Sunday' },
      { label: 'Nakshatra',value: 'Ashlesha' },
      { label: 'Yoga',     value: 'Vyatipata' },
      { label: 'Sunrise',  value: '06:32' },
      { label: 'Rahu',     value: '13:30–15:00' },
    ],
  },
}

const d = computed(() => SCENARIO_DATA[activeId.value])

// ── Helpers ─────────────────────────────────────────────────────────────────
function energyColor(band) {
  if (band === 'HIGH')     return '#10b981'
  if (band === 'MODERATE') return '#f59e0b'
  return '#f87171'
}
function bandColor(band) { return energyColor(band) }
function shortBand(band) {
  if (band === 'HIGH')     return 'HIGH'
  if (band === 'MODERATE') return 'MOD'
  return 'LOW'
}

const bloomColor = computed(() => {
  const b = d.value.avgBand
  if (b === 'HIGH')     return 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)'
  if (b === 'MODERATE') return 'radial-gradient(circle, rgba(245,158,11,0.30) 0%, transparent 70%)'
  return 'radial-gradient(circle, rgba(248,113,113,0.30) 0%, transparent 70%)'
})
</script>

<style scoped>
/* ── Page ─────────────────────────────────────────────────────────────────── */
.wg-page {
  min-height: 100vh;
  background: #0d0e1a;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  padding: 48px 20px 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wg-page-header {
  text-align: center;
  margin-bottom: 28px;
}
.wg-page-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 6px;
}
.wg-page-sub {
  font-size: 13px;
  color: rgba(255,255,255,0.40);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0;
}

/* ── Scenario bar ─────────────────────────────────────────────────────────── */
.scenario-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}
.sc-btn {
  padding: 7px 16px;
  border-radius: 100px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.55);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.sc-btn--active {
  background: rgba(255,255,255,0.14);
  border-color: rgba(255,255,255,0.28);
  color: #fff;
}

/* ── Phone canvas (wallpaper) ─────────────────────────────────────────────── */
.phone-canvas {
  width: 340px;
  border-radius: 44px;
  padding: 20px 16px 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.10);
}
.phone-canvas--moon {
  background: linear-gradient(160deg, #0e1628 0%, #1a1040 100%);
}
.phone-canvas--teal {
  background: linear-gradient(160deg, #071820 0%, #0a2a28 100%);
}
.phone-canvas--dark {
  background: linear-gradient(160deg, #0e0e14 0%, #1a1020 100%);
}

/* OS bar */
.wg-os-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 6px 4px;
}
.wg-os-time {
  font-size: 36px;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: rgba(255,255,255,0.90);
  line-height: 1;
}
.wg-os-date {
  font-size: 12px;
  color: rgba(255,255,255,0.50);
  font-weight: 500;
  padding-bottom: 4px;
}

/* ── Widget base ──────────────────────────────────────────────────────────── */
.glass-widget {
  background: rgba(255,255,255,0.07);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.10);
}

.widget--sm {
  width: 96px;
  height: 96px;
  border-radius: 22px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 8px 6px;
  cursor: pointer;
  transition: transform 0.12s;
}
.widget--sm:active { transform: scale(0.94); }

.widget--md {
  width: 100%;
  height: 96px;
  border-radius: 22px;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.12s;
}
.widget--md:active { transform: scale(0.98); }

.widget--lg {
  width: 100%;
  border-radius: 22px;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.12s;
}
.widget--lg:active { transform: scale(0.98); }

.wg-row {
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

/* ── Small widget internals ───────────────────────────────────────────────── */
.ws-bloom {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  pointer-events: none;
}
.ws-icon {
  font-size: 26px;
  position: relative;
  z-index: 1;
  line-height: 1;
}
.ws-state-pill {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
  position: relative;
  z-index: 1;
}
.ws-nstar {
  font-size: 9px;
  color: rgba(255,255,255,0.55);
  font-weight: 600;
  position: relative;
  z-index: 1;
  margin: 0;
}
.ws-dots {
  display: flex;
  gap: 4px;
  position: relative;
  z-index: 1;
  margin-top: 2px;
}
.ws-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

/* Cosmic Clock small widget */
.ws-hora-icon {
  font-size: 28px;
  line-height: 1;
}
.ws-hora-label {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.10em;
  color: rgba(255,255,255,0.35);
  margin: 0;
}
.ws-hora-planet {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255,255,255,0.88);
  margin: 0;
}
.ws-divider {
  width: 40px;
  height: 1px;
  background: rgba(255,255,255,0.10);
  margin: 3px 0;
}
.ws-next-label {
  font-size: 8px;
  color: rgba(255,255,255,0.45);
  font-weight: 600;
  margin: 0;
  text-align: center;
}

/* My Cycle small widget */
.ws-ring-wrap {
  position: relative;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ws-ring-svg {
  width: 52px;
  height: 52px;
  position: absolute;
  inset: 0;
}
.ws-ring-track {
  fill: none;
  stroke: rgba(255,255,255,0.08);
  stroke-width: 4;
}
.ws-ring-fill {
  fill: none;
  stroke-width: 4;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dasharray 1s ease;
}
.ws-ring-center-icon {
  font-size: 20px;
  line-height: 1;
  position: relative;
  z-index: 1;
}
.ws-dasha-name {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255,255,255,0.80);
  margin: 2px 0 0;
}
.ws-dasha-pct {
  font-size: 9px;
  color: rgba(255,255,255,0.40);
  font-weight: 600;
  margin: 0;
}

/* ── Medium widget – Day Summary ──────────────────────────────────────────── */
.wm-left {
  flex: 1;
  padding: 12px 10px 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
}
.wm-icon {
  font-size: 20px;
  line-height: 1;
}
.wm-sentence {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.info-pill-sm {
  display: inline-block;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 100px;
  padding: 3px 8px;
  font-size: 9px;
  font-weight: 600;
  color: rgba(255,255,255,0.55);
  letter-spacing: 0.02em;
  width: fit-content;
  margin-top: 2px;
}
.wm-right {
  width: 88px;
  flex-shrink: 0;
  border-left: 1px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 10px;
  gap: 6px;
}
.wm-energy-row {
  display: flex;
  align-items: center;
  gap: 5px;
}
.wm-e-icon { font-size: 12px; }
.wm-e-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.wm-e-band {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.05em;
}

/* ── Medium widget – Panchanga ────────────────────────────────────────────── */
.wm-panchanga-title {
  position: absolute;
  top: 10px;
  left: 14px;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: rgba(255,255,255,0.30);
  margin: 0;
}
.widget--md { position: relative; }
.wm-panchanga-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  width: 100%;
  height: 100%;
  padding: 22px 12px 10px;
  align-content: center;
}
.wm-panch-cell {
  padding: 3px 4px;
}
.wm-panch-label {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  margin: 0 0 1px;
}
.wm-panch-val {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.85);
  margin: 0;
}

/* ── Large widget ─────────────────────────────────────────────────────────── */
.wl-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.wl-icon { font-size: 28px; line-height: 1; flex-shrink: 0; }
.wl-sentence {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.88);
  line-height: 1.45;
  margin: 0;
}
.wl-divider {
  height: 1px;
  background: rgba(255,255,255,0.08);
}
.wl-energy-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.wl-erow {
  display: flex;
  align-items: center;
  gap: 8px;
}
.wl-erow-icon { font-size: 16px; flex-shrink: 0; }
.wl-erow-icon--health   { filter: drop-shadow(0 0 4px rgba(16,185,129,0.5)); }
.wl-erow-icon--relations { filter: drop-shadow(0 0 4px rgba(244,114,182,0.5)); }
.wl-erow-icon--affairs  { filter: drop-shadow(0 0 4px rgba(129,140,248,0.5)); }
.wl-erow-name {
  flex: 1;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.70);
}
.wl-erow-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.wl-erow-band {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.05em;
  min-width: 64px;
  text-align: right;
}
.wl-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}
.wl-footer-item {
  font-size: 11px;
  color: rgba(255,255,255,0.50);
  font-weight: 600;
}
.wl-footer-sep {
  color: rgba(255,255,255,0.20);
  font-size: 12px;
}

/* ── Catalogue ────────────────────────────────────────────────────────────── */
.wg-catalogue {
  width: 100%;
  max-width: 340px;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.wg-cat-section {}
.wg-cat-size {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin: 0 0 10px;
}
.wg-cat-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.wg-cat-card {
  flex: 1;
  min-width: 90px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 11px 12px;
}
.wg-cat-card--wide { flex-basis: 100%; }
.wg-cat-name {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255,255,255,0.85);
  margin: 0 0 4px;
}
.wg-cat-desc {
  font-size: 11px;
  color: rgba(255,255,255,0.40);
  line-height: 1.4;
  margin: 0;
}
</style>
