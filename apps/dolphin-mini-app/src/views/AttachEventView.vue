<script setup lang="ts">
import { useRoute } from 'vue-router'
import EventForm from '@/components/EventForm.vue'

const router = useRoute()

const { id } = router.params as { id: string }
</script>

<template>
  <EventForm :eventId="id" />
</template>

<style scoped></style>
