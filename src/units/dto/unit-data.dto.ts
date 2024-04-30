export enum UNIT_CATEGORY {
  MILITARY = 'military',
  STRUCTURE = 'structure',
}

export enum UNIT_CLASS {
  CASTLE = 'castle',
  GATE = 'gate',
  ARCHER = 'archer',
  SPEARMAN = 'spearman',
  HORSEMAN = 'horseman',
  WALL = 'wall',
}

export class UnitMovement {
  distance: number;
  localization: string;
}

export class UnitData {
  id: string;
  category: UNIT_CATEGORY;
  class: UNIT_CLASS;
  movement: UnitMovement;
  movementInTurn: {
    turn: number;
    moved: boolean;
  };
}
