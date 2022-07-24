import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { FavouritesService } from '../favourites/favourites.service';
import { TrackService } from '../track/track.service';
import errorException from '../../common/errorException';
import prisma from '../../../prisma/prisma-client';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => FavouritesService))
    private readonly favouritesService: FavouritesService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  create = async (createAlbumDto: CreateAlbumDto) => {
    const { name, year, artistId } = createAlbumDto;
    return await prisma.album.create({
      data: {
        name,
        year,
        artistId: artistId ?? null,
      },
    });
  };

  findAll = async () => {
    return await prisma.album.findMany();
  };

  findOne = async (id: string) => {
    const album = prisma.album.findFirst({ where: { id } });
    if (!album) return null;
    return album;
  };

  update = async (id: string, updateAlbumDto: UpdateAlbumDto) => {
    const album = await prisma.album.findFirst({ where: { id } });
    if (!album) errorException.notFoundException('Album');

    return await prisma.album.update({
      where: { id },
      data: {
        ...updateAlbumDto,
      },
    });
  };

  remove = async (id: string) => {
    const album = await prisma.album.findFirst({ where: { id } });
    if (!album) errorException.notFoundException('Album');

    await prisma.album.delete({ where: { id } });

    await this.trackService.removeAlbumId(id);

    await this.favouritesService.removeAlbum(id, true);
  };

  removeArtistId = async (id) => {
    const albums = await this.findAll();
    albums.forEach((album) => {
      if (album.artistId === id) {
        const updateAlbumDto = new UpdateAlbumDto();
        updateAlbumDto.artistId = null;
        this.update(id, updateAlbumDto);
      }
    });
  };
}
