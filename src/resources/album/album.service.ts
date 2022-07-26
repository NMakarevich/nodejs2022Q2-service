import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { FavouritesService } from '../favourites/favourites.service';
import { TrackService } from '../track/track.service';
import errorException from '../../common/errorException';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from './entities/album.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
    @Inject(forwardRef(() => FavouritesService))
    private readonly favouritesService: FavouritesService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  create = async (createAlbumDto: CreateAlbumDto) => {
    const newAlbum = this.albumRepository.create(createAlbumDto);
    return await this.albumRepository.save(newAlbum);
  };

  findAll = async () => {
    return await this.albumRepository.find();
  };

  findOne = async (id: string) => {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) return null;
    return album;
  };

  update = async (id: string, updateAlbumDto: UpdateAlbumDto) => {
    const album = await this.findOne(id);
    if (!album) errorException.notFoundException('Album');

    const updatedAlbum = Object.assign(album, updateAlbumDto);
    return await this.albumRepository.save(updatedAlbum);
  };

  remove = async (id: string) => {
    const result = await this.albumRepository.delete(id);
    if (result.affected === 0) errorException.notFoundException('Album');

    //await this.favouritesService.removeAlbum(id, true);
  };
}
