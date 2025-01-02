import { ArtistEntity } from 'src/modules/artist/artist.entity';
import { AlbumEntity } from 'src/modules/albums/album.entity';
import { TrackEntity } from 'src/modules/tracks/track.entity';

export interface FavoritesResponse {
  artists: ArtistEntity[];
  albums: AlbumEntity[];
  tracks: TrackEntity[];
}
