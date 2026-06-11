<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { flowState, getDailyReading, getRevealSnapshot, resetFlow } from '../composables/useFlowState'
import PhoneFrame from '../components/PhoneFrame.vue'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const reading = computed(() => getDailyReading(flowState.sunSign))
const snapshot = computed(() => getRevealSnapshot())
const hasChart = computed(() => Boolean(flowState.sunSign && flowState.moonSign))

const SIGN_EMOJI = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
}

const stories = [
  { title: 'Mercury retrograde survival', color: '#3E4EA2' },
  { title: 'Moon rituals 101', color: '#FF8A52' },
  { title: 'Your nakshatra decoded', color: '#9610FF' },
]
</script>

<template>
  <PhoneFrame :show-back="false">
    <div class="today">
      <header class="today-header">
        <p class="greeting">{{ greeting }}, {{ flowState.name || 'friend' }}</p>
        <button class="reset-btn" title="Restart demo" @click="resetFlow(); router.push('/splash')">↺</button>
      </header>

      <div class="today-scroll">
        <section v-if="hasChart" class="chart-reveal">
          <div class="chart-reveal__header">
            <p class="chart-reveal__eyebrow">Your chart is ready</p>
            <div class="sun-badge">
              <span class="sun-badge__emoji">{{ SIGN_EMOJI[flowState.sunSign] }}</span>
              <span class="sun-badge__name">{{ flowState.sunSign }}</span>
              <span class="sun-badge__tag">Your real sun sign</span>
            </div>
          </div>

          <p v-if="flowState.birthPlace" class="chart-intro">
            Based on where and when you were born
            <strong>({{ flowState.birthPlace }})</strong>, here's what your chart tells us:
          </p>

          <div class="snapshot">
            <article
              v-for="layer in snapshot.layers"
              :key="layer.prefix"
              class="layer-card"
            >
              <span class="layer-card__emoji">{{ layer.emoji }}</span>
              <div>
                <p class="layer-card__prefix">{{ layer.prefix }}</p>
                <p class="layer-card__body">{{ layer.body }}.</p>
              </div>
            </article>
          </div>
        </section>

        <section class="energy-card">
          <div class="energy-badge">{{ flowState.sunSign }} · {{ flowState.moonSign }} moon</div>
          <h1 class="today-title">Today's Energy</h1>
          <p class="energy-reading">{{ reading }}</p>
        </section>

        <section class="section">
          <h2 class="section-title">For you today</h2>
          <div class="card-row">
            <div class="mini-card mini-card--green">
              <span class="mini-emoji">✨</span>
              <strong>Highlight</strong>
              <p>{{ snapshot.todayHighlight }}</p>
            </div>
            <div class="mini-card mini-card--orange">
              <span class="mini-emoji">⚡</span>
              <strong>Watch for</strong>
              <p>{{ snapshot.todayLowlight }}</p>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">Stories</h2>
          <div class="stories">
            <div
              v-for="story in stories"
              :key="story.title"
              class="story-card"
              :style="{ background: story.color }"
            >
              <span>{{ story.title }}</span>
            </div>
          </div>
        </section>

        <section class="new-today-teaser" @click="router.push('/new-today')">
          <div class="teaser-content">
            <span class="teaser-emoji">🌙</span>
            <div>
              <strong>Preview: New Today Page</strong>
              <p>See the redesigned experience →</p>
            </div>
          </div>
        </section>

        <section class="connect-teaser" @click="router.push('/connect')">
          <div class="teaser-content">
            <span class="teaser-emoji">💫</span>
            <div>
              <strong>500+ people are matched to your chart.</strong>
              <p>Curious? → Explore Connect</p>
            </div>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  </PhoneFrame>
</template>

<style scoped>
.today {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--blue-1);
  padding: var(--screen-pt-safe) var(--screen-px) 0;
}

.today-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  flex-shrink: 0;
}

.greeting {
  font-size: 14px;
  color: var(--neutral-500);
}

.today-title {
  font-size: 28px;
  margin-bottom: 12px;
}

