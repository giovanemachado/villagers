import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MoneyModule } from 'src/money/money.module';
import { UnitsModule } from 'src/units/units.module';
import { StaticDataModule } from 'src/static-data/static-data.module';
import { MatchesModule } from 'src/matches/matches.module';
import { MatchStatesModule } from 'src/match-states/match-states.module';

@Module({
  controllers: [GamesController],
  providers: [GamesService],
  imports: [
    PrismaModule,
    MoneyModule,
    UnitsModule,
    StaticDataModule,
    MatchesModule,
    MatchStatesModule,
  ],
})
export class GamesModule {}
