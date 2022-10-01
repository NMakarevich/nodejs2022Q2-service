import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuidv4 } from 'uuid';
import { InMemoryDb } from '../../db/in-memory.db';
import { FavouritesService } from '../favourites/favourites.service';
import { TrackService } from '../track/track.service';
import errorException from '../../common/errorException';

@Injectable()
export class AlbumService {
  constructor(
    private db: InMemoryDb,
    @Inject(forwardRef(() => FavouritesService))
    private readonly favouritesService: FavouritesService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = { ...createAlbumDto, id: uuidv4() };
    this.db.albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return this.db.albums;
  }

  findOne(id: string) {
    const album = this.db.albums.find((album) => album.id === id);
    if (!album) return null;
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const albumIndex = this.db.albums.findIndex((album) => album.id === id);

    if (albumIndex === -1) errorException.notFoundException('Album');

    const updatedAlbum = Object.assign(this.db.albums[albumIndex], {
      ...updateAlbumDto,
    });

    this.db.albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  remove(id: string) {
    const albumIndex = this.db.albums.findIndex((album) => album.id === id);

    if (albumIndex === -1) errorException.notFoundException('Album');

    this.db.albums.splice(albumIndex, 1);

    this.trackService.removeAlbumId(id);

    this.favouritesService.removeAlbum(id, true);
  }

  removeArtistId(id) {
    this.db.albums.forEach((album) => {
      if (album.artistId === id) {
        const updateAlbumDto = new UpdateAlbumDto();
        updateAlbumDto.artistId = null;
        this.update(album.id, updateAlbumDto);
      }
    });
  }
}
