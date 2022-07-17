import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { DbModule } from '../../db/db.module';
import { FavouritesModule } from '../favourites/favourites.module';
import { TrackModule } from '../track/track.module';

@Module({
  imports: [
    DbModule,
    forwardRef(() => FavouritesModule),
    forwardRef(() => TrackModule),
  ],
  exports: [AlbumService],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
