import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { CrudModule } from './crud/crud.module';
import { GeneratorModule } from './generator/generator.module';
import { IdpModule } from './idp/idp.module';
import { StatusController } from './status.controller';
import { AuthMiddleware } from './middleware/authentication.middleware';
import { GeneratorController } from './generator/generator.controller';
import { CrudController } from './crud/crud.controller';
import { HealthCheckModule } from 'libs/health-check/src';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.generator.env',
      load: [config],
      isGlobal: true,
    }),
    {
      ...HttpModule.register({ timeout: 5000 }),
      global: true,
    },
    GeneratorModule,
    CrudModule,
    IdpModule,
    HealthCheckModule,
  ],
  controllers: [StatusController],
  providers: [],
})
export class GatewayModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(GeneratorController, CrudController, '/auth/logout');
  }
}
