import { LoggerService } from '@nestjs/common';
import * as path from 'path';
import { readdir, mkdir, appendFile, stat } from 'fs/promises';
import { createWriteStream } from 'fs';
import 'dotenv/config';

export class CustomLogger implements LoggerService {
  log = async (message: string): Promise<void> => {
    let order = 0;
    const fileSize = parseInt(process.env.LOG_FILE_SIZE_KB) * 1024;
    let filename = createFileName('log', order);
    const dirname = path.resolve(process.cwd(), 'logs/logs');
    await mkdir(dirname, { recursive: true });

    const ls = await readdir(dirname);
    if (ls.length === 0) {
      await createFile(dirname, filename);
    }

    const { size } = await stat(path.resolve(dirname, filename));
    if (size >= fileSize) {
      order += 1;
      filename = createFileName('log', order);
      await createFile(dirname, filename);
    }

    const date = new Date().toLocaleString();
    await appendFile(path.resolve(dirname, filename), `${date} - ${message}\n`);
  };

  error(message: any, ...optionalParams: any[]): any {
    console.log(message);
  }

  warn(message: any, ...optionalParams: any[]): any {
    console.log(message);
  }
}

function createFileName(name: string, order: number) {
  return order === 0 ? `${name}.txt` : `${name}${order}.txt`;
}

function createFile(dirname: string, filename: string) {
  return new Promise((resolve) => {
    const ws = createWriteStream(path.resolve(dirname, filename));
    ws.close();
    return resolve;
  });
}
