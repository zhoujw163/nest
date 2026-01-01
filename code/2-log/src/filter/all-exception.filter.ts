import * as common from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpAdapterHost } from '@nestjs/core';
import * as requestIp from 'request-ip';

@common.Catch()
export class AllExceptionFilter implements common.ExceptionFilter {
  constructor(
    private readonly logger: common.LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: any, host: common.ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 获取HTTP状态码
    const httpStatus =
      exception instanceof common.HttpException
        ? exception.getStatus()
        : common.HttpStatus.INTERNAL_SERVER_ERROR;

    // 获取异常消息
    let message = 'Internal server error';
    if (exception instanceof common.HttpException) {
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      // 还可以加入一些用户信息
      // IP信息
      ip: requestIp.getClientIp(request),
      exception: exception['name'] || exception['message'],
      error: message,
    };

    this.logger.error('[=====]', responseBody);
    this.httpAdapterHost.httpAdapter.reply(response, responseBody, httpStatus);
  }
}
