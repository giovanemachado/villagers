import { Injectable } from '@nestjs/common';
import { DataAccessService } from 'src/data-access/data-access.service';
import { GeneratedMap, MapData } from 'src/maps/dto/map-data.dto';
import { GameState } from './dto/game-state.dto';
import { UnitData } from 'src/units/dto/unit-data.dto';
import { SquareData } from 'src/maps/dto/square-data.dto';

@Injectable()
export class GamesService {
  constructor(private readonly dataAcessService: DataAccessService) {
    this.turns = 1;
  }

  private turns: number;

  async getMap(): Promise<GeneratedMap> {
    return await this.dataAcessService.getStaticResource(
      'maps',
      'initial-map.json',
    );
  }

  getTurns() {
    return this.turns;
  }

  updateTurn() {
    this.turns++;
    return this.turns;
  }

  async getInitialGameState(): Promise<GameState> {
    const { rows, units } = await this.getMap();

    return {
      turns: 0,
      units,
      gameMap: { rows },
    };
  }
}
