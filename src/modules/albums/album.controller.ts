import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpStatus,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { CreateAlbumDto, UpdateAlbumDto, GetAlbumDto } from './dto/album.dto';
import { AlbumService } from './album.service';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  findAll() {
    return this.albumService.getAllAlbums();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!this.albumService.isValidUUID(id)) {
      throw new HttpException('Invalid albumId format', HttpStatus.BAD_REQUEST);
    }
    const album = this.albumService.getAlbumById(id);

    return album;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAlbumDto: CreateAlbumDto) {
    if (!this.albumService.validateRequestBody(createAlbumDto)) {
      throw new HttpException('Invalid data', HttpStatus.BAD_REQUEST);
    }
    if (createAlbumDto.artistId !== null)
      if (!this.albumService.isValidUUID(createAlbumDto.artistId)) {
        throw new HttpException(
          'Invalid albumId format',
          HttpStatus.BAD_REQUEST,
        );
      }
    return this.albumService.createAlbum(createAlbumDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    if (!this.albumService.isValidUUID(id)) {
      throw new HttpException('Invalid albumId format', HttpStatus.BAD_REQUEST);
    }
    if (!this.albumService.validateRequestBody(updateAlbumDto)) {
      throw new HttpException('Invalid data', HttpStatus.BAD_REQUEST);
    }
    return this.albumService.updateAlbum(updateAlbumDto, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    if (!this.albumService.isValidUUID(id)) {
      throw new HttpException('Invalid albumId format', HttpStatus.BAD_REQUEST);
    }

    this.albumService.deleteAlbum(id);
  }
}
