import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from './custom-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLogger) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { url, method, query, body } = req;
    const { statusCode } = res;
    const message = `${method} ${url} ${JSON.stringify(query)} ${JSON.stringify(
      body,
    )} - ${statusCode}`;
    await this.logger.log(message);
    next();
  }
}
