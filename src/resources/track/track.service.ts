import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FavouritesService } from '../favourites/favourites.service';
import errorException from '../../common/errorException';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackEntity } from './entities/track.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private readonly trackRepository: Repository<TrackEntity>,
    @Inject(forwardRef(() => FavouritesService))
    private readonly favouritesService: FavouritesService,
  ) {}

  create = async (createTrackDto: CreateTrackDto) => {
    const newTrack = this.trackRepository.create(createTrackDto);
    return await this.trackRepository.save(newTrack);
  };

  findAll = async () => {
    return await this.trackRepository.find();
  };

  findOne = async (id: string) => {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) return null;
    return track;
  };

  update = async (id: string, updateTrackDto: UpdateTrackDto) => {
    const track = await this.findOne(id);
    if (!track) errorException.notFoundException('Track');

    const updatedTrack = Object.assign(track, updateTrackDto);
    return await this.trackRepository.save(updatedTrack);
  };

  remove = async (id: string) => {
    const result = await this.trackRepository.delete(id);
    if (result.affected === 0) errorException.notFoundException('Track');

    //await this.favouritesService.removeTrack(id, true);
  };
}
