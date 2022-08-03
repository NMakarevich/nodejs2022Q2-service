import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { AlbumEntity } from '../../album/entities/album.entity';
import { ArtistEntity } from '../../artist/entities/artist.entity';
import { TrackEntity } from '../../track/entities/track.entity';

@Entity('favourites')
export class FavouritesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => AlbumEntity, (album) => album, { cascade: true })
  @JoinTable()
  albums: AlbumEntity[];

  @ManyToMany(() => ArtistEntity, (artist) => artist, { cascade: true })
  @JoinTable()
  artists: ArtistEntity[];

  @ManyToMany(() => TrackEntity, (track) => track, { cascade: true })
  @JoinTable()
  tracks: TrackEntity[];
}
