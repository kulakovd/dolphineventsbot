import { Module } from '@nestjs/common';
import { OrganizerController } from './organizer.controller';
import { EventModule } from '../event/event.module';

/**
 * The OrganizerModule responsible for interaction with the user being an organizer.
 */
@Module({
  imports: [EventModule],
  controllers: [OrganizerController],
})
export class OrganizerModule {}
