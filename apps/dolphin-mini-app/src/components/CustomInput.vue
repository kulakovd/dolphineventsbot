<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string | number | null
  type?: 'text' | 'number' | 'date' | 'time'
  invalid?: boolean
  textarea?: boolean
  rows?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [string | number | null]
}>()

const value = computed({
  get() {
    return props.modelValue ?? undefined
  },
  set(value) {
    emit('update:modelValue', value ?? null)
  }
})
</script>

<template>
  <input v-if="!textarea" v-model.trim="value" :class="{ invalid }" class="input" :type="type" />
  <textarea
    v-else-if="textarea"
    v-model.trim="value"
    :rows="rows"
    :class="{ invalid }"
    class="input"
  />
</template>

<style scoped>
.input {
  display: block;
  width: 100%;
  resize: none;
  padding: 12px;
  border: 1px solid var(--color-background-secondary);
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
  background: var(--color-background);
  color: var(--color-text);
}

.input.invalid {
  border-color: red;
}

/* Chrome, Safari, Edge, Opera */
.input::-webkit-outer-spin-button,
.input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

/* Firefox */
.input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
