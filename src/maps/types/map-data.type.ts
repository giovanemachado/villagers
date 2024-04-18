import { SquareData } from './square-data.type';
import { UnitData } from '../../units/types/unit-data.type';

export type MapData = {
  units: UnitData[];
  rows: SquareData[][];
};
