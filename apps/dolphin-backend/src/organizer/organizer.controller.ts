import { Request } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { EventService } from '../event/event.service';
import { EventDTO } from './dto';

@Controller('api/organizer')
export class OrganizerController {
  constructor(private readonly eventService: EventService) {}

  @Get('events')
  async getEvents(@Req() req: Request) {
    const events = await this.eventService.findManyByOrganizerId(req.userId);
    return {
      events,
    };
  }

  @Post('create-event')
  async createEvent(@Req() req: Request, @Body() body: EventDTO) {
    const eventId = await this.eventService.createEvent(req.userId, body);
    return {
      eventId,
    };
  }

  @Post('update-event/:eventId')
  async updateEvent(
    @Req() req: Request,
    @Body() body: EventDTO,
    @Param('eventId') eventId: string,
  ) {
    try {
      await this.eventService.updateEvent(req.userId, eventId, body);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Get('attach-event/:eventId')
  attachEventToChat(@Req() req: Request, @Param('eventId') eventId: string) {
    const queryId = req.tgQueryId;
    const lang = req.userLang ?? 'en';

    if (queryId == null) {
      throw new BadRequestException();
    }

    this.eventService.attachEventToChat(queryId, eventId, lang);
  }
}
