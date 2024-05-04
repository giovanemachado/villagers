import { MapData } from 'src/maps/dto/map-data.dto';
import { MoneyData } from 'src/money/dto/money-data.dto';
import { UnitData } from 'src/units/dto/unit-data.dto';

export class GameState {
  gameId: string;
  playerIds: string[];
  money: MoneyData[];
  turns: number;
  units: UnitData[];
  gameMap: MapData;
}
