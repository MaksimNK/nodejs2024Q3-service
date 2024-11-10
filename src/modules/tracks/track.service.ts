import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateTrackDto, GetTrackDto, UpdateTrackDto } from './dto/track.dto';
import { TrackEntity } from './track.entity';

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

  getTrackById(trackId: string): GetTrackDto | null {
    const track = this.tracks.get(trackId);
    if (!track) return null;
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

  deleteTrack(trackId: string): boolean {
    return this.tracks.delete(trackId);
  }

  isTrackExist(trackId: string): boolean {
    return this.tracks.has(trackId);
  }

  isValidUUID(uuid: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      uuid,
    );
  }
}
