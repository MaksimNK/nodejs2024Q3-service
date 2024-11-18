import { Module, forwardRef } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackModule } from '../tracks/tracks.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { DbModule } from 'src/db.module';

@Module({
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
    DbModule,
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
