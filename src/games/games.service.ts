import { Injectable } from '@nestjs/common';
import {
  MatchState,
  MatchStateUpdate,
} from '../match-states/dto/match-state.dto';
import { UnitsService } from 'src/units/units.service';
import { StaticDataService } from 'src/static-data/static-data.service';
import { MatchesService } from 'src/matches/matches.service';
import { MatchStatesService } from 'src/match-states/match-states.service';
import { UnitData } from 'src/units/dto/unit-data.dto';
import { SquareData } from 'src/maps/dto/square-data.dto';
import { Match } from '@prisma/client';
import { MatchData } from 'src/matches/dto/match-data.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GamesService {
  constructor(
    private readonly staticDataService: StaticDataService,
    private readonly matchesService: MatchesService,
    private readonly unitsService: UnitsService,
    private readonly matchStatesService: MatchStatesService,
    private readonly prismaService: PrismaService,
  ) {}

  async getValidMatch(code: string): Promise<Match> {
    return this.matchesService.getValidMatch(code);
  }

  async createMatch(playerId: string): Promise<MatchData> {
    const activeMatch = await this.getMatchActiveByPlayer(playerId);

    if (activeMatch) {
      return activeMatch;
    }

    return await this.matchesService.createMatch({
      // TODO this is not really random and doesnt make sure we are getting unique values.
      code: '' + Math.floor(100000 + Math.random() * 900000),
      players: [playerId],
    });
  }

  async enterInMatch(
    playerId: string,
    code: string,
  ): Promise<{ match: MatchData; matchState: MatchState }> {
    const result = await this.prismaService.$transaction(
      async (prismaTransaction) => {
        const match = await this.matchesService.enterInMatch(
          playerId,
          code,
          prismaTransaction,
        );

        const matchState = await this.matchStatesService.createMatchState(
          code,
          playerId,
          prismaTransaction,
        );

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

  async getMap(): Promise<SquareData[][]> {
    const { rows } = await this.staticDataService.getStaticResource(
      'maps',
      'initial-map.json',
    );

    return rows;
  }

  async getUnits(code: string): Promise<UnitData[]> {
    const match = await this.getValidMatch(code);
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

  async getMatchState(code: string): Promise<MatchState> {
    return (await this.matchStatesService.getMatchState(
      code,
    )) as unknown as MatchState;
  }

  async updateMatchState(
    code: string,
    playerId: string,
    matchStateUpdate: MatchStateUpdate,
  ) {
    this.matchStatesService.updateMatchState(code, playerId, matchStateUpdate);
  }

  async getMatchActiveByPlayer(playerId: string): Promise<MatchData | null> {
    const r = await this.prismaService.match.findFirst({
      where: {
        players: {
          has: playerId,
        },
        active: true,
      },
    });

    console.log('haha', r);

    return r;
  }
}
