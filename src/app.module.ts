import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './modules/artist/artist.module';
import { UserModule } from './modules/users/user.module';
import { TrackModule } from './modules/tracks/tracks.module';
import { AlbumModule } from './modules/albums/album.module';
import { FavoritesModule } from './modules/favorites/favorites.module';

@Module({
  imports: [
    UserModule,
    ArtistModule,
    TrackModule,
    AlbumModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
