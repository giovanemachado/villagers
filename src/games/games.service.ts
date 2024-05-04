import { Injectable } from '@nestjs/common';
import { DataAccessService } from 'src/data-access/data-access.service';
import { GeneratedMap, MapData } from 'src/maps/dto/map-data.dto';
import { GameState } from './dto/game-state.dto';
import { MoneyService } from 'src/money/money.service';
import { PlayersService } from 'src/players/players.service';
import { UnitsService } from 'src/units/units.service';

@Injectable()
export class GamesService {
  constructor(
    private readonly dataAcessService: DataAccessService,
    private readonly moneyService: MoneyService,
    private readonly playersService: PlayersService,
    private readonly unitsService: UnitsService,
  ) {}

  async getMap(): Promise<GeneratedMap> {
    return await this.dataAcessService.getStaticResource(
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
    const playerIds = this.playersService.getPlayerIds();
    return Promise.resolve({
      gameId: `gameId-${new Date().getTime()}`,
      playerIds: playerIds,
      money: this.moneyService.getMoney(0, [
        { playerId: playerIds[0], value: 0 },
        { playerId: playerIds[1], value: 0 },
      ]),
    });
  }
}
