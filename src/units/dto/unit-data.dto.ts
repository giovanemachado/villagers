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

// TODO update to include health, soon
// export class UnitCombat {
//   hp: number;
//   damage: number;
// }

// export class UnitClass {
//   category: UNIT_CATEGORY;
//   class: UNIT_CLASS;
//   cost: number;
//   combat: UnitCombat;
//   movement: UnitMovement;
// }
