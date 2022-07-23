import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { FavouritesService } from '../favourites/favourites.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import errorException from '../../common/errorException';
import prisma from '../../../prisma/prisma-client';

@Injectable()
export class ArtistService {
  constructor(
    private readonly favouritesService: FavouritesService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  create = async (createArtistDto: CreateArtistDto) => {
    return prisma.artist.create({ data: { ...createArtistDto } });
  };

  findAll = async () => {
    return await prisma.artist.findMany();
  };

  findOne = async (id: string) => {
    const artist = await prisma.artist.findFirst({ where: { id } });
    if (!artist) return null;
    return artist;
  };

  update = async (id: string, updateArtistDto: UpdateArtistDto) => {
    const artist = await prisma.artist.findFirst({ where: { id } });

    if (!artist) errorException.notFoundException('Artist');

    return await prisma.artist.update({
      where: { id },
      data: { ...updateArtistDto },
    });
  };

  remove = async (id: string) => {
    const artist = await prisma.artist.findFirst({ where: { id } });

    if (!artist) errorException.notFoundException('Artist');

    await prisma.artist.delete({ where: { id } });

    await this.albumService.removeArtistId(id);

    await this.trackService.removeArtistId(id);

    // this.favouritesService.removeArtist(id, true);
  };
}
