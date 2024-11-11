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
import { CreateTrackDto, GetTrackDto, UpdateTrackDto } from './dto/track.dto';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  findAll(): GetTrackDto[] {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  findOne(@Param('id') id: string): GetTrackDto {
    if (!this.trackService.isValidUUID(id)) {
      throw new HttpException('Invalid trackId format', HttpStatus.BAD_REQUEST);
    }
    const track = this.trackService.getTrackById(id);
    if (!track) {
      throw new HttpException(
        `Track with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return track;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTrackDto: CreateTrackDto): GetTrackDto {
    const { name, duration } = createTrackDto;
    if (!duration || !name) {
      throw new HttpException('Invalid dto', HttpStatus.BAD_REQUEST);
    }

    return this.trackService.createTrack(createTrackDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): GetTrackDto {
    const { name, artistId, albumId, duration } = updateTrackDto;
    if (!this.trackService.isValidUUID(id)) {
      throw new HttpException('Invalid trackId format', HttpStatus.BAD_REQUEST);
    }
    if (!name || !duration) {
      throw new HttpException(
        'At least one property (title, artistId, albumId, duration) must be provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!name && !artistId && !albumId && duration === undefined) {
      throw new HttpException(
        'At least one property (title, artistId, albumId, duration) must be provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    const track = this.trackService.updateTrack(id, updateTrackDto);
    if (!track) {
      throw new HttpException(
        `Track with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return track;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    if (!this.trackService.isValidUUID(id)) {
      throw new HttpException('Invalid trackId format', HttpStatus.BAD_REQUEST);
    }
    if (!this.trackService.isTrackExist(id)) {
      throw new HttpException(
        `Track with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    this.trackService.deleteTrack(id);
    return { statusCode: HttpStatus.NO_CONTENT };
  }
}
