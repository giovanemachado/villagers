import { Injectable } from '@nestjs/common';
import { MatchDataCreate } from './dto/match-create.dto';
import { MatchData } from './dto/match-data.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events/events.gateway';
import { EVENT_TYPES } from 'src/events/dto/event-data.dto';

@Injectable()
export class MatchesService {
  constructor(
    private prismaService: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

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

  async enterInMatch(playerId: string, code: string): Promise<MatchData> {
    try {
      const match = await this.prismaService.match.findUnique({
        where: { code },
      });

      if (!match) {
        throw 'Non existent Match.';
      }

      if (!match.active) {
        throw 'Match is inactive.';
      }

      if (match.players.length >= match.numberOfPlayers) {
        throw 'Match is full.';
      }

      if (match.players.includes(playerId)) {
        throw 'Player is already in this room.';
      }

      const result = await this.prismaService.match.update({
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
        this.eventsGateway.emitEvent(EVENT_TYPES.MATCH_CREATED);
      }

      return result;
    } catch (error) {
      console.log(error);
      throw 'Match update failed';
    }
  }
}
