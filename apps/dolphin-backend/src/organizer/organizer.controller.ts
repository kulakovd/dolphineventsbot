import { Request } from 'express';
import {
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
    this.eventService.createEvent(req.userId, body);
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
}
