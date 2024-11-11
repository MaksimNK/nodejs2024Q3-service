import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Post,
  Body,
  HttpCode,
  Put,
  Delete,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/artist.dto';

@Controller('/artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  findAll() {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!this.artistService.isValidUUID(id)) {
      throw new HttpException(
        'Invalid artistId format',
        HttpStatus.BAD_REQUEST,
      );
    }

    const artist = this.artistService.getArtistById(id);
    if (!artist) {
      throw new HttpException(
        `Artist with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return artist;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createArtistDto: CreateArtistDto) {
    if (!this.artistService.validateRequestBody(createArtistDto)) {
      throw new HttpException(
        'Request body must contain a valid name (string) and grammy (boolean)',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.artistService.createArtist(createArtistDto);
  }

  @Put(':id')
  updateArtist(
    @Param('id') id: string,
    @Body() updateArtistDto: CreateArtistDto,
  ) {
    if (!this.artistService.isValidUUID(id)) {
      throw new HttpException(
        'Invalid artistId format',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!this.artistService.isArtistExist(id)) {
      throw new HttpException(
        `Artist with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!this.artistService.validateRequestBody(updateArtistDto)) {
      throw new HttpException(
        'Request body must contain a valid name (string) and grammy (boolean)',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.artistService.updateArtistInfo(updateArtistDto, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    if (!this.artistService.isValidUUID(id)) {
      throw new HttpException(
        'Invalid artistId format',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!this.artistService.isArtistExist(id)) {
      throw new HttpException(
        `Artist with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    this.artistService.deleteArtist(id);
  }
}
