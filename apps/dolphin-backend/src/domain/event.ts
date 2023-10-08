export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  link?: string;
  image?: string;
  maxParticipants?: number;
}
