import { Injectable } from '@nestjs/common';
import { DataAccessService } from 'src/data-access/data-access.service';
import { GeneratedMap, MapData } from 'src/maps/dto/map-data.dto';
import { GameState } from './dto/game-state.dto';

@Injectable()
export class GamesService {
  constructor(private readonly dataAcessService: DataAccessService) {}

  async getMap(): Promise<GeneratedMap> {
    return await this.dataAcessService.getStaticResource(
      'maps',
      'initial-map.json',
    );
  }

  async updateGameState(state: GameState): Promise<GameState> {
    state.units.map((unit) => (unit.movementInTurn.moved = false));
    state.turns++;

    return {
      ...state,
    };
  }

  async getInitialGameState(): Promise<GameState> {
    const { rows, units } = await this.getMap();

    return {
      gameId: await this.generateNewGame(),
      turns: 1,
      units,
      gameMap: { rows },
    };
  }

  // temporary stub. It will return a valid game id to differenciate matches
  async generateNewGame(): Promise<string> {
    return Promise.resolve(`gameId-${new Date().getTime()}`);
  }
}
