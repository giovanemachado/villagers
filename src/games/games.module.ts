import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { DataAccessModule } from 'src/data-access/data-access.module';
import { MoneyModule } from 'src/money/money.module';
import { PlayersModule } from 'src/players/players.module';
import { UnitsModule } from 'src/units/units.module';

@Module({
  controllers: [GamesController],
  providers: [GamesService],
  imports: [DataAccessModule, MoneyModule, PlayersModule, UnitsModule],
})
export class GamesModule {}
