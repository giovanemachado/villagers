import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { UnitsModule } from './units/units.module';
import { MatchesModule } from './matches/matches.module';
import { MapsModule } from './maps/maps.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MoneyModule } from './money/money.module';
import { PlayersModule } from './players/players.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { StaticDataModule } from './static-data/static-data.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GamesModule,
    UnitsModule,
    MatchesModule,
    MapsModule,
    PrismaModule,
    MoneyModule,
    PlayersModule,
    AuthModule,
    StaticDataModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
