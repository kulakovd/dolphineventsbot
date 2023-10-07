import { Module } from '@nestjs/common';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { ormConfig } from './ormconfig';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'public'),
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...ormConfig,
        entities: [],
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    EventModule,
  ],
})
export class AppModule {}
