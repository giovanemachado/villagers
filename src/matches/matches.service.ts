import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MatchDataCreate } from './dto/match-create.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events/events.gateway';
import { EVENT_TYPES } from 'src/events/dto/event-data.dto';
import { MatchData } from './dto/match-data.dto';
import { ERROR_MESSAGE } from 'src/errors/messages';

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

  async getMatch({ code, active, playerId, include }: GetValidMatchParams) {
    const whereOptions: any = {
      code,
      active,
    };

    if (playerId) {
      whereOptions.players = { has: playerId };
    }

    const match = await this.prismaService.match.findFirst({
      where: whereOptions,
      include,
    });

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
        throw new NotFoundException(ERROR_MESSAGE.matchNotFound);
      }

      return match;
    } catch (error) {
      throw new UnprocessableEntityException(
        ERROR_MESSAGE.createMatchFailed,
        error,
      );
    }
  }

  async joinMatch(
    playerId: string,
    code: string,
    prismaTransaction?: any,
  ): Promise<MatchData> {
    try {
      const match = await this.getMatch({ code, active: true });

      if (!match) {
        throw new NotFoundException(ERROR_MESSAGE.matchNotFound);
      }

      if (match.players.includes(playerId)) {
        this.eventsGateway.emitEvent(EVENT_TYPES.JOIN_MATCH, {
          matchCode: match.code,
        });

        return match;
      }

      if (match.players.length >= match.numberOfPlayers) {
        throw new UnprocessableEntityException(ERROR_MESSAGE.matchIsFull);
      }

      const prismaClient = prismaTransaction ?? this.prismaService;

      const matchUpdated = await prismaClient.match.update({
        where: {
          code,
        },
        data: {
          players: {
            push: playerId,
          },
        },
      });

      if (matchUpdated.active) {
        this.eventsGateway.emitEvent(EVENT_TYPES.JOIN_MATCH, {
          matchCode: match.code,
        });
      }

      return matchUpdated;
    } catch (error) {
      throw new UnprocessableEntityException(
        ERROR_MESSAGE.updateMatchFailed,
        error,
      );
    }
  }

  async finishMatch(code: string, playerId: string) {
    try {
      const match = await this.getMatch({ code, active: true });

      if (!match) {
        throw new NotFoundException(ERROR_MESSAGE.matchNotFound);
      }

      if (!match.players.includes(playerId)) {
        throw new NotFoundException(ERROR_MESSAGE.playerNotFound);
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
      throw new UnprocessableEntityException(
        ERROR_MESSAGE.updateMatchFailed,
        error,
      );
    }
  }
}
