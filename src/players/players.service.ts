import { Injectable } from '@nestjs/common';
import { PlayerDataCreate } from './dto/player-create.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlayersService {
  constructor(private prismaService: PrismaService) {}

  async findPlayer(
    playerWhereUniqueInput: Prisma.PlayerWhereUniqueInput,
  ): Promise<PlayerDataCreate | null> {
    const player = await this.prismaService.player.findUnique({
      where: playerWhereUniqueInput,
    });

    return player;
  }

  getPlayerIds(): string[] {
    return [
      `player1-${new Date().getTime()}`,
      `player2-${new Date().getTime()}`,
    ];
  }
}
