// eslint-disable-next-line import/prefer-default-export
export abstract class ServiceAPIResponse<A> {
  abstract get data(): A;
}

export interface ICustomRmqOptions {
  queue: string;
  host: string;
  exchange: string;
  exchangeType: string;
  keys?: string[];
  queueOptions?: any;
  exchangeOptions?: any;
  noAck?: boolean;
}
