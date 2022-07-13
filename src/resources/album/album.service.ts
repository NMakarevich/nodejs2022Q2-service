import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumModel } from './models/album.model';
import { v4 as uuidv4 } from 'uuid';
import { InMemoryDb } from '../../db/in-memory.db';
import { NOT_FOUND_MESSAGE } from '../../consts/consts';

@Injectable()
export class AlbumService {
  constructor(private db: InMemoryDb) {}

  create(createAlbumDto: CreateAlbumDto): AlbumModel {
    const newAlbum = { ...createAlbumDto, id: uuidv4() };
    this.db.albums.push(newAlbum);
    return newAlbum;
  }

  findAll(): AlbumModel[] {
    return this.db.albums;
  }

  findOne(id: string) {
    const album = this.db.albums.find((album) => album.id === id);
    if (!album)
      throw new HttpException(
        `Album ${NOT_FOUND_MESSAGE}`,
        HttpStatus.NOT_FOUND,
      );
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const albumIndex = this.db.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1)
      throw new HttpException(
        `Album ${NOT_FOUND_MESSAGE}`,
        HttpStatus.NOT_FOUND,
      );
    const updatedAlbum = Object.assign(this.db.albums[albumIndex], {
      ...updateAlbumDto,
    });
    this.db.albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  remove(id: string) {
    const albumIndex = this.db.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1)
      throw new HttpException(
        `Album ${NOT_FOUND_MESSAGE}`,
        HttpStatus.NOT_FOUND,
      );
    this.db.albums = [
      ...this.db.albums.slice(0, albumIndex),
      ...this.db.albums.slice(albumIndex + 1),
    ];

    this.db.tracks.forEach((track, index) => {
      if (track.artistId === id) this.db.tracks[index].albumId = null;
    });
  }
}
