import { ArtistModel } from '../resources/artist/models/artist.model';
import { TrackModel } from '../resources/track/models/track.model';
import { AlbumModel } from '../resources/album/models/album.model';
import { UserModel } from '../resources/user/models/user.model';
import { FavouritesModel } from '../resources/favourites/models/favourites.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryDb {
  artists: ArtistModel[] = [];
  tracks: TrackModel[] = [];
  albums: AlbumModel[] = [];
  users: UserModel[] = [];
  favourites: FavouritesModel = {
    artists: [],
    tracks: [],
    albums: [],
  };
}
