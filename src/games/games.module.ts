import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MoneyModule } from 'src/money/money.module';
import { PlayersModule } from 'src/players/players.module';
import { UnitsModule } from 'src/units/units.module';
import { StaticDataModule } from 'src/static-data/static-data.module';
import { MatchesModule } from 'src/matches/matches.module';

@Module({
  controllers: [GamesController],
  providers: [GamesService],
  imports: [
    PrismaModule,
    MoneyModule,
    PlayersModule,
    UnitsModule,
    StaticDataModule,
    MatchesModule,
  ],
})
export class GamesModule {}
