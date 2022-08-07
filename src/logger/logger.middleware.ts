import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    const { url, method, query, body } = req;
    res.on('finish', async () => {
      const { statusCode } = res;
      const message = `${method} ${url} queries: ${JSON.stringify(
        query,
      )} body: ${JSON.stringify(body)} - ${statusCode}`;
      await this.logger.log(message);
    });
    next();
  }
}
