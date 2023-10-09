import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { EventModule } from '../event/event.module';
import { ParticipantService } from './participant.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [EventModule, UserModule],
  controllers: [ParticipantController],
  providers: [ParticipantService],
})
export class ParticipantModule {}
