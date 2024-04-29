import { SquareData } from './square-data.dto';
import { UnitData } from '../../units/dto/unit-data.dto';

export class MapData {
  units: UnitData[];
  rows: SquareData[][];
}
