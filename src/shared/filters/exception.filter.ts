import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

import ConfigService from '../../config/config.service';

@Catch()
export default class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const notFound = exception instanceof EntityNotFoundError ? HttpStatus.NOT_FOUND : null;
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : notFound || HttpStatus.INTERNAL_SERVER_ERROR;

    const getHTTPExceptions = exception instanceof HttpException ? exception.getResponse() : null;
    const getServerError = exception instanceof Error
      ? {
        code: 'Internal',
        message:
              exception instanceof Error && !this.configService.isProduction()
                ? exception.stack
                : this.configService.getErrorMsg('SEV_01'),
      }
      : null;
    const getNotFound = exception instanceof EntityNotFoundError
      ? { message: this.configService.getErrorMsg('USR_12') }
      : null;

    const exceptionResponse = getHTTPExceptions || getNotFound || getServerError;

    const responseBody = {
      statusCode: status,
      message: this.statusMessage(status, exceptionResponse['message']),
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(responseBody);
  }

  statusMessage(status: number, exceptionResponse: any): string {
    if (status === 403) {
      return this.configService.getErrorMsg('AUTH_02');
    }
    return exceptionResponse;
  }
}
