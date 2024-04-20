import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { DataAccessModule } from 'src/data-access/data-access.module';

@Module({
  controllers: [GamesController],
  providers: [GamesService],
  imports: [DataAccessModule],
})
export class GamesModule {}
