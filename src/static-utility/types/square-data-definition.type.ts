import { UNITS } from 'src/units/types/units.enum';
import { SQUARE_TYPES } from './square-types.enum';

export type SquareDefinitionData = {
  id?: string;
  type?: SQUARE_TYPES;
  unitDefinitionIds?: UNITS[];
};
