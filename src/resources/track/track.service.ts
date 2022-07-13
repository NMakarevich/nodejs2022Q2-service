import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { InMemoryDb } from '../../db/in-memory.db';
import { v4 as uuidv4 } from 'uuid';
import { NOT_FOUND_MESSAGE } from '../../consts/consts';

@Injectable()
export class TrackService {
  constructor(private db: InMemoryDb) {}

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
    if (!track)
      throw new HttpException(
        `Track ${NOT_FOUND_MESSAGE}`,
        HttpStatus.NOT_FOUND,
      );
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const trackIndex = this.db.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1)
      throw new HttpException(
        `Track ${NOT_FOUND_MESSAGE}`,
        HttpStatus.NOT_FOUND,
      );
    const updatedTrack = Object.assign(this.db.tracks[trackIndex], {
      ...updateTrackDto,
    });
    this.db.tracks[trackIndex] = updatedTrack;
    return updatedTrack;
  }

  remove(id: string) {
    const trackIndex = this.db.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1)
      throw new HttpException(
        `Track ${NOT_FOUND_MESSAGE}`,
        HttpStatus.NOT_FOUND,
      );
    this.db.tracks = [
      ...this.db.tracks.slice(0, trackIndex),
      ...this.db.tracks.slice(trackIndex + 1),
    ];
  }
}
