import * as amqp from 'amqplib';
import { Server, CustomTransportStrategy } from '@nestjs/microservices';
import { Observable, Subscription } from 'rxjs';
import {
  DISCONNECTED_RMQ_MESSAGE,
  NO_MESSAGE_HANDLER,
} from '@nestjs/microservices/constants';

import { ICustomRmqOptions } from '../shared/base/base.interface';

class RabbitMQServer extends Server implements CustomTransportStrategy {
  private connection: amqp.Connection = null;

  private channel: amqp.Channel = null;

  private queue: amqp.Queue = null;

  private message: any;

  constructor(private readonly options: ICustomRmqOptions) {
    super();
    this.logger.setContext('RabbitMQ');
  }

  private async init(): Promise<any> {
    try {
      this.connection = await amqp.connect(this.options.host);
      this.connection.on('error', err => {
        if (err.message !== 'Connection closing') {
          this.logger.error(err.message);
        }
      });

      this.connection.on('close', () => {
        this.logger.error(DISCONNECTED_RMQ_MESSAGE);
        return setTimeout(() => this.init(), 1000);
      });

      this.logger.log('Initialized');

      this.channel = await this.connection.createConfirmChannel();
      this.logger.log('Channel Created');

      return this.setupExchange(this.channel);
    } catch (err) {
      this.logger.error(err.message);
      return setTimeout(() => this.init(), 5000);
    }
  }

  private async setupExchange(channel: amqp.Channel): Promise<void> {
    await channel.assertExchange(
      this.options.exchange,
      this.options.exchangeType,
      this.options.exchangeOptions,
    );

    this.queue = await channel.assertQueue(
      this.options.queue,
      this.options.queueOptions,
    );

    this.options.keys.map(async rKey => {
      await channel.bindQueue(this.queue.queue, this.options.exchange, rKey);
    });

    // bind the class instance "this" to the handleMessage method
    await channel.consume(this.queue.queue, this.handleMessage.bind(this), {
      noAck: this.options.noAck,
    });
  }

  private async handleMessage(message: any): Promise<Subscription | void> {
    this.message = message;
    const { content, properties } = message;
    const messageObj = JSON.parse(content.toString());
    const pattern = JSON.stringify(messageObj.pattern);
    const handler = this.getHandlerByPattern(pattern);
    if (!handler) {
      const status = 'error';
      return this.sendMessage(
        { status, err: NO_MESSAGE_HANDLER },
        properties.replyTo,
        properties.correlationId,
      );
    }

    const publish = <T>(data: T): void => this.sendMessage(data, properties.replyTo, properties.correlationId);

    const response$ = this.transformToObservable(
      await handler(messageObj.data, this),
    ) as Observable<any>;
    return response$ && this.send(response$, publish);
  }

  private sendMessage<T = any>(
    message: T,
    replyTo: any,
    correlationId: string,
  ): void {
    const buffer = Buffer.from(JSON.stringify(message));
    this.channel.sendToQueue(replyTo, buffer, { correlationId });
  }

  async listen(callback: () => void): Promise<any> {
    await this.init();
    callback();
  }

  close(): void {
    this.connection && this.connection.close();
    this.channel && this.channel.close();
  }

  getMessage(): any {
    return this.message;
  }

  getChannelRef(): any {
    return this.channel;
  }
}

export default RabbitMQServer;
