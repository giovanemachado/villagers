import { MapData } from 'src/maps/dto/map-data.dto';
import { UnitData } from 'src/units/dto/unit-data.dto';

export class GameState {
  gameId: string;
  turns: number;
  units: UnitData[];
  gameMap: MapData;
}