.reset-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--neutral-0);
  border: 1px solid var(--outline);
  font-size: 18px;
  color: var(--neutral-500);
}

.today-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 8px;
}

.chart-reveal {
  background: var(--gradient-sky-sun-light);
  border-radius: var(--radius-xl);
  padding: 20px 18px;
  margin-bottom: 20px;
}

.chart-reveal__header {
  text-align: center;
  margin-bottom: 14px;
}

.chart-reveal__eyebrow {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--blue-5);
  margin-bottom: 10px;
}

.sun-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--neutral-0);
  border-radius: 100px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--outline);
}

.sun-badge__emoji {
  font-size: 20px;
  line-height: 1;
}

.sun-badge__name {
  font-family: var(--font-serif);
  font-size: 18px;
  color: var(--blue-5);
}

.sun-badge__tag {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--neutral-500);
  padding-left: 4px;
  border-left: 1px solid var(--outline);
}

.chart-intro {
  font-size: 14px;
  line-height: 1.5;
  color: var(--neutral-700);
  margin-bottom: 12px;
}

.chart-intro strong {
  color: var(--blue-5);
  font-weight: 600;
}

.snapshot {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.layer-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-lg);
  padding: 12px 14px;
  box-shadow: var(--shadow-sm);
}

.layer-card__emoji {
  flex-shrink: 0;
  font-size: 18px;
  line-height: 1;
  margin-top: 2px;
}

.layer-card__prefix {
  font-size: 12px;
  font-weight: 600;
  color: var(--blue-5);
  line-height: 1.35;
  margin-bottom: 3px;
}

.layer-card__body {
  font-size: 13px;
  line-height: 1.45;
  color: var(--neutral-700);
}

.energy-card {
  background: var(--neutral-0);
  border: 1px solid var(--outline);
  border-radius: var(--radius-xl);
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
}

.energy-badge {
  display: inline-block;
  background: var(--blue-1);
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  color: var(--blue-5);
  margin-bottom: 10px;
}

.energy-reading {
  font-size: 16px;
  line-height: 1.6;
  color: var(--neutral-700);
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  margin-bottom: 12px;
}

.card-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.mini-card {
  flex: 0 0 160px;
  padding: 16px;
  border-radius: var(--radius-lg);
  background: var(--neutral-0);
  box-shadow: var(--shadow-sm);
}

.mini-card--green { border-left: 3px solid var(--success); }
.mini-card--orange { border-left: 3px solid var(--orange-6); }

.mini-emoji { font-size: 20px; display: block; margin-bottom: 8px; }
.mini-card strong { display: block; font-size: 14px; margin-bottom: 4px; }
.mini-card p { font-size: 12px; color: var(--neutral-500); line-height: 1.4; }

.stories {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}

.story-card {
  flex: 0 0 120px;
  height: 160px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: flex-end;
  padding: 12px;
  color: var(--neutral-0);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
}

.connect-teaser {
  background: var(--neutral-0);
  border: 1.5px solid var(--outline);
  border-radius: var(--radius-xl);
  padding: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: box-shadow 0.15s;
}

.connect-teaser:hover {
  box-shadow: var(--shadow-md);
}

.new-today-teaser {
  background: linear-gradient(135deg, #0d1d54, #3e4ea2);
  border-radius: var(--radius-xl);
  padding: 20px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: box-shadow 0.15s;
  color: white;
}
.new-today-teaser:hover { box-shadow: var(--shadow-lg); }
.new-today-teaser .teaser-emoji { font-size: 28px; }
.new-today-teaser strong { color: white; display: block; font-size: 15px; margin-bottom: 4px; }
.new-today-teaser p { color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 600; }

.teaser-content {
  display: flex;
  gap: 14px;
  align-items: center;
}

.teaser-emoji { font-size: 28px; }

.teaser-content strong {
  display: block;
  font-size: 15px;
  margin-bottom: 4px;
}

.teaser-content p {
  font-size: 13px;
  color: var(--blue-5);
  font-weight: 600;
}
</style>
