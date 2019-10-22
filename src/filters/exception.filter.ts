import {
  ExceptionFilter,
  Catch, ArgumentsHost,
  HttpException, HttpStatus,
} from '@nestjs/common';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

@Catch()
export default class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException
      ? exception.getResponse()
      : {
        code: 'Internal',
        message: 'Something wen\'t wrong, that\'s all we know',
      };

    response
      .status(status)
      .json({
        statusCode: status,
        message: exceptionResponse['message'],
        path: request.url,
        timestamp: new Date().toISOString(),
      });
  }
}
