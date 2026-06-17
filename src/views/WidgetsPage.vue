<template>
  <div class="wg-page">

    <div class="wg-header">
      <h1 class="wg-title">Home Screen Widgets</h1>
      <p class="wg-sub">Tap a widget size to preview</p>
    </div>

    <!-- Size picker -->
    <div class="size-bar">
      <button
        v-for="sz in SIZES"
        :key="sz.id"
        class="size-btn"
        :class="{ 'size-btn--active': activeSize === sz.id }"
        @click="activeSize = sz.id"
      >{{ sz.label }}</button>
    </div>

    <!-- iPhone home screen mockup -->
    <div class="iphone">
      <!-- Notch / Dynamic Island -->
      <div class="iphone-island" />

      <!-- Status bar -->
      <div class="iphone-status">
        <span class="iphone-time">9:41</span>
        <div class="iphone-status-right">
          <span class="iphone-signal">●●●</span>
          <span class="iphone-wifi">▲</span>
          <span class="iphone-battery">▌</span>
        </div>
      </div>

      <!-- Lock screen date (above widget) -->
      <div class="iphone-lockdate">
        <p class="iphone-lock-day">Thursday</p>
        <p class="iphone-lock-date">June 12</p>
      </div>

      <!-- THE WIDGET (centred on screen) -->
      <div class="iphone-widget-area">

        <!-- Small widget -->
        <template v-if="activeSize === 'small'">
          <div class="widget widget--sm glass-widget">
            <div class="ws-bloom" />
            <span class="ws-icon">🌕</span>
            <p class="ws-band">HIGH</p>
            <p class="ws-nstar">Pushya</p>
            <div class="ws-dots">
              <span class="ws-dot" style="background:#4ade80" />
              <span class="ws-dot" style="background:#4ade80" />
              <span class="ws-dot" style="background:#fbbf24" />
            </div>
            <p class="ws-brand">bisou</p>
          </div>
        </template>

        <!-- Medium widget -->
        <template v-if="activeSize === 'medium'">
          <div class="widget widget--md glass-widget">
            <div class="wm-left">
              <span class="wm-icon">🌕</span>
              <p class="wm-sentence">Full Moon — set an intention before midnight.</p>
              <div class="wm-pill">Friday · Full Moon</div>
            </div>
            <div class="wm-divider" />
            <div class="wm-right">
              <div class="wm-erow">
                <span class="wm-erow-icon">🌿</span>
                <span class="wm-erow-dot" style="background:#4ade80" />
                <span class="wm-erow-band" style="color:#4ade80">High</span>
              </div>
              <div class="wm-erow">
                <span class="wm-erow-icon">💛</span>
                <span class="wm-erow-dot" style="background:#4ade80" />
                <span class="wm-erow-band" style="color:#4ade80">High</span>
              </div>
              <div class="wm-erow">
                <span class="wm-erow-icon">⚡</span>
                <span class="wm-erow-dot" style="background:#fbbf24" />
                <span class="wm-erow-band" style="color:#fbbf24">Mod</span>
              </div>
              <p class="wm-brand">bisou</p>
            </div>
          </div>
        </template>

        <!-- Large widget -->
        <template v-if="activeSize === 'large'">
          <div class="widget widget--lg glass-widget">
            <div class="wl-top">
              <div class="wl-top-left">
                <span class="wl-icon">🌕</span>
                <div>
                  <p class="wl-day">Friday, Jun 13</p>
                  <p class="wl-nakshatra">🌸 Pushya</p>
                </div>
              </div>
              <p class="wl-brand">bisou</p>
            </div>

            <p class="wl-sentence">Full Moon day — emotions are amplified and the sky is at its brightest. Set an intention before midnight.</p>

            <div class="wl-sep" />

            <div class="wl-energy">
              <div class="wl-erow">
                <span class="wl-erow-icon">🌿</span>
                <span class="wl-erow-name">Health</span>
                <div class="wl-erow-bar">
                  <div class="wl-erow-fill" style="width:82%;background:#4ade80" />
                </div>
                <span class="wl-erow-label" style="color:#4ade80">High</span>
              </div>
              <div class="wl-erow">
                <span class="wl-erow-icon">💛</span>
                <span class="wl-erow-name">Relations</span>
                <div class="wl-erow-bar">
                  <div class="wl-erow-fill" style="width:90%;background:#4ade80" />
                </div>
                <span class="wl-erow-label" style="color:#4ade80">High</span>
              </div>
              <div class="wl-erow">
                <span class="wl-erow-icon">⚡</span>
                <span class="wl-erow-name">Career</span>
                <div class="wl-erow-bar">
                  <div class="wl-erow-fill" style="width:54%;background:#fbbf24" />
                </div>
                <span class="wl-erow-label" style="color:#fbbf24">Mod</span>
              </div>
            </div>

            <div class="wl-sep" />

            <div class="wl-footer">
              <div class="wl-footer-item">
                <span class="wl-footer-icon">🔥</span>
                <span class="wl-footer-text">Day 14 streak</span>
              </div>
              <div class="wl-footer-item">
                <span class="wl-footer-icon">♃</span>
                <span class="wl-footer-text">Jupiter Mahadasha</span>
              </div>
            </div>
          </div>
        </template>

      </div><!-- /widget area -->

      <!-- Home indicator -->
      <div class="iphone-home" />
    </div><!-- /iphone -->

    <!-- Size caption -->
    <p class="size-caption">{{ currentSize.caption }}</p>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const SIZES = [
  { id: 'small',  label: 'Small',  caption: 'Small (2×2) — Day Energy at a glance' },
  { id: 'medium', label: 'Medium', caption: 'Medium (4×2) — Day summary + energy categories' },
  { id: 'large',  label: 'Large',  caption: 'Large (4×4) — Full Today snapshot' },
]

