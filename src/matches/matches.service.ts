import { Injectable } from '@nestjs/common';
import { MatchDataCreate } from './dto/match-create.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events/events.gateway';
import { EVENT_TYPES } from 'src/events/dto/event-data.dto';
import { MatchData } from './dto/match-data.dto';

export type GetValidMatchParams = {
  code?: string;
  active?: boolean;
  playerId?: string;
  include?: any;
};

@Injectable()
export class MatchesService {
  constructor(
    private prismaService: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async getValidMatch({
    code,
    active,
    playerId,
    include,
  }: GetValidMatchParams) {
    const match = await this.prismaService.match.findFirst({
      where: {
        code,
        active,
        players: {
          has: playerId,
        },
      },
      include,
    });

    if (!match) {
      throw 'Non existent Match.';
    }

    if (!match.active) {
      throw 'Match is inactive.';
    }

    return match;
  }

  async createMatch(matchCreate: MatchDataCreate): Promise<MatchData> {
    try {
      const match = await this.prismaService.match.create({
        data: {
          ...matchCreate,
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

  async joinMatch(
    playerId: string,
    code: string,
    prismaTransaction?: any,
  ): Promise<MatchData> {
    try {
      const match = await this.getValidMatch({ code });

      if (match.players.includes(playerId)) {
        this.eventsGateway.emitEvent(EVENT_TYPES.JOIN_MATCH, {
          matchCode: match.code,
        });

        return match;
      }

      if (match.players.length >= match.numberOfPlayers) {
        throw 'Match is full.';
      }

      const prismaClient = prismaTransaction ?? this.prismaService;

      // TODO: move this logic to match service
      const result = await prismaClient.match.update({
        where: {
          code,
        },
        data: {
          players: {
            push: playerId,
          },
        },
      });

      if (result.active) {
        this.eventsGateway.emitEvent(EVENT_TYPES.JOIN_MATCH, {
          matchCode: match.code,
        });
      }

      return result;
    } catch (error) {
      console.log(error);
      throw 'Match update failed';
    }
  }

  async finishMatch(code: string, playerId: string) {
    try {
      const match = await this.getValidMatch({ code });

      if (!match.players.includes(playerId)) {
        throw 'Player is not in this Match.';
      }

      if (!match) {
        throw 'No match';
      }

      await this.prismaService.match.update({
        where: {
          code: code,
        },
        data: {
          active: false,
        },
      });

      this.eventsGateway.emitEvent(EVENT_TYPES.FINISH_MATCH, {
        matchCode: match.code,
      });
    } catch (error) {
      console.log(error);
      throw 'Match end failed';
    }
  }
}
