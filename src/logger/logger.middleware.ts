import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from './custom-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLogger) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { url, method, query, body } = req;
    res.on('finish', async () => {
      const { statusCode } = res;
      const message = `${method} ${url} queries: ${JSON.stringify(
        query,
      )} body: ${JSON.stringify(body)} - ${statusCode}`;
      await this.logger.customLog(message);
    });
    next();
  }
}