const activeSize = ref('medium')
const currentSize = computed(() => SIZES.find(s => s.id === activeSize.value))
</script>

<style scoped>
/* ── Page ─────────────────────────────────────────────────────────────────── */
.wg-page {
  min-height: 100vh;
  background: #0b0c17;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  padding: 52px 20px 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.wg-header {
  text-align: center;
  margin-bottom: 28px;
}
.wg-title {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 6px;
}
.wg-sub {
  font-size: 13px;
  color: rgba(255,255,255,0.35);
  font-weight: 500;
  margin: 0;
}

/* ── Size picker ─────────────────────────────────────────────────────────── */
.size-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 36px;
}
.size-btn {
  padding: 8px 22px;
  border-radius: 100px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.45);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.size-btn--active {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.3);
  color: #fff;
}

/* ── iPhone shell ─────────────────────────────────────────────────────────── */
.iphone {
  width: 320px;
  min-height: 620px;
  border-radius: 50px;
  border: 8px solid #1c1c1e;
  background: linear-gradient(160deg, #0d1226 0%, #160e30 50%, #0e0e1a 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.08),
    0 40px 80px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.06);
}

/* Dynamic Island */
.iphone-island {
  width: 100px;
  height: 30px;
  background: #0a0a0a;
  border-radius: 20px;
  margin-top: 10px;
  flex-shrink: 0;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
}

/* Status bar */
.iphone-status {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 22px 0;
  flex-shrink: 0;
}
.iphone-time {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.88);
  letter-spacing: -0.01em;
}
.iphone-status-right {
  display: flex;
  gap: 5px;
  align-items: center;
  color: rgba(255,255,255,0.7);
  font-size: 10px;
}

/* Lock screen date */
.iphone-lockdate {
  margin-top: 22px;
  text-align: center;
  flex-shrink: 0;
}
.iphone-lock-day {
  font-size: 17px;
  color: rgba(255,255,255,0.55);
  font-weight: 400;
  margin: 0 0 2px;
  letter-spacing: 0.01em;
}
.iphone-lock-date {
  font-size: 72px;
  font-weight: 200;
  color: rgba(255,255,255,0.92);
  line-height: 1;
  margin: 0;
  letter-spacing: -3px;
}

/* Widget area */
.iphone-widget-area {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 18px;
}

/* Home indicator */
.iphone-home {
  width: 120px;
  height: 5px;
  background: rgba(255,255,255,0.25);
  border-radius: 3px;
  margin-bottom: 14px;
  flex-shrink: 0;
}

