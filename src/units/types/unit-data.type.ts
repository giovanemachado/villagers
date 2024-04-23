export enum UNIT_CATEGORY {
  MILITARY = 'initial-map',
  STRUCTURE = 'initial-map',
}

export enum UNIT_CLASS {
  CASTLE = 'castle',
  GATE = 'gate',
  ARCHER = 'archer',
  SPEARMAN = 'spearman',
  HORSEMAN = 'horseman',
  WALL = 'wall',
}

export type UnitData = {
  id: string;
  category: UNIT_CATEGORY;
  class: UNIT_CLASS;
};
