import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateTrackDto, GetTrackDto, UpdateTrackDto } from './dto/track.dto';
import { TrackEntity } from './track.entity';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TrackService {
  private tracks: Map<string, TrackEntity> = new Map();

  getAllTracks(): GetTrackDto[] {
    return Array.from(this.tracks.values()).map((track) => ({
      id: track.id,
      name: track.name,
      artistId: track.artistId,
      albumId: track.albumId,
      duration: track.duration,
    }));
  }
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  getTrackById(trackId: string): GetTrackDto | null {
    const track = this.tracks.get(trackId);
    return track;
  }

  createTrack(createTrackDto: CreateTrackDto): GetTrackDto {
    const track: TrackEntity = {
      id: randomUUID(),
      ...createTrackDto,
    };
    this.tracks.set(track.id, track);
    return this.getTrackById(track.id);
  }

  updateTrack(
    trackId: string,
    updateTrackDto: UpdateTrackDto,
  ): GetTrackDto | null {
    const track = this.tracks.get(trackId);
    if (!track) return null;
    Object.assign(track, updateTrackDto);
    this.tracks.set(trackId, track);
    return this.getTrackById(trackId);
  }

  deleteTrack(trackId: string) {
    try {
      this.favoritesService.removeTrack(trackId);
    } catch (error) {
      if (error.message !== 'Track not found') {
        console.error(`Error in removeTrackFromFavorites: ${error.message}`);
        throw error;
      }
    }
    this.tracks.delete(trackId);
  }

  isTrackExist(trackId: string): boolean {
    return this.tracks.has(trackId);
  }

  isValidUUID(uuid: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      uuid,
    );
  }
  removeArtistFromTracks(artistId: string) {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  removeAlbumFromTracks(albumId: string) {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
}
