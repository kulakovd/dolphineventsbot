<script setup lang="ts">
import { useAttachStore } from '@/stores/organizer'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { datesString } from '@/datesString'

const organizerStore = useAttachStore()
const router = useRouter()

onMounted(() => {
  organizerStore.fetchEvents()
})

const { events } = storeToRefs(organizerStore)
const eventsView = computed(() =>
  events.value.map((event) => ({
    ...event,
    dates: datesString(event.startDate, event.endDate)
  }))
)
</script>

<template>
  <div class="attach">
    <RouterLink to="/attach/new" class="new-event"> New event </RouterLink>
    <ul class="events">
      <li v-for="event in eventsView" :key="event.id">
        <div role="button" class="event" @click="router.push(`/attach/${event.id}`)">
          <div class="event-title">{{ event.title }}</div>
          <div>{{ event.dates }}</div>
        </div>
      </li>
    </ul>
    <div class="no-events" v-if="eventsView.length === 0">No events yet</div>
  </div>
</template>

<style scoped>
.attach {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.new-event {
  cursor: pointer;
  display: block;
  width: 100%;
  text-decoration: none;
  background: var(--color-button);
  color: var(--color-button-text);
  border: none;
  font-size: 0.8em;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}

.new-event:active {
  transform: scale(0.98);
}

.events {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 8px;
  background: var(--color-background-secondary);
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
}

.event:active {
  transform: scale(0.98);
}

.event-title {
  font-weight: bold;
}

.no-events {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
