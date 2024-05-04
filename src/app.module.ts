import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { UnitsModule } from './units/units.module';
import { MatchesModule } from './matches/matches.module';
import { MapsModule } from './maps/maps.module';
import { ConfigModule } from '@nestjs/config';
import { DataAccessModule } from './data-access/data-access.module';
import { MoneyModule } from './money/money.module';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GamesModule,
    UnitsModule,
    MatchesModule,
    MapsModule,
    DataAccessModule,
    MoneyModule,
    PlayersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
