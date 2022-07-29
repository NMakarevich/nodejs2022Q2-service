import { DataSource } from 'typeorm';
import 'dotenv/config';
import { UserEntity } from './resources/user/entities/user.entity';
import { AlbumEntity } from './resources/album/entities/album.entity';
import { ArtistEntity } from './resources/artist/entities/artist.entity';
import { TrackEntity } from './resources/track/entities/track.entity';
import { FavouritesEntity } from './resources/favourites/entities/favourites.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: [
    UserEntity,
    AlbumEntity,
    ArtistEntity,
    TrackEntity,
    FavouritesEntity,
  ],
  subscribers: [],
  migrations: ['dist/typeorm/migrations/*.js'],
});
