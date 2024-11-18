import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateTrackDto, GetTrackDto, UpdateTrackDto } from './dto/track.dto';
import { TrackEntity } from './track.entity';
import { FavoritesService } from '../favorites/favorites.service';
import { DbService } from 'src/db.service';

@Injectable()
export class TrackService {
  async getAllTracks() {
    return await this.dbService.track.findMany();
  }
  constructor(private readonly dbService: DbService) {}

  async getTrackById(id: string) {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Id is not a valid uuid');
    }
    const track = await this.dbService.track.findUnique({
      where: { id },
    });
    if (!track) {
      throw new NotFoundException('Track with this id does not exist');
    }

    return track;
  }

  async createTrack(createTrackDto: CreateTrackDto) {
    createTrackDto.artistId &&
      (await this.dbService.artist.findUnique({
        where: { id: createTrackDto.artistId },
      }));

    createTrackDto.albumId &&
      (await this.dbService.album.findUnique({
        where: { id: createTrackDto.albumId },
      }));

    return await this.dbService.track.create({ data: createTrackDto });
  }

  async updateTrack(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.getTrackById(id);
    if (track) {
      updateTrackDto.artistId &&
        (await this.dbService.artist.findUnique({
          where: { id: updateTrackDto.artistId },
        }));

      updateTrackDto.albumId &&
        (await this.dbService.album.findUnique({
          where: { id: updateTrackDto.albumId },
        }));

      return await this.dbService.track.update({
        where: { id },
        data: updateTrackDto,
      });
    }
  }

  async deleteTrack(id: string) {
    const track = await this.getTrackById(id);
    if (track) {
      return await this.dbService.track.delete({ where: { id } });
    }
  }

  isValidUUID(uuid: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      uuid,
    );
  }
}
