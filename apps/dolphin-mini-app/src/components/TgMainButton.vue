<script setup lang="ts">
/**
 * This component is used to display the Telegram MainButton.
 *
 * @file TgMainButton.vue
 * @description Telegram MainButton component
 */

import { injectTelegram } from '@/stores/utils/injectTelegram'
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  text: string
  showLoading?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const telegram = injectTelegram()

function handleMainButtonClick() {
  emit('click')
}

onMounted(() => {
  telegram.MainButton.setText(props.text)
  if (props.showLoading) {
    telegram.MainButton.showProgress()
  } else {
    telegram.MainButton.hideProgress()
  }
  telegram.MainButton.onClick(handleMainButtonClick)
  telegram.MainButton.show()
})

// sync showLoading prop with Telegram MainButton
watch(
  () => props.showLoading,
  (showLoading) => {
    if (showLoading) {
      telegram.MainButton.showProgress()
    } else {
      telegram.MainButton.hideProgress()
    }
  }
)

// sync text prop with Telegram MainButton
watch(
  () => props.text,
  (text) => {
    telegram.MainButton.setText(text)
  }
)

onUnmounted(() => {
  telegram.MainButton.offClick(handleMainButtonClick)
  telegram.MainButton.hide()
})
</script>

<template></template>
