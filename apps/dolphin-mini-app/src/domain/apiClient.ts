import type { Event, EventAnnouncement } from '@/domain/model/event'

export type ParticipateResult = {
  participantsLimitExceeded: false
}

export interface ApiClient {
  organizer: {
    // Fetches the events that the user is organizing.
    getEvents(): Promise<{ events: Event[] }>
    createEvent(event: Omit<Event, 'id' | 'organizerId'>): Promise<Event['id']>
    updateEvent(event: Omit<Event, 'id' | 'organizerId'>, eventId: string): Promise<void>
    attachEvent(eventId: string): Promise<void>
  }
  participant: {
    getEvent(eventId: string): Promise<EventAnnouncement>
    participate(eventId: string): Promise<ParticipateResult>
    cancelParticipation(eventId: string): Promise<void>
  }
}
