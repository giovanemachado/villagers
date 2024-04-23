import { SquareDefinitionData } from 'src/static-utility/types/square-data-definition.type';
import { UNIT_CLASS } from 'src/units/types/unit-data.type';

const defaultSquare: SquareDefinitionData = {};

const castleSquare: SquareDefinitionData = {
  unitDefinitionClass: UNIT_CLASS.CASTLE,
};

const gateSquare: SquareDefinitionData = {
  unitDefinitionClass: UNIT_CLASS.GATE,
};

const wallSquare: SquareDefinitionData = {
  unitDefinitionClass: UNIT_CLASS.WALL,
};

const defaultRow: SquareDefinitionData[] = [
  defaultSquare,
  defaultSquare,
  defaultSquare,
  defaultSquare,
  defaultSquare,
];

const castleRow: SquareDefinitionData[] = [
  defaultSquare,
  castleSquare,
  defaultSquare,
  defaultSquare,
  defaultSquare,
];

const gatesRow: SquareDefinitionData[] = [
  wallSquare,
  wallSquare,
  gateSquare,
  wallSquare,
  gateSquare,
];

export const initial_map_definition: SquareDefinitionData[][] = [
  defaultRow,
  castleRow,
  gatesRow,
  defaultRow,
  defaultRow,
  defaultRow,
  gatesRow,
  castleRow,
  defaultRow,
];
