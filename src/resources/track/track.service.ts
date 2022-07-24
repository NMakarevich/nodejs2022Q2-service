import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { InMemoryDb } from '../../db/in-memory.db';
import { v4 as uuidv4 } from 'uuid';
import { FavouritesService } from '../favourites/favourites.service';
import errorException from '../../common/errorException';

@Injectable()
export class TrackService {
  constructor(
    private db: InMemoryDb,
    @Inject(forwardRef(() => FavouritesService))
    private readonly favouritesService: FavouritesService,
  ) {}

  create(createTrackDto: CreateTrackDto) {
    const newTrack = { ...createTrackDto, id: uuidv4() };
    this.db.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return this.db.tracks;
  }

  findOne(id: string) {
    const track = this.db.tracks.find((track) => track.id === id);
    if (!track) return null;
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const trackIndex = this.db.tracks.findIndex((track) => track.id === id);

    if (trackIndex === -1) errorException.notFoundException('Track');

    const updatedTrack = Object.assign(this.db.tracks[trackIndex], {
      ...updateTrackDto,
    });

    this.db.tracks[trackIndex] = updatedTrack;
    return updatedTrack;
  }

  remove(id: string): void {
    const trackIndex = this.db.tracks.findIndex((track) => track.id === id);

    if (trackIndex === -1) errorException.notFoundException('Track');

    this.db.tracks.splice(trackIndex, 1);

    this.favouritesService.removeTrack(id, true);
  }

  removeAlbumId(id: string) {
    this.db.tracks.forEach((track) => {
      if (track.albumId === id) {
        const updateTrackDto = new UpdateTrackDto();
        updateTrackDto.albumId = null;
        this.update(track.id, updateTrackDto);
      }
    });
  }

  removeArtistId(id: string) {
    this.db.tracks.forEach((track) => {
      if (track.artistId === id) {
        const updateTrackDto = new UpdateTrackDto();
        updateTrackDto.artistId = null;
        this.update(track.id, updateTrackDto);
      }
    });
  }
}
