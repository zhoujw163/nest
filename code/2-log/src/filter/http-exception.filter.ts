import * as common from '@nestjs/common';
import { Request, Response } from 'express';

@common.Catch(common.HttpException)
export class HttpExceptionFilter implements common.ExceptionFilter {
  constructor(private readonly logger: common.LoggerService) {}
  catch(exception: any, host: common.ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;

    this.logger.error(message, exception.stack);

    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}
