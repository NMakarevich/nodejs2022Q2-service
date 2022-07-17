import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InMemoryDb } from '../../db/in-memory.db';
import { v4 as uuidv4 } from 'uuid';
import { FavouritesService } from '../favourites/favourites.service';
import { NOT_FOUND_MESSAGE } from '../../consts/consts';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { UpdateTrackDto } from '../track/dto/update-track.dto';
import { UpdateAlbumDto } from '../album/dto/update-album.dto';

@Injectable()
export class ArtistService {
  constructor(
    private db: InMemoryDb,
    @Inject(forwardRef(() => FavouritesService))
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
    if (artistIndex === -1)
      throw new HttpException(
        `Artist ${NOT_FOUND_MESSAGE}`,
        HttpStatus.NOT_FOUND,
      );
    const updatedArtist = Object.assign(this.db.artists[artistIndex], {
      ...updateArtistDto,
    });
    this.db.artists[artistIndex] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string): void {
    const artistIndex = this.db.artists.findIndex((artist) => artist.id === id);
    if (artistIndex === -1)
      throw new HttpException(
        `Artist ${NOT_FOUND_MESSAGE}`,
        HttpStatus.NOT_FOUND,
      );
    this.db.artists = [
      ...this.db.artists.slice(0, artistIndex),
      ...this.db.artists.slice(artistIndex + 1),
    ];

    const albums = this.albumService.findAll();
    albums.forEach((album) => {
      if (album.artistId === id) {
        const updateAlbumDto = new UpdateAlbumDto();
        updateAlbumDto.artistId = null;
        this.albumService.update(album.id, updateAlbumDto);
      }
    });

    const tracks = this.trackService.findAll();
    tracks.forEach((track) => {
      if (track.artistId === id) {
        const updateTrackDto = new UpdateTrackDto();
        updateTrackDto.artistId = null;
        this.trackService.update(track.id, updateTrackDto);
      }
    });

    this.favouritesService.removeArtist(id, true);
  }
}
