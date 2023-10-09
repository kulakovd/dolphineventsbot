import { Injectable, NotFoundException } from '@nestjs/common';
import { EventService } from '../event/event.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ParticipantService {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) {}

  async getEvent(userId: string, eventId: string) {
    const event = await this.eventService.findById(eventId);

    if (event == null) {
      throw new NotFoundException();
    }

    const organizer = (await this.userService.findById(event.organizerId))!;

    const participantsCount =
      await this.eventService.countParticipants(eventId);

    const participantsLimitExceeded =
      event.maxParticipants != null &&
      participantsCount >= event.maxParticipants;
    const joined = await this.eventService.isParticipant(eventId, userId);

    return {
      ...event,
      organizer: {
        id: organizer.id,
        firstName: organizer.firstName,
        lastName: organizer.lastName,
        telegramUsername: organizer.telegramUsername,
        photoUrl: organizer.photoUrl,
      },
      participantsLimitExceeded,
      joined,
    };
  }

  addEvent(userId: string, eventId: string) {
    return this.eventService.addParticipant(eventId, userId);
  }

  removeEvent(userId: string, eventId: string) {
    return this.eventService.removeParticipant(eventId, userId);
  }
}
