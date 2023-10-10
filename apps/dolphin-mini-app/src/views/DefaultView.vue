<script setup lang="ts">
import { useAttachStore } from '@/stores/organizer'
import { storeToRefs } from 'pinia'
import EventList from '@/components/EventList.vue';
import { onMounted } from 'vue';

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
    link="edit"
    noEvents="You haven't created any events yet"
  />
</template>
