import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [PlayersService],
  exports: [PlayersService],
  imports: [ConfigModule],
})
export class PlayersModule {}
