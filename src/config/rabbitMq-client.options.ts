import { RmqOptions, Transport } from '@nestjs/microservices';

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

export default rabbitMqClientOptions;
