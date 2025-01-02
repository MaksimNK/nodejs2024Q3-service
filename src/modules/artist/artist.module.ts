import { Module, forwardRef } from '@nestjs/common';
import { DbModule } from 'src/db.module';
import { AlbumModule } from '../albums/album.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { TrackModule } from '../tracks/tracks.module';
import { ArtistController } from './artist.contoller';
import { ArtistService } from './artist.service';

@Module({
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => FavoritesModule),
    DbModule,
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
