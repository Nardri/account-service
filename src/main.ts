import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as morgan from 'morgan';

import AppModule from './app/app.module';
// import { customRabbitMqClientOptions } from './config/rabbitMq-client.options';
// import RabbitMQServer from './rabbitMQ/rabbitMQ.server';

async function bootstrap(): Promise<void> {
  /**
   * This contains a hybrid application (HTTP + AMQP)
   * You can switch to a microservice with NestFactory.createMicroservice() as follows:
   *
   * const app = await NestFactory.createMicroservice(AppModule, rabbitMqClientOptions);
   * await app.listenAsync();
   *
   */

  const app = await NestFactory.create(AppModule);
  // app.connectMicroservice({
  //   strategy: new RabbitMQServer(customRabbitMqClientOptions),
  // });

  const loggerFormat = ':remote-addr - :remote-user [:date[web]] ":method '
    + ':url HTTP/:http-version" :status :res[content-length] '
    + '":referrer" ":user-agent';
  app.use(morgan(loggerFormat));

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Accounts API')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
  // await app.startAllMicroservicesAsync();
}

bootstrap().then();
