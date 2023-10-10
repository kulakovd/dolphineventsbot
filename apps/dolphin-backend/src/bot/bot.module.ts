import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ConfigModule } from '@nestjs/config';
import { EventModule } from '../event/event.module';
import { UserModule } from '../user/user.module';

/**
 * The BotModule is the only point of interaction with the Telegram Bot API.
 */
@Module({
  imports: [ConfigModule, EventModule, UserModule],
  providers: [BotService],
})
export class BotModule {}
