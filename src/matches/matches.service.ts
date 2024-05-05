import { Injectable } from '@nestjs/common';
import { MatchDataCreate } from './dto/match-create.dto';
import { MatchData } from './dto/match-data.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlayerData } from 'src/players/dto/player-data.dto';

@Injectable()
export class MatchesService {
  constructor(private prismaService: PrismaService) {}

  async createMatch(matchCreate: MatchDataCreate): Promise<MatchData> {
    try {
      const match = await this.prismaService.match.create({
        data: {
          ...matchCreate,
          players: {
            connect: {
              id: matchCreate.players[0].id,
            },
          },
        },
        include: {
          players: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      if (!match) {
        throw 'No match';
      }

      return match;
    } catch (error) {
      console.log(error);
      throw 'Match create failed';
    }
  }

  async enterInMatch(player: PlayerData, code: string): Promise<MatchData> {
    try {
      const result = await this.prismaService.match.update({
        where: {
          code: code,
        },
        data: {
          players: {
            connect: {
              id: player.id,
            },
          },
        },
        include: {
          players: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      return result;
    } catch (error) {
      console.log(error);
      throw 'Match update failed';
    }
  }
}
