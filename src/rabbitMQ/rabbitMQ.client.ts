import * as amqp from 'amqplib';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { Logger } from '@nestjs/common/services/logger.service';

import { ICustomRmqOptions } from '../shared/base/base.interface';

class RabbitMQClient extends ClientProxy {
  protected readonly logger: Logger = new Logger(RabbitMQClient.name);

  private connection: amqp.Connection = null;

  private channel: amqp.Channel = null;

  // private message: any;

  constructor(private readonly options: ICustomRmqOptions) {
    super();
    this.logger.setContext('RabbitMQ');
  }

  private async createConnection(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.options.host);
      this.connection.on('error', err => {
        if (err.message !== 'Connection closing') {
          this.logger.error(`[RMQ-CLIENT] - ${err.message}`);
        }
      });
      this.logger.log('[RMQ-CLIENT] - Initialized');
      this.channel = await this.connection.createConfirmChannel();
      this.logger.log('[RMQ-CLIENT] - Channel Created');
    } catch (err) {
      this.logger.error(err.message);
      setTimeout(() => this.createConnection(), 5000);
    }
  }

  // eslint-disable-next-line @typescript-eslint/tslint/config,@typescript-eslint/no-unused-vars
  protected dispatchEvent<T = any>(_packet: ReadPacket<any>): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/tslint/config,id-blacklist
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/tslint/config,@typescript-eslint/no-unused-vars
  protected publish(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _packet: ReadPacket<any>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _callback: (packet: WritePacket) => void,
  ): Function {
    // eslint-disable-next-line @typescript-eslint/tslint/config,id-blacklist
    return undefined;
  }

  async setupExchange(): Promise<void> {
    await this.channel.assertExchange(
      this.options.exchange,
      this.options.exchangeType,
      this.options.exchangeOptions,
    );
    this.logger.log('[RMQ-CLIENT] - Create Exchange');
  }

  async publishEvent(pattern: string, message: any): Promise<void> {
    const offlinePubQueue = [];
    await this.connect();
    await this.setupExchange();
    const body = {
      pattern,
      data: message,
    };
    const content = Buffer.from(JSON.stringify(body));
    try {
      const published = await this.channel.publish(
        this.options.exchange,
        pattern,
        content,
        { persistent: true },
      );
      if (!published) {
        this.logger.error('[RMQ-CLIENT] - Publish error');
        offlinePubQueue.push([this.options.exchange, pattern, content]);
        this.close();
      }
    } catch (e) {
      this.logger.error('[RMQ-CLIENT] - Publish error', e.message);
      offlinePubQueue.push([this.options.exchange, pattern, content]);
    }
  }

  close(): any {
    this.channel && this.channel.close();
    this.connection && this.connection.close();
    this.logger.log('[RMQ-CLIENT] - Connection closed');
  }

  connect(): Promise<any> {
    return this.createConnection();
  }
}

export default RabbitMQClient;
