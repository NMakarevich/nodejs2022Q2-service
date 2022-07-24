import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FavouritesService } from '../favourites/favourites.service';
import errorException from '../../common/errorException';
import prisma from '../../../prisma/prisma-client';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavouritesService))
    private readonly favouritesService: FavouritesService,
  ) {}

  create = async (createTrackDto: CreateTrackDto) => {
    const { name, albumId, artistId, duration } = createTrackDto;
    return await prisma.track.create({
      data: {
        name,
        duration,
        artistId: artistId ?? null,
        albumId: albumId ?? null,
      },
    });
  };

  findAll = async () => {
    return await prisma.track.findMany();
  };

  findOne = async (id: string) => {
    const track = await prisma.track.findFirst({ where: { id } });
    if (!track) return null;
    return track;
  };

  update = async (id: string, updateTrackDto: UpdateTrackDto) => {
    const track = await prisma.track.findFirst({ where: { id } });

    if (!track) errorException.notFoundException('Track');

    return await prisma.track.update({
      where: { id },
      data: {
        ...updateTrackDto,
      },
    });
  };

  remove = async (id: string) => {
    const track = await prisma.track.findFirst({ where: { id } });
    if (!track) errorException.notFoundException('Track');

    await prisma.track.delete({ where: { id } });

    await this.favouritesService.removeTrack(id, true);
  };

  removeAlbumId = async (id: string) => {
    const tracks = await this.findAll();
    tracks.forEach((track) => {
      if (track.albumId === id) {
        const updateTrackDto = new UpdateTrackDto();
        updateTrackDto.albumId = null;
        this.update(id, updateTrackDto);
      }
    });
  };

  removeArtistId = async (id: string) => {
    const tracks = await this.findAll();
    tracks.forEach((track) => {
      if (track.artistId === id) {
        const updateTrackDto = new UpdateTrackDto();
        updateTrackDto.artistId = null;
        this.update(id, updateTrackDto);
      }
    });
  };
}
