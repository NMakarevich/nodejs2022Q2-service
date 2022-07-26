import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('favourites')
export class FavouritesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('simple-array')
  albumsIds: string[];

  @Column('simple-array')
  artistsIds: string[];

  @Column('simple-array')
  tracksIds: string[];
}
