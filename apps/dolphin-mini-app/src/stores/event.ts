import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { EventAnnouncement } from '@/domain/model/event'
import { injectApi } from '@/stores/utils/injectApi'

export const useEventStore = defineStore('event', () => {
  const api = injectApi()
  const event = ref<EventAnnouncement | null>(null)
  const isLoading = ref(false)

  async function fetchEvent(eventId: string) {
    event.value = await api.participant.getEvent(eventId)
  }

  // Show organizer if only their first or last name is present
  const showOrganizer = computed(() => {
    return event.value?.organizer?.firstName != null || event.value?.organizer?.lastName != null
  })

  const organizerName = computed(() => {
    return `${event.value?.organizer?.firstName} ${event.value?.organizer?.lastName}`
  })

  async function participate() {
    if (event.value == null) {
      return
    }
    isLoading.value = true
    const result = await api.participant.participate(event.value.id)
    if (result.participantsLimitExceeded) {
      event.value.participantsLimitExceeded = true
    } else {
      event.value.joined = true
    }
    isLoading.value = false
  }

  async function cancelParticipation() {
    isLoading.value = true
    if (event.value == null) {
      return
    }
    await api.participant.cancelParticipation(event.value.id)
    event.value.joined = false
    isLoading.value = false
  }

  return {
    event,
    fetchEvent,
    showOrganizer,
    organizerName,
    participate,
    cancelParticipation,
    isLoading
  }
})
