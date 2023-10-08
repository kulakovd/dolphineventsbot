import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { Event } from '@/domain/model/event'
import { injectApi } from '@/stores/utils/injectApi'
import { injectTelegram } from '@/stores/utils/injectTelegram'
import { useRouter } from 'vue-router'

export const useAttachStore = defineStore('attach', () => {
  const api = injectApi()

  const events = reactive<Event[]>([])

  async function fetchEvents() {
    const response = await api.organizer.getEvents()
    events.splice(0, events.length, ...response.events)
  }

  return {
    events,
    fetchEvents
  }
})
