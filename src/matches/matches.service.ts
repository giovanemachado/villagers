import { Injectable } from '@nestjs/common';
import { MatchDataCreate } from './dto/match-create.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events/events.gateway';
import { EVENT_TYPES } from 'src/events/dto/event-data.dto';
import { MatchData } from './dto/match-data.dto';

@Injectable()
export class MatchesService {
  constructor(
    private prismaService: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async getValidMatch(code: string): Promise<MatchData> {
    const match = await this.prismaService.match.findUnique({
      where: { code },
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

  async enterInMatch(
    playerId: string,
    code: string,
    prismaTransaction?: any,
  ): Promise<MatchData> {
    try {
      const match = await this.getValidMatch(code);

      if (match.players.includes(playerId)) {
        this.eventsGateway.emitEvent(EVENT_TYPES.ENTER_IN_MATCH);
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
        this.eventsGateway.emitEvent(EVENT_TYPES.ENTER_IN_MATCH);
      }

      return result;
    } catch (error) {
      console.log(error);
      throw 'Match update failed';
    }
  }
}
