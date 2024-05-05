import { MapData } from 'src/maps/dto/map-data.dto';
import { MoneyData } from 'src/money/dto/money-data.dto';
import { UnitData } from 'src/units/dto/unit-data.dto';

export class GameState {
  // This will be removed
  gameId: string;
  // This will be removed
  playerIds: string[];
  money: MoneyData[];
  turns: number;
  units: UnitData[];
  // This will be removed
  gameMap: MapData;
}
