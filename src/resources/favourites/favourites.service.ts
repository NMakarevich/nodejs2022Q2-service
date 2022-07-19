import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InMemoryDb } from '../../db/in-memory.db';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import errorException from '../../common/errorException';

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
    const { albums, artists, tracks } = this.db.favourites;

    const albumsObjects = albums.map((albumId) =>
      this.albumService.findOne(albumId),
    );

    const artistsObjects = artists.map((artistId) =>
      this.artistService.findOne(artistId),
    );

    const tracksObjects = tracks.map((trackId) =>
      this.trackService.findOne(trackId),
    );

    return {
      albums: albumsObjects,
      artists: artistsObjects,
      tracks: tracksObjects,
    };
  }

  addArtist(id: string) {
    const artist = this.artistService.findOne(id);

    if (!artist) errorException.unprocessableException('Artist');

    this.db.favourites.artists.push(id);
    return { message: 'Successfully added' };
  }

  addAlbum(id: string) {
    const album = this.albumService.findOne(id);

    if (!album) errorException.unprocessableException('Album');

    this.db.favourites.albums.push(id);
    return { message: 'Successfully added' };
  }

  addTrack(id: string) {
    const track = this.trackService.findOne(id);

    if (!track) errorException.unprocessableException('Track');

    this.db.favourites.tracks.push(id);
    return { message: 'Successfully added' };
  }

  removeArtist(id: string, skipError = false) {
    const artistIndex = this.db.favourites.artists.findIndex(
      (artistId) => artistId === id,
    );

    if (artistIndex === -1 && !skipError)
      errorException.unprocessableException('Artist');

    this.db.favourites.artists.splice(artistIndex, 1);
  }

  removeAlbum(id: string, skipError = false) {
    const albumIndex = this.db.favourites.albums.findIndex(
      (albumId) => albumId === id,
    );

    if (albumIndex === -1 && !skipError)
      errorException.unprocessableException('Album');

    this.db.favourites.albums.splice(albumIndex, 1);
  }

  removeTrack(id: string, skipError = false) {
    const trackIndex = this.db.favourites.tracks.findIndex(
      (trackId) => trackId === id,
    );

    if (trackIndex === -1 && !skipError)
      errorException.unprocessableException('Track');

    this.db.favourites.tracks.splice(trackIndex, 1);
  }
}
