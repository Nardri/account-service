import { RmqOptions, Transport } from '@nestjs/microservices';

import { ICustomRmqOptions } from '../shared/base/base.interface';

const customRabbitMqClientOptions: ICustomRmqOptions = {
  queue: 'account_service',
  exchange: 'nadri',
  exchangeType: 'topic',
  host:
    'amqp://nadri_user:nadri_pass@localhost:5673/nadri_vhost?connection_attempts=5&retry_delay=5',
  keys: ['nadri.account.#'],
  noAck: false,
  queueOptions: {
    durable: true,
  },
  exchangeOptions: {
    durable: false,
  },
};

const rabbitMqClientOptions: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [
      'amqp://nadri_user:nadri_pass@rabbitmq/nadri_vhost?connection_attempts=5&retry_delay=5',
    ],
    queue: 'account_service_queue',
    noAck: false,
    queueOptions: {
      durable: false,
    },
  },
};

export { rabbitMqClientOptions, customRabbitMqClientOptions };
