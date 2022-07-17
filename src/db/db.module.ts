import { Module } from '@nestjs/common';
import { InMemoryDb } from './in-memory.db';

@Module({
  providers: [InMemoryDb],
  exports: [InMemoryDb],
})
export class DbModule {}
