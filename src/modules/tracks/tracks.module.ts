import { Module } from '@nestjs/common';
import { FavoritesModule } from '../favorites/favorites.module';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { forwardRef } from '@nestjs/common';
import { DbModule } from 'src/db.module';

@Module({
  imports: [forwardRef(() => FavoritesModule), DbModule],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
