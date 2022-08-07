import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { FavouritesService } from '../favourites/favourites.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import errorException from '../../common/errorException';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistEntity } from './entities/artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistEntity)
    private readonly artistRepository: Repository<ArtistEntity>,
    private readonly favouritesService: FavouritesService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  create = async (createArtistDto: CreateArtistDto) => {
    const newArtist = this.artistRepository.create({
      ...createArtistDto,
    });
    return await this.artistRepository.save(newArtist);
  };

  findAll = async () => {
    return await this.artistRepository.find();
  };

  findOne = async (id: string) => {
    const artist = this.artistRepository.findOne({ where: { id } });
    if (!artist) return null;
    return artist;
  };

  update = async (id: string, updateArtistDto: UpdateArtistDto) => {
    const artist = await this.findOne(id);
    if (!artist) errorException.notFoundException('Artist');

    const updatedArtist = Object.assign(artist, updateArtistDto);
    return await this.artistRepository.save(updatedArtist);
  };

  remove = async (id: string) => {
    const result = await this.artistRepository.delete(id);
    if (result.affected === 0) errorException.notFoundException('Artist');

    //await this.favouritesService.removeArtist(id, true);
  };
}
