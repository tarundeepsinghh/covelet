import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config';
import { CoverLetterController } from './crud.controller';
import { CoverLetterService } from './crud.service';
import { CoverLetter, CoverLetterSchema } from './schema/coverLetter.schemas';
import { HealthCheckModule } from 'libs/health-check/src';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.crud.env',
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('dbConnString'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: CoverLetter.name, schema: CoverLetterSchema },
    ]),
    HealthCheckModule,
  ],
  controllers: [CoverLetterController],
  providers: [CoverLetterService],
})
export class CrudModule {}
