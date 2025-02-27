import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppNames, Environments } from 'common/constants';
import { IdpModule } from './idp.module';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { RequestLoggerMiddlewareFactory } from '@common/request-logger';
import { ResponseLogger } from '@common/interceptors/response-interceptor';

const AppName = AppNames.Idp;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    IdpModule,
    new FastifyAdapter(),
    {
      logger: process.env.NODE_ENV === Environments[1] ? false : ['verbose'],
    },
  );
  app.use(RequestLoggerMiddlewareFactory(AppName));
  app.useGlobalInterceptors(new ResponseLogger(AppName));
  const config = app.get(ConfigService);
  const hostname = config.get('host');
  const port = config.get('port');
  await app.listen(port, hostname);
  console.log(`${AppName} service listening on ${hostname}:${port}`);
}
bootstrap();
