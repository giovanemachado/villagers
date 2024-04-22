import { SquareDefinitionData } from 'src/static-utility/types/square-data-definition.type';
import { UNITS } from 'src/units/types/units.enum';

const defaultSquare: SquareDefinitionData = {};

const castleSquare: SquareDefinitionData = {
  unitDefinitionIds: [UNITS.CASTLE],
};

const gateSquare: SquareDefinitionData = {
  unitDefinitionIds: [UNITS.GATE],
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
  defaultSquare,
  defaultSquare,
  gateSquare,
  defaultSquare,
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
