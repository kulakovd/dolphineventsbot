import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { Event } from '@/domain/model/event'
import { injectApi } from '@/stores/utils/injectApi'

export const useAttachStore = defineStore('attach', () => {
  const api = injectApi()

  const events = reactive<Event[]>([])

  async function fetchEvents() {
    const response = await api.organizer.getEvents()
    events.splice(0, events.length, ...response.events)
  }

  fetchEvents();

  return {
    events,
    fetchEvents,
  }
})
