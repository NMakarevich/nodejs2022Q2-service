import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AlbumEntity } from '../../album/entities/album.entity';
import { TrackEntity } from '../../track/entities/track.entity';

@Entity('artist')
export class ArtistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany(() => AlbumEntity, (album) => album.artistId)
  albums: AlbumEntity[];

  @OneToMany(() => TrackEntity, (track) => track.artistId)
  tracks: TrackEntity[];
}
