import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import errorException from '../../common/errorException';
import { InjectRepository } from '@nestjs/typeorm';
import { FavouritesEntity } from './entities/favourites.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavouritesService {
  constructor(
    @InjectRepository(FavouritesEntity)
    private readonly favouritesRepository: Repository<FavouritesEntity>,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  create = async () => {
    const favourites = this.favouritesRepository.create();
    favourites.tracksIds = [];
    favourites.albumsIds = [];
    favourites.artistsIds = [];
    await this.favouritesRepository.save(favourites);
  };

  getFavourites = async () => {
    let favourites = await this.favouritesRepository.find();
    if (favourites.length === 0) {
      await this.create();
      favourites = await this.favouritesRepository.find();
    }
    return favourites[0];
  };

  findAll = async () => {
    const { albumsIds, artistsIds, tracksIds } = await this.getFavourites();

    const albumsObjects = await Promise.all(
      albumsIds.map((albumId) => this.albumService.findOne(albumId)),
    );
    const artistsObjects = await Promise.all(
      artistsIds.map((artistId) => this.artistService.findOne(artistId)),
    );
    const tracksObjects = await Promise.all(
      tracksIds.map((trackId) => this.trackService.findOne(trackId)),
    );

    return {
      albums: albumsObjects.filter((album) => album),
      artists: artistsObjects.filter((artist) => artist),
      tracks: tracksObjects.filter((track) => track),
    };
  };

  addArtist = async (artistId: string) => {
    const artist = await this.artistService.findOne(artistId);
    if (!artist) errorException.unprocessableException('Artist');

    const favourites = await this.getFavourites();
    favourites.artistsIds.push(artistId);

    await this.favouritesRepository.save(favourites);

    return { message: 'Successfully added' };
  };

  addAlbum = async (albumId: string) => {
    const album = await this.albumService.findOne(albumId);
    if (!album) errorException.unprocessableException('Album');

    const favourites = await this.getFavourites();
    favourites.albumsIds.push(albumId);

    await this.favouritesRepository.save(favourites);

    return { message: 'Successfully added' };
  };

  addTrack = async (trackId: string) => {
    const track = await this.trackService.findOne(trackId);
    if (!track) errorException.unprocessableException('Track');

    const favourites = await this.getFavourites();
    favourites.tracksIds.push(trackId);

    await this.favouritesRepository.save(favourites);

    return { message: 'Successfully added' };
  };

  removeArtist = async (id: string, skipError = false) => {
    const favourites = await this.getFavourites();
    const artistIndex = favourites.artistsIds.findIndex(
      (artistId) => artistId === id,
    );

    if (artistIndex === -1 && !skipError)
      errorException.unprocessableException('Artist');

    favourites.artistsIds.splice(artistIndex, 1);
    await this.favouritesRepository.save(favourites);
  };

  removeAlbum = async (id: string, skipError = false) => {
    const favourites = await this.getFavourites();
    const albumIndex = favourites.albumsIds.findIndex(
      (albumId) => albumId === id,
    );

    if (albumIndex === -1 && !skipError)
      errorException.unprocessableException('Album');

    favourites.albumsIds.splice(albumIndex, 1);
    await this.favouritesRepository.save(favourites);
  };

  removeTrack = async (id: string, skipError = false) => {
    const favourites = await this.getFavourites();
    const trackIndex = favourites.tracksIds.findIndex(
      (trackId) => trackId === id,
    );

    if (trackIndex === -1 && !skipError)
      errorException.unprocessableException('Track');

    favourites.tracksIds.splice(trackIndex, 1);
    await this.favouritesRepository.save(favourites);
  };
}
