export interface Event {
  id: string
  organizerId: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  location?: string
  link?: string
  image?: string
  maxParticipants?: number
}

export type EventAnnouncement = Event & {
  organizer: {
    id: string
    firstName?: string
    lastName?: string
    telegramUsername?: string
    photoUrl?: string
  }
  participantsLimitExceeded: boolean
  joined: boolean
}
