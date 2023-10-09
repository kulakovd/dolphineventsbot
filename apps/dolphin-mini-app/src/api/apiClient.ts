import type { ApiClient, ParticipateResult } from '@/domain/apiClient'
import type { Event, EventAnnouncement } from '@/domain/model/event'

type EventResponse = {
  events: Array<
    Omit<Event, 'startDate' | 'endDate'> & {
      startDate: string
      endDate: string
    }
  >
}

type EventAnnouncementResponse = {
  event: Omit<EventAnnouncement, 'startDate' | 'endDate'> & {
    startDate: string
    endDate: string
  }
}

export const createApi = () => {
  /**
   * JWT is supposed to be stored in sessionStorage with key 'token'
   *
   * @throws {Error} if token is not set
   */
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
      async createEvent(event: Omit<Event, 'id' | 'organizerId'>): Promise<Event['id']> {
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

        const json = (await response.json()) as { eventId: string }

        return json.eventId
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
      },
      async attachEvent(eventId: string): Promise<void> {
        const response = await fetch(`/api/organizer/attach-event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to attach event')
        }
      }
    },
    participant: {
      async getEvent(eventId: string) {
        const response = await fetch(`/api/participant/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch event')
        }

        const json = (await response.json()) as EventAnnouncementResponse

        return {
          ...json.event,
          startDate: new Date(json.event.startDate),
          endDate: new Date(json.event.endDate)
        }
      },
      async participate(eventId: string) {
        const response = await fetch(`/api/participant/participate/${eventId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to participate')
        }

        return (await response.json()) as ParticipateResult
      },
      async cancelParticipation(eventId: string) {
        const response = await fetch(`/api/participant/cancel-participation/${eventId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to cancel participation')
        }
      }
    }
  }

  return {
    client
  }
}
