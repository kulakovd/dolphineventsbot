<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Event } from '@/domain/model/event'
import { computed } from 'vue';
import { datesString } from '@/datesString';

const router = useRouter()
const props = defineProps<{
  showCreateButton: boolean
  link: string
  events: Event[]
  noEvents: string
}>()

const eventsView = computed(() =>
    props.events.map((event) => ({
      ...event,
      dates: datesString(event.startDate, event.endDate)
    }))
)

const newEventLink = computed(() => `/${props.link}/new`)
const navigateToEvent = (id: string) => router.push(`/${props.link}/${id}`)
</script>

<template>
  <div class="view">
    <RouterLink :to="newEventLink" class="new-event"> New event </RouterLink>
    <ul class="events">
      <li v-for="event in eventsView" :key="event.id">
        <div role="button" class="event" @click="navigateToEvent(event.id)">
          <div class="event-title">{{ event.title }}</div>
          <div>{{ event.dates }}</div>
        </div>
      </li>
    </ul>
    <div class="no-events" v-if="eventsView.length === 0">{{ noEvents }}</div>
  </div>
</template>

<style scoped>
.view {
  height: 100%;
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
  padding: 0 0 16px;
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
