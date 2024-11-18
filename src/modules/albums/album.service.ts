import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { CreateAlbumDto, UpdateAlbumDto, GetAlbumDto } from './dto/album.dto';
import { randomUUID } from 'crypto';
import { AlbumEntity } from './album.entity';
import { TrackService } from '../tracks/track.service';
import { FavoritesService } from '../favorites/favorites.service';
import { DbService } from 'src/db.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly dbService: DbService,
  ) {}

  async createAlbum(createAlbumDto: CreateAlbumDto) {
    createAlbumDto.artistId &&
      (await this.dbService.artist.findUnique({
        where: { id: createAlbumDto.artistId },
      }));

    return await this.dbService.album.create({ data: createAlbumDto });
  }

  async getAllAlbums() {
    return await this.dbService.album.findMany();
  }

  async getAlbumById(id: string) {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Id is not a valid uuid');
    }
    const album = await this.dbService.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album with this id does not exist');
    }
    return album;
  }

  async updateAlbum(updateAlbumDto: UpdateAlbumDto, id: string) {
    const album = await this.getAlbumById(id);
    if (album) {
      updateAlbumDto.artistId &&
        (await this.dbService.artist.findUnique({
          where: { id: updateAlbumDto.artistId },
        }));
      return await this.dbService.album.update({
        where: { id },
        data: updateAlbumDto,
      });
    }
  }

  async deleteAlbum(id: string) {
    const album = await this.getAlbumById(id);
    if (album) {
      return await this.dbService.album.delete({ where: { id } });
    }
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
}
