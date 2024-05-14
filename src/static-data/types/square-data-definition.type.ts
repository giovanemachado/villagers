import { UNIT_CLASS } from 'src/units/dto/unit-data.dto';
import { SQUARE_TYPES } from './square-types.enum';
import { PLAYER_CODE } from '../definitions/constants';

export type SquareDefinitionData = {
  id?: string;
  type?: SQUARE_TYPES;
  unitDefinitionClass?: UNIT_CLASS;
  playerId?: PLAYER_CODE;
};
