import { forwardRef, Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { DbModule } from '../../db/db.module';
import { FavouritesModule } from '../favourites/favourites.module';

@Module({
  imports: [DbModule, forwardRef(() => FavouritesModule)],
  exports: [TrackService],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
