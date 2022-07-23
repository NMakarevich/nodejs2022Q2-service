import { ArtistModel } from '../../artist/models/artist.model';
import { AlbumModel } from '../../album/models/album.model';
import { TrackModel } from '../../track/models/track.model';

export interface FavouritesModel {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavouritesResponseModel {
  artists: Promise<ArtistModel>[];
  albums: Promise<AlbumModel>[];
  tracks: Promise<TrackModel>[];
}
