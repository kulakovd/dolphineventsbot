<script setup lang="ts">
import EventForm from '@/components/EventForm.vue';

defineProps<{
  eventId?: string
  attach?: boolean
}>()
</script>

<template>
  <EventForm :eventId="eventId" :attach="attach" />
</template>
