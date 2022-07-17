import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InMemoryDb } from '../../db/in-memory.db';
import { NOT_FOUND_MESSAGE } from '../../consts/consts';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class FavouritesService {
  constructor(
    private db: InMemoryDb,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  findAll() {
    return this.db.favourites;
  }

  addArtist(id: string) {
    const artist = this.artistService.findOne(id);
    if (!artist)
      throw new HttpException(
        `Artist ${NOT_FOUND_MESSAGE}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    this.db.favourites.artists.push(artist);
    return { message: 'Successfully added' };
  }

  addAlbum(id: string) {
    const album = this.albumService.findOne(id);
    if (!album)
      throw new HttpException(
        `Album ${NOT_FOUND_MESSAGE}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    this.db.favourites.albums.push(album);
    return { message: 'Successfully added' };
  }

  addTrack(id: string) {
    const track = this.trackService.findOne(id);
    if (!track)
      throw new HttpException(
        `Track ${NOT_FOUND_MESSAGE}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    this.db.favourites.tracks.push(track);
    return { message: 'Successfully added' };
  }

  removeArtist(id: string, skipError: boolean = false) {
    const artistIndex = this.db.favourites.artists.findIndex(
      (artist) => artist.id === id,
    );
    if (artistIndex === -1 && !skipError)
      throw new HttpException(
        `Artist ${NOT_FOUND_MESSAGE}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    this.db.favourites.artists = [
      ...this.db.favourites.artists.slice(0, artistIndex),
      ...this.db.favourites.artists.slice(artistIndex + 1),
    ];
  }

  removeAlbum(id: string, skipError: boolean = false) {
    const albumIndex = this.db.favourites.albums.findIndex(
      (album) => album.id === id,
    );
    if (albumIndex === -1 && !skipError)
      throw new HttpException(
        `Album ${NOT_FOUND_MESSAGE}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    this.db.favourites.albums = [
      ...this.db.favourites.albums.slice(0, albumIndex),
      ...this.db.favourites.albums.slice(albumIndex + 1),
    ];
  }

  removeTrack(id: string, skipError: boolean = false) {
    const trackIndex = this.db.favourites.tracks.findIndex(
      (track) => track.id === id,
    );
    if (trackIndex === -1 && !skipError)
      throw new HttpException(
        `Track ${NOT_FOUND_MESSAGE}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    this.db.favourites.tracks = [
      ...this.db.favourites.tracks.slice(0, trackIndex),
      ...this.db.favourites.tracks.slice(trackIndex + 1),
    ];
  }
}
