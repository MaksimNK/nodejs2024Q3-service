import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AlbumService } from '../albums/album.service';
import { TrackService } from '../tracks/track.service';
import { ArtistEntity } from './artist.entity';
import { CreateArtistDto } from './dto/artist.dto';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class ArtistService {
  private artists: Map<string, ArtistEntity> = new Map();

  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  createArtist(artistDto: CreateArtistDto): ArtistEntity {
    const { name, grammy } = artistDto;
    const artist = {
      id: randomUUID(),
      name,
      grammy,
    };

    this.artists.set(artist.id, artist);
    return artist;
  }

  getAllArtists(): ArtistEntity[] {
    return Array.from(this.artists.values());
  }

  getArtistById(artistId: string): ArtistEntity | null {
    return this.artists.get(artistId) || null;
  }

  updateArtistInfo(updateDto: CreateArtistDto, artistId: string): ArtistEntity {
    const artist = this.artists.get(artistId);

    artist.name = updateDto.name;
    artist.grammy = updateDto.grammy;

    return artist;
  }

  deleteArtist(artistId: string) {
    this.albumService.removeArtistFromAlbums(artistId);
    this.trackService.removeArtistFromTracks(artistId);
    this.favoritesService.removeArtist(artistId);

    this.artists.delete(artistId);
  }

  isArtistExist(artistId: string): boolean {
    return this.artists.has(artistId);
  }

  isValidUUID(uuid: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      uuid,
    );
  }

  validateRequestBody(dto: CreateArtistDto): boolean {
    const { name, grammy } = dto;

    if (typeof name !== 'string' || name.trim() === '') {
      return false;
    }

    if (typeof grammy !== 'boolean') {
      return false;
    }

    return true;
  }
}
