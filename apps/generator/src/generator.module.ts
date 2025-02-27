import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from './cache.service';
import config from './config';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './generator.service';
import { HealthCheckModule } from 'libs/health-check/src';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.generator.env',
      load: [config],
    }),
    HttpModule,
    HealthCheckModule,
  ],
  controllers: [GeneratorController],
  providers: [GeneratorService, CacheService],
})
export class GeneratorModule {}
