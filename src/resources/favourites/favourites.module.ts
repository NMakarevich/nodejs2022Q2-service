import { forwardRef, Module } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { FavouritesController } from './favourites.controller';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';
import { TrackModule } from '../track/track.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavouritesEntity } from './entities/favourites.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavouritesEntity]),
    forwardRef(() => ArtistModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
  ],
  exports: [FavouritesService],
  controllers: [FavouritesController],
  providers: [FavouritesService],
})
export class FavouritesModule {}
