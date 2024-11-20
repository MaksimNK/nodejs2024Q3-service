import { Module, forwardRef } from '@nestjs/common';
import { TrackModule } from '../tracks/tracks.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { DbModule } from 'src/db.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [DbModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
