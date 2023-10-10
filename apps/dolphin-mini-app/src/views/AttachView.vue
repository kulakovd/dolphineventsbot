<script setup lang="ts">
import { useAttachStore } from '@/stores/organizer'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import EventList from '@/components/EventList.vue';

const organizerStore = useAttachStore()

onMounted(() => {
  organizerStore.fetchEvents()
})

const { events } = storeToRefs(organizerStore)
</script>

<template>
  <EventList
    :events="events"
    showCreateButton
    link="attach"
    noEvents="No events yet"
  />
</template>
