import { UnitData } from 'src/units/dto/unit-data.dto';
import { SquareData } from './square-data.dto';

export class GeneratedMap {
  rows: SquareData[][];
  units: UnitData[];
}
