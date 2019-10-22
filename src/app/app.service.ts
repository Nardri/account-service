import { Injectable } from '@nestjs/common';

@Injectable()
export default class AppService {
  health(): { [key: string]: string } {
    return { status: 'ok' };
  }
}
