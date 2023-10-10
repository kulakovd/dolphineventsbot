import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { ParticipantService } from './participant.service';

@Controller('api/participant')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Get('event/:eventId')
  async getEvent(@Req() req: Request, @Param('eventId') eventId: string) {
    const userId = req.userId;
    const event = await this.participantService.getEvent(userId, eventId);

    return {
      event,
    };
  }

  @Get('participate/:eventId')
  async addEvent(@Req() req: Request, @Param('eventId') eventId: string) {
    const userId = req.userId;
    const lang = req.userLang;

    const { participantsLimitExceeded } =
      await this.participantService.addEvent(userId, eventId, lang);

    return {
      participantsLimitExceeded,
    };
  }

  @Get('cancel-participation/:eventId')
  removeEvent(@Req() req: Request, @Param('eventId') eventId: string) {
    const userId = req.userId;

    return this.participantService.removeEvent(userId, eventId);
  }
}
