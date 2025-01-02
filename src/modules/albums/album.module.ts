import { Module, forwardRef } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackModule } from '../tracks/tracks.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [forwardRef(() => TrackModule), forwardRef(() => FavoritesModule)],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
