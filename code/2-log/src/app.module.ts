import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import dotenv from 'dotenv';
import Joi from 'joi';

const envFilePath = [
  resolve(__dirname, `../.env.${process.env.NODE_ENV ?? 'development'}`),
];

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      load: [() => dotenv.config({ path: resolve(__dirname, '../.env') })], // 加载公共的.env文件
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        PORT: Joi.number().default(3000),
        DB_URL: Joi.string().required(),
      }),
    }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
