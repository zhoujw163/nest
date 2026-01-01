import { Body, Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // this.logger.debug('aaa', AppController.name);
    // this.logger.error('bbb', AppController.name);
    // this.logger.log('ccc', AppController.name);
    // this.logger.verbose('ddd', AppController.name);
    // this.logger.warn('eee', AppController.name);
    return this.appService.getHello();
  }

  @Get('test-error')
  getTestError() {
    throw new Error(
      '这是一条测试用的普通 Error，应该被 AllExceptionFilter 捕获',
    );
  }
}
