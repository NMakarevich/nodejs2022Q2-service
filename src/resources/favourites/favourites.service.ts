import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InMemoryDb } from '../../db/in-memory.db';
import { NOT_FOUND_MESSAGE } from '../../consts/consts';

@Injectable()
export class FavouritesService {
  constructor(private db: InMemoryDb) {}

  findAll() {
    return this.db.favourites;
  }

  addArtist(id: string) {
    const artist = this.db.artists.find((artist) => artist.id === id);
    if (!artist)
      throw new HttpException(
        `Artist ${NOT_FOUND_MESSAGE}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    this.db.favourites.artists.push(artist);
    return { message: 'Successfully added' };
  }

  addAlbum(id: string) {
    const album = this.db.albums.find((album) => album.id === id);
    if (!album)
      throw new HttpException(
        `Album ${NOT_FOUND_MESSAGE}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    this.db.favourites.albums.push(album);
    return { message: 'Successfully added' };
  }

  addTrack(id: string) {
    const track = this.db.tracks.find((track) => track.id === id);
    if (!track)
      throw new HttpException(
        `Track ${NOT_FOUND_MESSAGE}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    this.db.favourites.tracks.push(track);
    return { message: 'Successfully added' };
  }

  removeArtist(id: string) {
    const artistIndex = this.db.favourites.artists.findIndex(
      (artist) => artist.id === id,
    );
    if (artistIndex === -1)
      throw new HttpException(
        `Artist ${NOT_FOUND_MESSAGE}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    this.db.favourites.artists = [
      ...this.db.favourites.artists.slice(0, artistIndex),
      ...this.db.favourites.artists.slice(artistIndex + 1),
    ];
  }

  removeAlbum(id: string) {
    const albumIndex = this.db.favourites.albums.findIndex(
      (album) => album.id === id,
    );
    if (albumIndex === -1)
      throw new HttpException(
        `Album ${NOT_FOUND_MESSAGE}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    this.db.favourites.albums = [
      ...this.db.favourites.albums.slice(0, albumIndex),
      ...this.db.favourites.albums.slice(albumIndex + 1),
    ];
  }

  removeTrack(id: string) {
    const trackIndex = this.db.favourites.tracks.findIndex(
      (track) => track.id === id,
    );
    if (trackIndex === -1)
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
