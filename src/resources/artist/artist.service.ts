import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InMemoryDb } from '../../db/in-memory.db';
import { v4 as uuidv4 } from 'uuid';
import { NOT_FOUND_MESSAGE } from '../../consts/consts';

@Injectable()
export class ArtistService {
  constructor(private db: InMemoryDb) {}

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
    if (!artist)
      throw new HttpException(
        `Artist ${NOT_FOUND_MESSAGE}`,
        HttpStatus.NOT_FOUND,
      );
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

  remove(id: string) {
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

    this.db.albums.forEach((album, index) => {
      if (album.artistId === id) this.db.albums[index].artistId = null;
    });

    this.db.tracks.forEach((track, index) => {
      if (track.artistId === id) this.db.tracks[index].artistId = null;
    });

    const favIndex = this.db.favourites.artists.findIndex(
      (artist) => artist.id === id,
    );
    this.db.favourites.artists = [
      ...this.db.favourites.artists.slice(0, favIndex),
      ...this.db.favourites.artists.slice(favIndex + 1),
    ];
  }
}
