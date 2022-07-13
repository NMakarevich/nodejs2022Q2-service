import { ArtistModel } from '../../artist/models/artist.model';
import { AlbumModel } from '../../album/models/album.model';
import { TrackModel } from '../../track/models/track.model';

export interface FavouritesModel {
  artists: ArtistModel[];
  albums: AlbumModel[];
  tracks: TrackModel[];
}
