import { SquareDefinitionData } from 'src/static-data/types/square-data-definition.type';
import { UNIT_CLASS } from 'src/units/dto/unit-data.dto';
import { PLAYER_CODE } from './constants';

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
const archerInSquare: SquareDefinitionData = {
  unitDefinitionClass: UNIT_CLASS.ARCHER,
};
const horseInSquare: SquareDefinitionData = {
  unitDefinitionClass: UNIT_CLASS.HORSEMAN,
};

const defaultRow: SquareDefinitionData[] = [
  defaultSquare,
  defaultSquare,
  defaultSquare,
  defaultSquare,
  defaultSquare,
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
  spearInSquare,
  archerInSquare,
  spearInSquare,
  horseInSquare,
  horseInSquare,
];

const gatesRow: SquareDefinitionData[] = [
  wallInSquare,
  wallInSquare,
  gateInSquare,
  wallInSquare,
  gateInSquare,
  wallInSquare,
  wallInSquare,
  gateInSquare,
  wallInSquare,
  wallInSquare,
];

export const initial_map_definition: SquareDefinitionData[][] = [
  defaultRow,
  defaultRow,
  castleRow.map((square) => {
    if (square.unitDefinitionClass) {
      square.playerId = PLAYER_CODE.A;
    }

    return { ...square };
  }),
  defaultRow,
  gatesRow.map((square) => {
    if (square.unitDefinitionClass) {
      square.playerId = PLAYER_CODE.A;
    }

    return { ...square };
  }),
  defaultRow,
  defaultRow,
  defaultRow,
  defaultRow,
  gatesRow.map((square) => {
    if (square.unitDefinitionClass) {
      square.playerId = PLAYER_CODE.B;
    }

    return { ...square };
  }),
  defaultRow,
  castleRow.map((square) => {
    if (square.unitDefinitionClass) {
      square.playerId = PLAYER_CODE.B;
    }

    return { ...square };
  }),
  defaultRow,
  defaultRow,
];
