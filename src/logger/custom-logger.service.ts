import { ConsoleLogger } from '@nestjs/common';
import * as path from 'path';
import { readdir, mkdir, appendFile, stat } from 'fs/promises';
import { createWriteStream } from 'fs';
import 'dotenv/config';

export class CustomLogger extends ConsoleLogger {
  private fileSize = parseInt(process.env.LOG_FILE_SIZE_KB) * 1024;
  customLog = async (message: string): Promise<void> => {
    await saveLog('log', message, this.fileSize);
    this.log(message);
  };

  customError(message: any, ...optionalParams: any[]): any {
    console.log(message);
  }

  customWarn(message: any, ...optionalParams: any[]): any {
    console.log(message);
  }
}

async function saveLog(name: string, message: string, fileSize: number) {
  await mkdir(path.join(process.cwd(), `logs/${name}s`), { recursive: true });
  const dirname = path.resolve(process.cwd(), `logs/${name}s`);

  const ls = await readdir(dirname);
  let order = ls.length === 0 ? 0 : ls.length - 1;
  let filename = ls[ls.length - 1] || generateFileName(name, order);
  if (ls.length === 0) {
    await createFile(dirname, filename);
  }

  const { size } = await stat(path.resolve(dirname, filename));
  const dateSize = Buffer.byteLength(new Date().toLocaleString(), 'utf-8');
  const messageSize = Buffer.byteLength(message, 'utf-8');

  if (size + messageSize + dateSize >= fileSize) {
    order += 1;
    filename = generateFileName('log', order);
    await createFile(dirname, filename);
  }

  await appendFile(
    path.resolve(dirname, filename),
    `${new Date().toLocaleString()} - ${message}\n`,
  );
}

function generateFileName(name: string, order: number) {
  return order === 0 ? `${name}.txt` : `${name}${order}.txt`;
}

function createFile(dirname: string, filename: string) {
  return new Promise((resolve) => {
    const ws = createWriteStream(path.resolve(dirname, filename));
    ws.close();
    return resolve;
  });
}
