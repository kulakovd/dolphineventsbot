<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()

onMounted(() => {
  authStore.authWithTelegram()
})

const { isAuthorized } = storeToRefs(authStore)
</script>

<template>
  <div class="app">
    <RouterView v-if="isAuthorized" />
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
}
</style>
