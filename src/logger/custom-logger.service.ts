import { ConsoleLogger } from '@nestjs/common';
import * as path from 'path';
import { readdir, mkdir, appendFile, stat } from 'fs/promises';
import { createWriteStream } from 'fs';
import 'dotenv/config';

export class CustomLogger extends ConsoleLogger {
  private fileSize = parseInt(process.env.LOG_FILE_SIZE_KB) * 1024;
  customLog = async (message: string): Promise<void> => {
    await mkdir(path.join(process.cwd(), 'logs/logs'), { recursive: true });
    const dirname = path.resolve(process.cwd(), 'logs/logs');

    const ls = await readdir(dirname);
    let order = ls.length === 0 ? 0 : ls.length - 1;
    let filename = ls[ls.length - 1] || createFileName('log', order);
    if (ls.length === 0) {
      await createFile(dirname, filename);
    }

    const { size } = await stat(path.resolve(dirname, filename));
    const messageSize = Buffer.byteLength(message, 'utf-8') + 23;

    if (size + messageSize >= this.fileSize) {
      order += 1;
      filename = createFileName('log', order);
      await createFile(dirname, filename);
    }

    const date = new Date().toLocaleString();
    this.log(message);
    await appendFile(path.resolve(dirname, filename), `${date} - ${message}\n`);
  };

  customError(message: any, ...optionalParams: any[]): any {
    console.log(message);
  }

  customWarn(message: any, ...optionalParams: any[]): any {
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
