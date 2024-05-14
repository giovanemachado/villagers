import { Injectable } from '@nestjs/common';
import { GeneratedMap } from 'src/maps/dto/map-data.dto';
import { GameState } from './dto/game-state.dto';
import { MoneyService } from 'src/money/money.service';
import { UnitsService } from 'src/units/units.service';
import { MatchData } from 'src/matches/dto/match-data.dto';
import { StaticDataService } from 'src/static-data/static-data.service';
import { MatchesService } from 'src/matches/matches.service';
import { INITIAL_TURN } from 'src/static-data/definitions/constants';

@Injectable()
export class GamesService {
  constructor(
    private readonly staticDataService: StaticDataService,
    private readonly matchesService: MatchesService,
    private readonly moneyService: MoneyService,
    private readonly unitsService: UnitsService,
  ) {}

  async getValidMatch(code: string): Promise<MatchData> {
    return this.matchesService.getValidMatch(code);
  }

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
    code: string,
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

  async getInitialGameState(code: string): Promise<GameState> {
    const match = await this.getValidMatch(code);
    const { units } = await this.getMap();

    const unitsPerPlayer = this.unitsService.setUnitsToPlayers(
      units,
      match.players,
    );

    console.log('tomar no cu ?', unitsPerPlayer);

    return {
      turns: INITIAL_TURN,
      money: this.moneyService.getMoney(INITIAL_TURN, [
        { playerId: match.players[0], value: 0 },
        { playerId: match.players[1], value: 0 },
      ]),
      units: unitsPerPlayer,
      match,
    };
  }
}
