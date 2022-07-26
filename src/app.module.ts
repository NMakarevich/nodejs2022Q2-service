import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './resources/user/user.module';
import { ArtistModule } from './resources/artist/artist.module';
import { AlbumModule } from './resources/album/album.module';
import { TrackModule } from './resources/track/track.module';
import { FavouritesModule } from './resources/favourites/favourites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavouritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
