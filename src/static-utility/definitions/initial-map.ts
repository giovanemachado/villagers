import { SquareDefinitionData } from 'src/static-utility/types/square-data-definition.type';
import { UNIT_CLASS } from 'src/units/dto/unit-data.dto';

const defaultSquare: SquareDefinitionData = {};

const castleInSquare: SquareDefinitionData = {
  unitDefinitionClass: UNIT_CLASS.CASTLE,
};

const gateInSquare: SquareDefinitionData = {
  unitDefinitionClass: UNIT_CLASS.GATE,
};

const wallInSquare: SquareDefinitionData = {
  unitDefinitionClass: UNIT_CLASS.WALL,
};

const spearInSquare: SquareDefinitionData = {
  unitDefinitionClass: UNIT_CLASS.SPEARMAN,
};

const defaultRow: SquareDefinitionData[] = [
  defaultSquare,
  defaultSquare,
  defaultSquare,
  defaultSquare,
  defaultSquare,
];

const castleRow: SquareDefinitionData[] = [
  spearInSquare,
  castleInSquare,
  spearInSquare,
  defaultSquare,
  defaultSquare,
];

const gatesRow: SquareDefinitionData[] = [
  wallInSquare,
  wallInSquare,
  gateInSquare,
  wallInSquare,
  gateInSquare,
];

export const initial_map_definition: SquareDefinitionData[][] = [
  defaultRow,
  castleRow.map((square) => {
    if (square.unitDefinitionClass) {
      square.playerId = '1';
    }

    return square;
  }),
  gatesRow.map((square) => {
    if (square.unitDefinitionClass) {
      square.playerId = '1';
    }

    return square;
  }),
  defaultRow,
  defaultRow,
  defaultRow,
  gatesRow.map((square) => {
    if (square.unitDefinitionClass) {
      square.playerId = '2';
    }

    return square;
  }),
  castleRow.map((square) => {
    if (square.unitDefinitionClass) {
      square.playerId = '2';
    }

    return square;
  }),
  defaultRow,
];