/* ── Widget base ─────────────────────────────────────────────────────────── */
.glass-widget {
  background: rgba(20, 16, 40, 0.72);
  backdrop-filter: blur(28px) saturate(1.4);
  border: 1px solid rgba(255,255,255,0.10);
}

/* ── Small widget ────────────────────────────────────────────────────────── */
.widget--sm {
  width: 148px;
  height: 148px;
  border-radius: 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 12px;
  position: relative;
  overflow: hidden;
}
.ws-bloom {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle at 40% 30%, rgba(200,180,255,0.18) 0%, transparent 65%);
  pointer-events: none;
}
.ws-icon {
  font-size: 32px;
  line-height: 1;
  position: relative;
  z-index: 1;
}
.ws-band {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #4ade80;
  margin: 0;
  position: relative;
  z-index: 1;
}
.ws-nstar {
  font-size: 11px;
  color: rgba(255,255,255,0.55);
  font-weight: 500;
  margin: 0;
  position: relative;
  z-index: 1;
}
.ws-dots {
  display: flex;
  gap: 5px;
  position: relative;
  z-index: 1;
  margin-top: 3px;
}
.ws-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.ws-brand {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.2);
  text-transform: uppercase;
  position: absolute;
  bottom: 10px;
  right: 12px;
  margin: 0;
}

/* ── Medium widget ───────────────────────────────────────────────────────── */
.widget--md {
  width: 100%;
  height: 148px;
  border-radius: 26px;
  display: flex;
  align-items: stretch;
  overflow: hidden;
}
.wm-left {
  flex: 1;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
}
.wm-icon {
  font-size: 24px;
  line-height: 1;
}
.wm-sentence {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.88);
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.wm-pill {
  display: inline-block;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 100px;
  padding: 3px 9px;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255,255,255,0.45);
  width: fit-content;
  margin-top: 2px;
}
.wm-divider {
  width: 1px;
  background: rgba(255,255,255,0.07);
  flex-shrink: 0;
  margin: 14px 0;
}
.wm-right {
  width: 90px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 14px 12px;
  gap: 7px;
  position: relative;
}
.wm-erow {
  display: flex;
  align-items: center;
  gap: 5px;
}
.wm-erow-icon { font-size: 12px; }
.wm-erow-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.wm-erow-band {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
}
.wm-brand {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.18);
  text-transform: uppercase;
  position: absolute;
  bottom: 10px;
  right: 10px;
  margin: 0;
}

/* ── Large widget ────────────────────────────────────────────────────────── */
.widget--lg {
  width: 100%;
  border-radius: 26px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.wl-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.wl-top-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.wl-icon {
  font-size: 28px;
  line-height: 1;
}
.wl-day {
  font-size: 11px;
  color: rgba(255,255,255,0.45);
  font-weight: 500;
  margin: 0 0 2px;
}
.wl-nakshatra {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  margin: 0;
}
.wl-brand {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.18);
  text-transform: uppercase;
  margin: 0;
}
.wl-sentence {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.72);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.wl-sep {
  height: 1px;
  background: rgba(255,255,255,0.07);
}
.wl-energy {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.wl-erow {
  display: flex;
  align-items: center;
  gap: 7px;
}
.wl-erow-icon { font-size: 13px; flex-shrink: 0; }
.wl-erow-name {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  font-weight: 500;
  width: 56px;
  flex-shrink: 0;
}
.wl-erow-bar {
  flex: 1;
  height: 4px;
  background: rgba(255,255,255,0.08);
  border-radius: 99px;
  overflow: hidden;
}
.wl-erow-fill {
  height: 100%;
  border-radius: 99px;
}
.wl-erow-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  width: 30px;
  text-align: right;
  flex-shrink: 0;
}
.wl-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wl-footer-item {
  display: flex;
  align-items: center;
  gap: 5px;
}
.wl-footer-icon { font-size: 13px; }
.wl-footer-text {
  font-size: 11px;
  color: rgba(255,255,255,0.45);
  font-weight: 500;
}

/* ── Caption ─────────────────────────────────────────────────────────────── */
.size-caption {
  margin-top: 20px;
  font-size: 13px;
  color: rgba(255,255,255,0.35);
  font-weight: 500;
  text-align: center;
}
</style>
