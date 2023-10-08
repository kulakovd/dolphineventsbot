import type { ApiClient } from '@/domain/apiClient'
import type { Event } from '@/domain/model/event'

type EventResponse = {
  events: Array<
    Omit<Event, 'startDate' | 'endDate'> & {
      startDate: string
      endDate: string
    }
  >
}

export const createApi = () => {
  function getToken(): string | null {
    const token = sessionStorage.getItem('token')
    if (token == null) {
      throw new Error('Token is not set')
    }
    return token
  }

  const client: ApiClient = {
    organizer: {
      async getEvents() {
        const response = await fetch('/api/organizer/events', {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }

        const json = (await response.json()) as EventResponse

        return {
          events: json.events.map((event) => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate)
          }))
        }
      },
      async createEvent(event: Omit<Event, 'id' | 'organizerId'>): Promise<void> {
        const response = await fetch('/api/organizer/create-event', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        })

        if (!response.ok) {
          throw new Error('Failed to create event')
        }
      },
      async updateEvent(event: Omit<Event, 'id' | 'organizerId'>, eventId: string): Promise<void> {
        const response = await fetch(`/api/organizer/update-event/${eventId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        })

        if (!response.ok) {
          throw new Error('Failed to update event')
        }
      }
    }
  }

  return {
    client
  }
}
