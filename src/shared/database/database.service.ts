import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

@Injectable()
export default class DatabaseService {
  constructor(@InjectConnection() public connection: Connection) {}

  async getRepository<T>(entity: any): Promise<Repository<T>> {
    return this.connection.getRepository(entity);
  }
}
