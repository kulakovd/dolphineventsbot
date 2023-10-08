<script setup lang="ts">
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
  }
  telegram.MainButton.onClick(handleMainButtonClick)
  telegram.MainButton.show()
})

watch(
  () => props.showLoading,
  (showProgressBar) => {
    if (showProgressBar) {
      telegram.MainButton.showProgress()
    } else {
      telegram.MainButton.hideProgress()
    }
  }
)

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
