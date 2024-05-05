import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [PlayersService],
  exports: [PlayersService],
  imports: [ConfigModule, PrismaModule],
})
export class PlayersModule {}
