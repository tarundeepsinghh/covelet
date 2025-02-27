import { AppNames, Environments } from '@common/constants';
import { RequestLoggerMiddlewareFactory } from '@common/request-logger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GatewayModule } from './gateway.module';
import { ResponseLogger } from '@common/interceptors/response-interceptor';

const AppName = AppNames.Gateway;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    GatewayModule,
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
  const urlString = `${hostname}:${port}`;

  // Setup Validation pipe
  app.useGlobalPipes(new ValidationPipe());
  // Setup OAS middleware
  const oasConf = new DocumentBuilder()
    .setTitle('Cover Letter Service')
    .setDescription('The api for generating cover letters')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://${urlString}`)
    .addTag('Cover Letter CRUD')
    .build();
  const document = SwaggerModule.createDocument(app, oasConf);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, hostname);
  console.log(`${AppName} service listening on ${urlString}`);
}
bootstrap();
