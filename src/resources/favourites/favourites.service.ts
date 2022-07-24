import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import errorException from '../../common/errorException';
import prisma from '../../../prisma/prisma-client';

@Injectable()
export class FavouritesService {
  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  create = async () => {
    await prisma.favourites.create({
      data: {
        albumsIds: [],
        artistsIds: [],
        tracksIds: [],
      },
    });
  };

  getFavourites = async () => {
    let favourites = await prisma.favourites.findFirst();
    if (!favourites) {
      await this.create();
      favourites = await prisma.favourites.findFirst();
    }
    return favourites;
  };

  findAll = async () => {
    const { albumsIds, artistsIds, tracksIds } = await this.getFavourites();

    const albums = await Promise.all(
      albumsIds.map((id) => this.albumService.findOne(id)),
    );

    const artists = await Promise.all(
      artistsIds.map((id) => this.artistService.findOne(id)),
    );

    const tracks = await Promise.all(
      tracksIds.map((id) => this.trackService.findOne(id)),
    );

    return {
      albums: albums.filter((album) => album),
      artists: artists.filter((artist) => artist),
      tracks: tracks.filter((track) => track),
    };
  };

  addArtist = async (artistId: string) => {
    const artist = await this.artistService.findOne(artistId);
    if (!artist) errorException.unprocessableException('Artist');

    const { id } = await this.getFavourites();

    await prisma.favourites.update({
      where: { id },
      data: { artistsIds: { push: artistId } },
    });
    return { message: 'Successfully added' };
  };

  addAlbum = async (albumId: string) => {
    const album = await this.albumService.findOne(albumId);
    if (!album) errorException.unprocessableException('Album');

    const { id } = await this.getFavourites();

    await prisma.favourites.update({
      where: { id },
      data: { albumsIds: { push: albumId } },
    });
    return { message: 'Successfully added' };
  };

  addTrack = async (trackId: string) => {
    const track = await this.trackService.findOne(trackId);
    if (!track) errorException.unprocessableException('Track');

    const { id } = await this.getFavourites();

    await prisma.favourites.update({
      where: { id },
      data: { tracksIds: { push: trackId } },
    });
    return { message: 'Successfully added' };
  };

  removeArtist = async (artistId: string, skipError = false) => {
    const { id, artistsIds } = await prisma.favourites.findFirst();
    if (!artistsIds.includes(artistId) && !skipError)
      errorException.unprocessableException('Artist');

    await prisma.favourites.update({
      where: { id },
      data: { artistsIds: artistsIds.filter((id) => id !== artistId) },
    });
  };

  removeAlbum = async (albumId: string, skipError = false) => {
    const { id, albumsIds } = await prisma.favourites.findFirst();

    if (!albumsIds.includes(albumId) && !skipError)
      errorException.unprocessableException('Album');

    await prisma.favourites.update({
      where: { id },
      data: { albumsIds: albumsIds.filter((id) => id !== albumId) },
    });
  };

  removeTrack = async (trackId: string, skipError = false) => {
    const { id, tracksIds } = await prisma.favourites.findFirst();

    if (!tracksIds.includes(trackId) && !skipError)
      errorException.unprocessableException('Track');

    await prisma.favourites.update({
      where: { id },
      data: { tracksIds: tracksIds.filter((id) => id !== trackId) },
    });
  };
}
