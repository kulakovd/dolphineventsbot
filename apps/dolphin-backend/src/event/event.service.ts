import { Injectable } from '@nestjs/common';
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

  findManyByOrganizerId(organizerId: string): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .where('event.organizerId = :organizerId', { organizerId })
      .andWhere('event.endDate > :now', { now: new Date() })
      .orderBy('event.startDate', 'ASC')
      .getMany();
  }

  findManyByParticipantId(participantId: string): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .leftJoin('event.participants', 'participant')
      .where('participant.id = :participantId', { participantId })
      .andWhere('event.endDate > :now', { now: new Date() })
      .orderBy('event.startDate', 'ASC')
      .getMany();
  }

  countParticipants(eventId: string): Promise<number> {
    return this.eventRepository
      .createQueryBuilder('event')
      .leftJoin('event.participants', 'participant')
      .where('event.id = :eventId', { eventId })
      .getCount();
  }

  async addParticipant(eventId: string, participantId: string): Promise<void> {
    const event = await this.findById(eventId);

    if (event == null) {
      throw new Error('Cannot add participant to event');
    }

    const count = await this.countParticipants(eventId);

    if (event.maxParticipants != null && count >= event.maxParticipants) {
      throw new Error('Cannot add participant to event');
    }

    return this.eventRepository
      .createQueryBuilder('event')
      .relation('participants')
      .of(eventId)
      .add(participantId);
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
}
