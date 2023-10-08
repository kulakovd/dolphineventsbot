import { defineStore } from 'pinia'
import { injectApi } from '@/stores/utils/injectApi'
import { computed, reactive, ref, watch } from 'vue'
import { useAttachStore } from '@/stores/organizer'
import type { Event } from '@/domain/model/event'
import { injectTelegram } from '@/stores/utils/injectTelegram'

const castDate = (date?: Date | string) => {
  if (!date) {
    return null
  }

  const dateInstance = new Date(date)
  const year = dateInstance.getFullYear()
  const month = String(dateInstance.getMonth() + 1).padStart(2, '0')
  const day = String(dateInstance.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const castTime = (date?: Date | string) => {
  if (!date) {
    return null
  }

  const dateInstance = new Date(date)
  const hours = String(dateInstance.getHours()).padStart(2, '0')
  const minutes = String(dateInstance.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

type EventFormField<T> = {
  value: T | null
  invalid?: boolean
  required?: boolean
}

function createField<T>(target: EventFormField<T>) {
  const field = reactive(target)

  watch(
    () => field.value,
    () => {
      field.invalid = false
    }
  )

  return field
}

export const useEventFormStore = defineStore('eventForm', () => {
  const api = injectApi()

  const { events } = useAttachStore()

  const eventId = ref<string | null>(null)
  const isLoading = ref(false)
  const isNewEvent = computed(() => eventId.value == null)

  const title = createField<string>({
    value: '',
    invalid: false,
    required: true
  })

  const description = createField<string>({
    value: ''
  })

  const startDate = createField<string>({
    value: null,
    invalid: false,
    required: true
  })

  const startTime = createField<string>({
    value: null,
    invalid: false,
    required: true
  })

  const endDate = createField<string>({
    value: null,
    invalid: false,
    required: true
  })

  const endTime = createField<string>({
    value: null,
    invalid: false,
    required: true
  })

  const link = createField<string>({
    value: ''
  })

  const location = createField<string>({
    value: ''
  })

  const maxParticipants = createField<number>({
    value: null
  })

  function init(newId: string | undefined) {
    eventId.value = newId ?? null
    isLoading.value = false

    const event = events.find((event) => event.id === newId)

    title.value = event?.title ?? ''
    description.value = event?.description ?? ''
    startDate.value = castDate(event?.startDate)
    startTime.value = castTime(event?.startDate)
    endDate.value = castDate(event?.endDate)
    endTime.value = castTime(event?.endDate)
    link.value = event?.link ?? ''
    location.value = event?.location ?? ''
    maxParticipants.value = event?.maxParticipants ?? null
  }

  const formModel = {
    title,
    description,
    startDate,
    startTime,
    endDate,
    endTime,
    link,
    location,
    maxParticipants
  }

  function validate(): boolean {
    Object.entries(formModel).forEach(([, value]) => {
      if (value.required && (value.value == null || value.value === '')) {
        value.invalid = true
      }
    })

    return Object.values(formModel).every((value) => !value.invalid)
  }

  async function sendData() {
    function castString<T>(value: T): NonNullable<T> | undefined {
      if (value == null || value === '') {
        return undefined
      }

      return value
    }

    const _startDate = new Date(`${startDate.value}T${startTime.value}`)
    const _endDate = new Date(`${endDate.value}T${endTime.value}`)

    const event: Omit<Event, 'id' | 'organizerId'> = {
      title: title.value as string,
      description: castString(description.value),
      startDate: _startDate,
      endDate: _endDate,
      link: castString(link.value),
      location: castString(location.value),
      maxParticipants: castString(maxParticipants.value)
    }

    if (isNewEvent.value) {
      const newEventId = await api.organizer.createEvent(event)
      await api.organizer.attachEvent(newEventId)
    } else if (eventId.value != null) {
      await api.organizer.updateEvent(event, eventId.value)
      await api.organizer.attachEvent(eventId.value)
    } else {
      throw new Error('Cannot submit event form')
    }
  }

  async function submit() {
    isLoading.value = true
    try {
      if (validate()) {
        await sendData()
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    ...formModel,
    isLoading,
    init,
    submit
  }
})
