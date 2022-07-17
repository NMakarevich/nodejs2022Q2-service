import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumModel } from './models/album.model';
import { v4 as uuidv4 } from 'uuid';
import { InMemoryDb } from '../../db/in-memory.db';
import { FavouritesService } from '../favourites/favourites.service';
import { NOT_FOUND_MESSAGE } from '../../consts/consts';
import { TrackService } from '../track/track.service';
import { UpdateTrackDto } from '../track/dto/update-track.dto';

@Injectable()
export class AlbumService {
  constructor(
    private db: InMemoryDb,
    @Inject(forwardRef(() => FavouritesService))
    private readonly favouritesService: FavouritesService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

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
    if (!album) return null;
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

    const tracks = this.trackService.findAll();
    tracks.forEach((track) => {
      if (track.albumId === id) {
        const updateTrackDto = new UpdateTrackDto();
        updateTrackDto.albumId = null;
        this.trackService.update(track.id, updateTrackDto);
      }
    });

    this.favouritesService.removeAlbum(id, true);
  }
}
