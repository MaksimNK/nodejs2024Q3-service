import {
  Injectable,
  Inject,
  forwardRef,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesEntity } from './favorites.entity';
import { FavoritesResponse } from './dto/favorites.dto';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../albums/album.service';
import { TrackService } from '../tracks/track.service';
@Injectable()
export class FavoritesService {
  private favorites: FavoritesEntity = {
    artists: [],
    albums: [],
    tracks: [],
  };
  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumSerivce: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}
  getAllFavorites(): FavoritesResponse {
    const artists = this.favorites.artists.map((id) =>
      this.artistService.getArtistById(id),
    );
    const albums = this.favorites.albums.map((id) =>
      this.albumSerivce.getAlbumById(id),
    );
    const tracks = this.favorites.tracks.map((id) =>
      this.trackService.getTrackById(id),
    );
    return {
      artists,
      albums,
      tracks,
    };
  }
  addTrackToFavorites(trackId: string) {
    if (!this.isValidUUID(trackId)) {
      throw new Error('Invalid UUID');
    }
    const exist = this.favorites.tracks.includes(trackId);
    if (exist) {
      throw new Error('Track already in favorites');
    }
    const track = this.trackService.getTrackById(trackId);
    if (!track) {
      throw new UnprocessableEntityException('Track does not exist');
    }
    return this.favorites.tracks.push(trackId);
  }
  removeTrackFromFavorites(trackId: string) {
    if (!this.isValidUUID(trackId)) {
      throw new Error('Invalid UUID');
    }
    const exist = this.favorites.tracks.includes(trackId);
    if (!exist) {
      throw new Error('Track not found');
    }
    this.favorites.tracks = this.favorites.tracks.filter(
      (id) => id !== trackId,
    );
  }
  addAlbumToFavorites(albumsId: string) {
    if (!this.isValidUUID(albumsId)) {
      throw new Error('Invalid UUID');
    }
    const exist = this.favorites.albums.includes(albumsId);
    if (exist) {
      throw new Error('Album already in favorites');
    }
    const album = this.albumSerivce.getAlbumById(albumsId);
    if (!album) {
      throw new UnprocessableEntityException('Album does not exist');
    }
    return this.favorites.albums.push(albumsId);
  }
  removeAlbumFromFavorites(albumsId: string) {
    const exist = this.favorites.albums.includes(albumsId);
    if (!exist) {
      throw new Error('Album not found');
    }
    this.favorites.albums = this.favorites.albums.filter(
      (id) => id !== albumsId,
    );
  }
  addArtistToFavorites(artistId: string) {
    if (!this.isValidUUID(artistId)) {
      throw new Error('Invalid UUID');
    }
    const exist = this.favorites.artists.includes(artistId);
    if (exist) {
      throw new Error('Artist already in favorites');
    }
    const artist = this.artistService.getArtistById(artistId);
    if (!artist) {
      throw new UnprocessableEntityException('Artist does not exist');
    }
    return this.favorites.artists.push(artistId);
  }
  removeArtistFromFavorites(artistId: string) {
    if (!this.isValidUUID(artistId)) {
      throw new Error('Invalid UUID');
    }
    const exist = this.favorites.artists.includes(artistId);
    if (!exist) {
      throw new Error('Artist not found');
    }
    this.favorites.artists = this.favorites.artists.filter(
      (id) => id !== artistId,
    );
  }

  isValidUUID(uuid: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      uuid,
    );
  }

  removeArtist(artistId: string) {
    this.favorites.artists = this.favorites.artists.filter(
      (id) => id !== artistId,
    );
  }

  removeAlbum(albumId: string) {
    this.favorites.albums = this.favorites.albums.filter(
      (id) => id !== albumId,
    );
  }

  removeTrack(trackId: string) {
    this.favorites.tracks = this.favorites.tracks.filter(
      (id) => id !== trackId,
    );
  }
}
