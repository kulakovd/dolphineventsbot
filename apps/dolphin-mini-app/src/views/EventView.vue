<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const { id } = route.params as { id: string }
</script>

<template>
  <div>
    {{ id }}
  </div>
</template>

<style scoped></style>
