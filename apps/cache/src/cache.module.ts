import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheController } from './cache.controller';
import config from './config';
import { HealthCheckModule } from 'libs/health-check/src';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.cache.env',
      load: [config],
    }),
    HealthCheckModule,
  ],
  controllers: [CacheController],
  providers: [ConfigService],
})
export class CacheModule {}
