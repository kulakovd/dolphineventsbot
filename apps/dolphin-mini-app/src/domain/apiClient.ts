import type { Event } from '@/domain/model/event'

export interface ApiClient {
  organizer: {
    // Fetches the events that the user is organizing.
    getEvents(): Promise<{ events: Event[] }>
    createEvent(event: Omit<Event, 'id' | 'organizerId'>): Promise<void>
    updateEvent(event: Omit<Event, 'id' | 'organizerId'>, eventId: string): Promise<void>
  }
}
