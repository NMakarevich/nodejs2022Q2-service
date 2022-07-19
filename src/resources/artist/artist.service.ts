import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InMemoryDb } from '../../db/in-memory.db';
import { v4 as uuidv4 } from 'uuid';
import { FavouritesService } from '../favourites/favourites.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import errorException from '../../common/errorException';

@Injectable()
export class ArtistService {
  constructor(
    private db: InMemoryDb,
    private readonly favouritesService: FavouritesService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  create(createArtistDto: CreateArtistDto) {
    const newArtist = { ...createArtistDto, id: uuidv4() };
    this.db.artists.push(newArtist);
    return newArtist;
  }

  findAll() {
    return this.db.artists;
  }

  findOne(id: string) {
    const artist = this.db.artists.find((artist) => artist.id === id);
    if (!artist) return null;
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artistIndex = this.db.artists.findIndex((artist) => artist.id === id);

    if (artistIndex === -1) errorException.notFoundException('Artist');

    const updatedArtist = Object.assign(this.db.artists[artistIndex], {
      ...updateArtistDto,
    });

    this.db.artists[artistIndex] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string): void {
    const artistIndex = this.db.artists.findIndex((artist) => artist.id === id);

    if (artistIndex === -1) errorException.notFoundException('Artist');

    this.db.artists.splice(artistIndex, 1);

    this.albumService.removeArtistId(id);

    this.trackService.removeArtistId(id);

    this.favouritesService.removeArtist(id, true);
  }
}
