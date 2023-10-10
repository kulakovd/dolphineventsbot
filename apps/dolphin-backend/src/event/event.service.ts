import { BadRequestException, Injectable } from '@nestjs/common';
import { Event } from '../domain/event';
import { EventEntity } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventDTO } from '../organizer/dto';

function fillEvent(eventEntity: EventEntity, data: EventDTO) {
  eventEntity.title = data.title;
  eventEntity.description = data.description;
  eventEntity.startDate = new Date(data.startDate);
  eventEntity.endDate = new Date(data.endDate);
  eventEntity.link = data.link;
  eventEntity.location = data.location;
  eventEntity.maxParticipants = data.maxParticipants;
}

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}

  findById(id: string): Promise<Event | null> {
    return this.eventRepository.findOneBy({ id });
  }

  /**
   * Finds all events that are not finished yet and are organized by given user.
   * @param organizerId
   */
  findManyByOrganizerId(organizerId: string): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .where('event.organizerId = :organizerId', { organizerId })
      .andWhere('event.endDate > :now', { now: new Date() })
      .orderBy('event.startDate', 'ASC')
      .addOrderBy('event.id', 'ASC')
      .getMany();
  }

  findManyByOrganizerIdAndSearch(organizerId: string, search: string): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .where('event.organizerId = :organizerId', { organizerId })
      .andWhere('event.endDate > :now', { now: new Date() })
      .andWhere('event.title like :search', { search: `%${search}%` })
      .orderBy('event.startDate', 'ASC')
      .addOrderBy('event.id', 'ASC')
      .getMany();
  }

  /**
   * Finds all events that are not finished yet and are attended by given user.
   * @param participantId
   */
  findManyByParticipantId(participantId: string): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .leftJoin('event.participants', 'participant')
      .where('participant.id = :participantId', { participantId })
      .andWhere('event.endDate > :now', { now: new Date() })
      .orderBy('event.startDate', 'ASC')
      .addOrderBy('event.id', 'ASC')
      .getMany();
  }

  countParticipants(eventId: string): Promise<number> {
    return this.eventRepository
      .createQueryBuilder('event')
      .leftJoin('event.participants', 'participant')
      .where('event.id = :eventId', { eventId })
      .getCount();
  }

  private onParticipantAddedListeners: ((event: Event, userId: string, lang?: string) => void)[] = [];

  onParticipantAdded(listener: (event: Event, userId: string, lang?: string) => void) {
    this.onParticipantAddedListeners.push(listener);
  }

  async addParticipant(
    eventId: string,
    participantId: string,
    lang?: string,
  ): Promise<{ participantsLimitExceeded: boolean }> {
    const event = await this.findById(eventId);

    if (event == null) {
      throw new Error('Cannot add participant to event');
    }

    const count = await this.countParticipants(eventId);

    // If maxParticipants is set and reached, do not add participant
    if (event.maxParticipants != null && count >= event.maxParticipants) {
      return {
        participantsLimitExceeded: true,
      };
    }

    await this.eventRepository
      .createQueryBuilder('event')
      .relation('participants')
      .of(eventId)
      .add(participantId);

    this.onParticipantAddedListeners.forEach((listener) => {
      listener(event, participantId, lang)
    });

    return {
      participantsLimitExceeded: false,
    };
  }

  removeParticipant(eventId: string, participantId: string): Promise<void> {
    return this.eventRepository
      .createQueryBuilder('event')
      .relation('participants')
      .of(eventId)
      .remove(participantId);
  }

  async createEvent(
    organizerId: string,
    event: EventDTO,
  ): Promise<Event['id']> {
    const eventEntity = new EventEntity();
    eventEntity.organizerId = organizerId;

    fillEvent(eventEntity, event);

    await this.eventRepository.insert(eventEntity);

    return eventEntity.id;
  }

  async updateEvent(
    organizerId: string,
    eventId: string,
    event: EventDTO,
  ): Promise<void> {
    const eventEntity = await this.eventRepository.findOneOrFail({
      where: { id: eventId, organizerId },
    });

    fillEvent(eventEntity, event);

    await this.eventRepository.save(eventEntity);
  }

  private onAttachEventToChatListeners: ((queryId: string, event: Event, lang?: string) => void)[] = [];

  onAttachEventToChat(
    listener: (queryId: string, event: Event, lang?: string) => void,
  ) {
    this.onAttachEventToChatListeners.push(listener);
  }

  async attachEventToChat(tgQueryId: string, eventId: string, lang?: string) {
    const event = await this.findById(eventId);

    if (event == null) {
      throw new BadRequestException();
    }

    this.onAttachEventToChatListeners.forEach((listener) => {
      listener(tgQueryId, event, lang);
    });
  }

  async isParticipant(eventId: string, userId: string) {
    const r = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoin('event.participants', 'participant')
      .where('event.id = :eventId', { eventId })
      .andWhere('participant.id = :userId', { userId })
      .getCount();

    return r > 0;
  }
}
