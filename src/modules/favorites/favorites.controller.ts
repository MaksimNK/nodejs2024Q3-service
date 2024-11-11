import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  BadRequestException,
  HttpCode,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResponse } from './dto/favorites.dto';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites(): FavoritesResponse {
    return this.favoritesService.getAllFavorites();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrackToFavorites(@Param('id') id: string) {
    if (!this.favoritesService.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    this.favoritesService.addTrackToFavorites(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrackFromFavorites(@Param('id') id: string) {
    if (!this.favoritesService.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    try {
      this.favoritesService.removeTrackFromFavorites(id);
    } catch (e) {
      throw new UnprocessableEntityException(e.message);
    }
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbumToFavorites(@Param('id') id: string) {
    if (!this.favoritesService.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    try {
      this.favoritesService.addAlbumToFavorites(id);
    } catch (e) {
      throw new UnprocessableEntityException(e.message);
    }
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbumFromFavorites(@Param('id') id: string) {
    if (!this.favoritesService.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    try {
      this.favoritesService.removeAlbumFromFavorites(id);
    } catch (e) {
      throw new UnprocessableEntityException(e.message);
    }
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtistToFavorites(@Param('id') id: string) {
    if (!this.favoritesService.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    try {
      this.favoritesService.addArtistToFavorites(id);
    } catch (e) {
      throw new UnprocessableEntityException(e.message);
    }
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtistFromFavorites(@Param('id') id: string) {
    if (!this.favoritesService.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    try {
      this.favoritesService.removeArtistFromFavorites(id);
    } catch (e) {
      throw new UnprocessableEntityException(e.message);
    }
  }
}
