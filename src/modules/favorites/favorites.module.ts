import { Module, forwardRef } from '@nestjs/common';
import { DbModule } from 'src/db.module';
import { AlbumModule } from '../albums/album.module';
import { ArtistModule } from '../artist/artist.module';
import { TrackModule } from '../tracks/tracks.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
@Module({
  imports: [
    forwardRef(() => AlbumModule),
    forwardRef(() => ArtistModule),
    forwardRef(() => TrackModule),
    DbModule,
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
