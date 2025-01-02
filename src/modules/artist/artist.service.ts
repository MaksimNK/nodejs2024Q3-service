import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AlbumService } from '../albums/album.service';
import { TrackService } from '../tracks/track.service';
import { ArtistEntity } from './artist.entity';
import { CreateArtistDto } from './dto/artist.dto';
import { FavoritesService } from '../favorites/favorites.service';
import { DbService } from 'src/db.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly dbService: DbService,
  ) {}

  async createArtist(artistDto: CreateArtistDto) {
    return await this.dbService.artist.create({ data: artistDto });
  }

  async getAllArtists() {
    return await this.dbService.artist.findMany();
  }

  async getArtistById(id: string) {
    if (this.isValidUUID(id)) {
      throw new BadRequestException('Id is not a valid uuid');
    }
    const artist = await this.dbService.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist with this id does not exist');
    }
    return artist;
  }

  async updateArtistInfo(updateDto: CreateArtistDto, id: string) {
    const artist = await this.getArtistById(id);
    if (artist) {
      return await this.dbService.artist.update({
        where: { id },
        data: updateDto,
      });
    }
  }

  async deleteArtist(id: string) {
    const artist = await this.getArtistById(id);
    if (artist) {
      return await this.dbService.artist.delete({ where: { id } });
    }
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
