import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

/**
 * The BotModule is the only point of interaction with the Telegram Bot API.
 */
@Module({
  imports: [ConfigModule, HttpModule],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
