import { Module } from '@nestjs/common';
import { OrganizerController } from './organizer.controller';
import { EventModule } from '../event/event.module';

@Module({
  imports: [EventModule],
  controllers: [OrganizerController],
})
export class OrganizerModule {}
