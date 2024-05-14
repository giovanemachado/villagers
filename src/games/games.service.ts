import { Injectable } from '@nestjs/common';
import { GeneratedMap } from 'src/maps/dto/map-data.dto';
import { GameState } from './dto/game-state.dto';
import { MoneyService } from 'src/money/money.service';
import { UnitsService } from 'src/units/units.service';
import { MatchData } from 'src/matches/dto/match-data.dto';
import { StaticDataService } from 'src/static-data/static-data.service';
import { MatchesService } from 'src/matches/matches.service';

@Injectable()
export class GamesService {
  constructor(
    private readonly staticDataService: StaticDataService,
    private readonly matchesService: MatchesService,
    private readonly moneyService: MoneyService,
    private readonly unitsService: UnitsService,
  ) {}

  async createMatch(playerId: string): Promise<MatchData> {
    const match = await this.matchesService.createMatch({
      // this is not really random and doesnt make sure we are getting unique values.
      code: '' + Math.floor(100000 + Math.random() * 900000),
      players: [playerId],
    });

    return match;
  }

  async enterInMatch(playerId: string, code: string): Promise<MatchData> {
    const match = await this.matchesService.enterInMatch(playerId, code);

    return match;
  }

  async getMap(): Promise<GeneratedMap> {
    return await this.staticDataService.getStaticResource(
      'maps',
      'initial-map.json',
    );
  }

  async updateGameState(
    state: Partial<GameState>,
  ): Promise<Partial<GameState>> {
    if (!state.units || !state.turns || !state.money) {
      throw 'Missing data to update game state';
    }

    state.units.map((unit) => (unit.movementInTurn.moved = false));
    state.turns++;
    state.money = this.moneyService.getMoney(state.turns, state.money);

    return {
      ...state,
    };
  }

  async getInitialGameState(): Promise<GameState> {
    const { playerIds, gameId, money } = await this.generateNewGame();
    const { rows, units } = await this.getMap();

    const unitsPerPlayer = this.unitsService.setUnitsToPlayers(
      units,
      playerIds,
    );

    return {
      playerIds,
      gameId,
      turns: 1,
      money,
      units: unitsPerPlayer,
      gameMap: { rows },
    };
  }

  // temporary stub. It will return a valid game id to differenciate matches
  async generateNewGame(): Promise<
    Pick<GameState, 'gameId' | 'playerIds' | 'money'>
  > {
    return Promise.resolve({
      gameId: `gameId-${new Date().getTime()}`,
      playerIds: [],
      money: this.moneyService.getMoney(0, [
        { playerId: '1', value: 0 },
        { playerId: '2', value: 0 },
      ]),
    });
  }
}
