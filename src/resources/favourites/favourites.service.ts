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
    await this.favouritesRepository.save(favourites);
  };

  getFavourites = async () => {
    let favourites = await this.favouritesRepository.find({
      relations: {
        albums: true,
        artists: true,
        tracks: true,
      },
    });
    if (favourites.length === 0) {
      await this.create();
      favourites = await this.favouritesRepository.find({
        relations: {
          albums: true,
          artists: true,
          tracks: true,
        },
      });
    }
    return favourites[0];
  };

  findAll = async () => {
    const favourites = await this.getFavourites();

    return {
      albums: favourites.albums,
      artists: favourites.artists,
      tracks: favourites.tracks,
    };
  };

  addArtist = async (artistId: string) => {
    const artist = await this.artistService.findOne(artistId);
    if (!artist) errorException.unprocessableException('Artist');

    const favourites = await this.getFavourites();
    favourites.artists.push(artist);

    await this.favouritesRepository.save(favourites);

    return { message: 'Successfully added' };
  };

  addAlbum = async (albumId: string) => {
    const album = await this.albumService.findOne(albumId);
    if (!album) errorException.unprocessableException('Album');

    const favourites = await this.getFavourites();
    favourites.albums.push(album);

    await this.favouritesRepository.save(favourites);

    return { message: 'Successfully added' };
  };

  addTrack = async (trackId: string) => {
    const track = await this.trackService.findOne(trackId);
    if (!track) errorException.unprocessableException('Track');

    const favourites = await this.getFavourites();
    favourites.tracks.push(track);

    await this.favouritesRepository.save(favourites);

    return { message: 'Successfully added' };
  };

  removeArtist = async (id: string, skipError = false) => {
    const favourites = await this.getFavourites();
    const artist = favourites.artists.find((artist) => artist.id === id);

    if (!artist && !skipError) errorException.unprocessableException('Artist');

    favourites.artists = favourites.artists.filter(
      (artist) => artist.id !== id,
    );
    await this.favouritesRepository.save(favourites);
  };

  removeAlbum = async (id: string, skipError = false) => {
    const favourites = await this.getFavourites();
    const album = favourites.albums.find((album) => album.id === id);

    if (!album && !skipError) errorException.unprocessableException('Album');

    favourites.albums = favourites.albums.filter((album) => album.id !== id);
    await this.favouritesRepository.save(favourites);
  };

  removeTrack = async (id: string, skipError = false) => {
    const favourites = await this.getFavourites();
    const track = favourites.tracks.find((track) => track.id === id);

    if (!track && !skipError) errorException.unprocessableException('Track');

    favourites.tracks = favourites.tracks.filter((track) => track.id !== id);
    await this.favouritesRepository.save(favourites);
  };
}
