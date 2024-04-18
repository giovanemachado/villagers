import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { UnitsModule } from './units/units.module';
import { MatchesModule } from './matches/matches.module';
import { MapsModule } from './maps/maps.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GamesModule,
    UnitsModule,
    MatchesModule,
    MapsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
