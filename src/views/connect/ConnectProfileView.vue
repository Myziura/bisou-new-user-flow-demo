<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { flowState, getProfileStrength } from '../../composables/useFlowState'
import PhoneFrame from '../../components/PhoneFrame.vue'
import ScreenLayout from '../../components/ScreenLayout.vue'
import BisouButton from '../../components/BisouButton.vue'
import ProfileStrengthMeter from '../../components/ProfileStrengthMeter.vue'

const router = useRouter()
const strength = computed(() => getProfileStrength())
const editing = ref(null)
const inputRefs = ref({})

const fieldInputs = ref({
  connectBio: flowState.connectBio,
  connectVibePrompt: flowState.connectVibePrompt,
  connectPronouns: flowState.connectPronouns,
  connectGender: flowState.connectGender,
  connectDatingType: flowState.connectDatingType,
  connectKidsPreference: flowState.connectKidsPreference,
})

const choiceOptions = {
  connectDatingType: ['Casual', 'Long-term', 'ENM', 'Marriage-minded'],
  connectKidsPreference: ['Want kids', "Don't want kids", 'Have kids', 'Open to either'],
}

const textFields = new Set(['connectBio', 'connectVibePrompt', 'connectPronouns'])

function isChoiceField(key) {
  return key in choiceOptions
}

async function openField(key) {
  fieldInputs.value[key] = flowState[key]
  editing.value = key
  if (textFields.has(key)) {
    await nextTick()
    inputRefs.value[key]?.focus()
  }
}

function cancelEdit(key) {
  fieldInputs.value[key] = flowState[key]
  editing.value = null
}

function saveField(key) {
  flowState[key] = fieldInputs.value[key]?.trim?.() ?? fieldInputs.value[key]
  editing.value = null
}

function quickFill(key, value) {
  fieldInputs.value[key] = value
  flowState[key] = value
  editing.value = null
}

function startSwiping() {
  flowState.connectSetupComplete = true
  router.push('/connect/swipe')
}

function skipToSwipe() {
  flowState.connectSetupComplete = true
  router.push('/connect/swipe')
}
</script>

<template>
  <PhoneFrame>
    <ScreenLayout
      title="Boost your profile"
      subtitle="Optional fields increase your ranking. The meter does the persuading — nothing is forced."
      scroll
    >
      <ProfileStrengthMeter :percent="strength.percent" />

      <div class="field-list">
        <div
          v-for="field in strength.optionalFields"
          :key="field.key"
          class="field-row"
          :class="{
            'field-row--filled': field.filled && editing !== field.key,
            'field-row--editing': editing === field.key,
          }"
        >
          <button
            v-if="editing !== field.key"
            type="button"
            class="field-row__trigger"
            @click="openField(field.key)"
          >
            <div class="field-info">
              <span class="field-name">{{ field.label }}</span>
              <span class="field-hint">{{ field.hint }}</span>
              <span v-if="field.filled" class="field-value">{{ field.value }}</span>
            </div>
            <span class="field-action">{{ field.filled ? 'Edit' : `+${field.weight}%` }}</span>
          </button>

          <div v-else class="field-row__editor">
            <div class="field-row__editor-head">
              <div class="field-info">
                <span class="field-name">{{ field.label }}</span>
                <span class="field-hint">{{ field.hint }}</span>
              </div>
              <span class="field-action">{{ field.filled ? 'Edit' : `+${field.weight}%` }}</span>
            </div>

            <div v-if="isChoiceField(field.key)" class="quick-options">
              <button
                v-for="opt in choiceOptions[field.key]"
                :key="opt"
                type="button"
                class="quick-opt"
                :class="{ 'quick-opt--active': fieldInputs[field.key] === opt }"
                @click="quickFill(field.key, opt)"
              >
                {{ opt }}
              </button>
            </div>

            <template v-else>
              <textarea
                :ref="(el) => { if (el) inputRefs[field.key] = el }"
                v-model="fieldInputs[field.key]"
                rows="3"
                class="field-input"
                :placeholder="field.hint"
              />
              <div class="editor-actions">
                <BisouButton variant="ghost" @click="cancelEdit(field.key)">Cancel</BisouButton>
                <BisouButton @click="saveField(field.key)">Save</BisouButton>
              </div>
            </template>
          </div>
        </div>
      </div>

      <template #footer>
        <BisouButton @click="startSwiping">Start swiping</BisouButton>
        <BisouButton variant="ghost" @click="skipToSwipe">Skip for now</BisouButton>
      </template>
    </ScreenLayout>
  </PhoneFrame>
</template>

<style scoped>
.field-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-row {
  background: var(--neutral-0);
  border: 1.5px solid var(--outline);
  border-radius: var(--radius-lg);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field-row--filled {
  border-color: var(--success);
  background: rgba(18, 209, 142, 0.04);
}

.field-row--editing {
  border-color: var(--blue-5);
  box-shadow: 0 0 0 3px rgba(62, 78, 162, 0.12);
  background: var(--neutral-0);
}

.field-row__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  text-align: left;
}

.field-row__editor {
  padding: 14px 16px;
}

.field-row__editor-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.field-info {
  flex: 1;
  min-width: 0;
}

.field-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
}

.field-hint {
  display: block;
  font-size: 12px;
  color: var(--neutral-500);
  line-height: 1.3;
}

.field-value {
  display: block;
  font-size: 13px;
  color: var(--blue-5);
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.field-action {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--orange-6);
}

.field-row--filled .field-action {
  color: var(--blue-5);
}

.field-input {
  width: 100%;
  padding: 12px;
  border: 1.5px solid var(--outline);
  border-radius: var(--radius);
  font-size: 15px;
  line-height: 1.45;
  resize: none;
  background: var(--neutral-0);
  color: var(--neutral-900);
}

.field-input:focus {
  outline: none;
  border-color: var(--blue-5);
  box-shadow: 0 0 0 3px rgba(62, 78, 162, 0.12);
}

.editor-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.quick-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-opt {
  padding: 10px 16px;
  background: var(--neutral-0);
  border: 1.5px solid var(--outline);
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.quick-opt:hover {
  border-color: var(--blue-5);
  color: var(--blue-5);
}

.quick-opt--active {
  background: var(--blue-5);
  border-color: var(--blue-5);
  color: var(--neutral-0);
}
</style>
