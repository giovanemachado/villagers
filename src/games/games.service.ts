import { Injectable, NotFoundException } from '@nestjs/common';
import {
  MatchState,
  MatchStateUpdate,
} from '../match-states/dto/match-state.dto';
import { UnitsService } from 'src/units/units.service';
import { StaticDataService } from 'src/static-data/static-data.service';
import {
  GetValidMatchParams,
  MatchesService,
} from 'src/matches/matches.service';
import { MatchStatesService } from 'src/match-states/match-states.service';
import { UnitData } from 'src/units/dto/unit-data.dto';
import { SquareData } from 'src/maps/dto/square-data.dto';
import { MatchData } from 'src/matches/dto/match-data.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ERROR_MESSAGE } from 'src/errors/messages';

@Injectable()
export class GamesService {
  constructor(
    private staticDataService: StaticDataService,
    private matchesService: MatchesService,
    private unitsService: UnitsService,
    private matchStatesService: MatchStatesService,
    private prismaService: PrismaService,
  ) {}

  async getMatch({ code, playerId, active }: GetValidMatchParams) {
    return this.matchesService.getMatch({
      code,
      playerId,
      active,
    });
  }

  async createMatch(playerId: string): Promise<MatchData> {
    const activeMatch = await this.getMatch({
      playerId,
      active: true,
    });

    if (activeMatch) {
      return activeMatch;
    }

    return await this.matchesService.createMatch({
      // TODO this is not really random and doesnt make sure we are getting unique values.
      code: '' + Math.floor(100000 + Math.random() * 900000),
      players: [playerId],
    });
  }

  async joinMatch(
    playerId: string,
    code: string,
  ): Promise<{ match: MatchData; matchState: MatchState }> {
    const result = await this.prismaService.$transaction(
      async (prismaTransaction) => {
        const match = await this.matchesService.joinMatch(
          playerId,
          code,
          prismaTransaction,
        );

        let matchState = await this.getMatchState(code);

        if (!matchState) {
          matchState = await this.matchStatesService.createMatchState(
            code,
            prismaTransaction,
          );
        }

        return {
          match,
          matchState: {
            playersEndTurn: matchState.playersEndTurn,
            money: matchState.money,
            turns: matchState.turns,
            unitsMovement: matchState.unitsMovement,
          } as unknown as MatchState, // TODO create a mapper from prisma values to match state values. Do as a duck type thing
        };
      },
    );
    return result;
  }

  async finishMatch(id: string, code: string) {
    await this.matchesService.finishMatch(code, id);
  }

  async getMap(): Promise<SquareData[][]> {
    const { rows } = await this.staticDataService.getStaticResource(
      'maps',
      'initial-map.json',
    );

    return rows;
  }

  async getUnits(code: string): Promise<UnitData[]> {
    const match = await this.getMatch({ code, active: true });

    if (!match) {
      throw new NotFoundException(ERROR_MESSAGE.matchNotFound);
    }

    const { units } = await this.staticDataService.getStaticResource(
      'maps',
      'initial-map.json',
    );

    const unitsPerPlayer = this.unitsService.setUnitsToPlayers(
      units,
      match.players,
    );

    return unitsPerPlayer;
  }

  async getMatchState(code: string): Promise<MatchState | null> {
    return await this.matchStatesService.getMatchState(code);
  }

  async updateMatchState(
    code: string,
    playerId: string,
    matchStateUpdate: MatchStateUpdate,
  ) {
    return await this.matchStatesService.updateMatchState(
      code,
      playerId,
      matchStateUpdate,
    );
  }
}
