import { UNIT_CLASS } from 'src/units/types/unit-data.type';
import { SQUARE_TYPES } from './square-types.enum';

export type SquareDefinitionData = {
  id?: string;
  type?: SQUARE_TYPES;
  unitDefinitionClass?: UNIT_CLASS;
};
