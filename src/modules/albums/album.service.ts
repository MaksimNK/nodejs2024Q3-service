import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateAlbumDto, UpdateAlbumDto, GetAlbumDto } from './dto/album.dto';
import { randomUUID } from 'crypto';
import { AlbumEntity } from './album.entity';
import { TrackService } from '../tracks/track.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumService {
  private albums: Map<string, AlbumEntity> = new Map();

  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  createAlbum(createAlbumDto: CreateAlbumDto): GetAlbumDto {
    const album: AlbumEntity = {
      id: randomUUID(),
      ...createAlbumDto,
    };
    this.albums.set(album.id, album);
    return album;
  }

  getAllAlbums(): GetAlbumDto[] {
    return Array.from(this.albums.values());
  }

  getAlbumById(albumId: string): GetAlbumDto {
    const album = this.albums.get(albumId);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  updateAlbum(updateAlbumDto: UpdateAlbumDto, albumId: string): GetAlbumDto {
    const album = this.albums.get(albumId);
    const updatedAlbum: AlbumEntity = {
      ...album,
      ...updateAlbumDto,
    };
    this.albums.set(albumId, updatedAlbum);
    return updatedAlbum;
  }

  deleteAlbum(albumId: string): void {
    if (!this.isAlbumExist(albumId)) {
      throw new NotFoundException('Album not found');
    }
    this.trackService.removeAlbumFromTracks(albumId);
    this.favoritesService.removeAlbum(albumId);

    this.albums.delete(albumId);
  }

  isAlbumExist(albumId: string): boolean {
    return this.albums.has(albumId);
  }

  isValidUUID(uuid: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      uuid,
    );
  }
  validateRequestBody(dto: CreateAlbumDto): boolean {
    const { name, year } = dto;

    if (typeof name !== 'string' || name.trim() === '') {
      return false;
    }
    if (name === null || year === null) {
      return false;
    }

    if (typeof year !== 'number') {
      return false;
    }

    return true;
  }

  removeArtistFromAlbums(artistId: string) {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}
