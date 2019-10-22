import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { UniqueIdGenerator } from '../utils/uniqueIdGenerator';

@Injectable()
export class BaseSubscriber implements EntitySubscriberInterface {
  constructor(
    @InjectConnection() readonly connection: Connection,
  ) {
    connection.subscribers.push(this);
  }

  async beforeInsert(event: InsertEvent<any>): Promise<any> {
    event.entity.id = UniqueIdGenerator.generate();
  }
}
