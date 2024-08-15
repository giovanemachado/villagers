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
  initialLocalization: string;
  initialReachableLocalizations: string[];
}

export class UnitData {
  id: string;
  category: UNIT_CATEGORY;
  playerId: string;
  class: UNIT_CLASS;
  movement: UnitMovement;
}

export class UnitCombatInformation {
  localization: string[];
  class: string;
  id: string;
}
