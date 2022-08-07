import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'yaml';
import { Logger, ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { CustomLogger } from './logger/custom-logger.service';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const document = await readFile(
    resolve(process.cwd(), 'doc', 'api.yaml'),
    'utf-8',
  );
  SwaggerModule.setup('doc', app, parse(document));

  const logger = new Logger('Exceptions');
  process.on('uncaughtException', async (error) => {
    logger.error(error);
  });
  process.on('unhandledRejection', async (reason) => {
    logger.error(reason);
  });

  await app.listen(PORT);
}
bootstrap();
