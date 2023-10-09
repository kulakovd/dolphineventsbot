import { Module } from '@nestjs/common';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { ormConfig } from './ormconfig';
import { EventModule } from './event/event.module';
import { OrganizerModule } from './organizer/organizer.module';
import { BotModule } from './bot/bot.module';
import { ParticipantModule } from './participant/participant.module';

@Module({
  imports: [
    // In production, the frontend is served by the backend
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'public'),
    }),
    // ConfigModule loads the configuration from the .env file
    ConfigModule.forRoot({
      load: [configuration],
    }),
    // TypeOrmModule loads the database configuration from the ormconfig.ts file
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...ormConfig,
        entities: [],
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    EventModule,
    OrganizerModule,
    BotModule,
    ParticipantModule,
  ],
})
export class AppModule {}
