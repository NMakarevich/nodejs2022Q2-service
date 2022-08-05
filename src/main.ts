import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'yaml';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { CustomLogger } from './logger/custom-logger.service';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new CustomLogger();
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const document = await readFile(
    resolve(process.cwd(), 'doc', 'api.yaml'),
    'utf-8',
  );

  SwaggerModule.setup('doc', app, parse(document));
  await app.listen(PORT);
  process.on('uncaughtException', async (error) => {
    await logger.customError(error);
  });
  process.on('unhandledRejection', async (reason) => {
    await logger.customError(reason);
  });
}
bootstrap();
