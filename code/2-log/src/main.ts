import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { AllExceptionFilter } from './filter/all-exception.filter';

async function bootstrap() {
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike(),
        ),
      }),
      new winston.transports.DailyRotateFile({
        level: 'warn',
        dirname: 'logs',
        filename: 'logs/%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d', // 保留 14 天的日志文件
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          // nestWinstonModuleUtilities.format.nestLike(),
          winston.format.json(),
        ),
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    // 控制日志级别或者关闭日志 LoggerService | LogLevel[] | false
    // logger: false,
    // logger: ['error', 'warn'],
    logger,
  });

  app.setGlobalPrefix('api/v1');
  // app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalFilters(
    new AllExceptionFilter(logger, app.get(HttpAdapterHost)),
  );

  await app.listen(3000);
}
bootstrap();
