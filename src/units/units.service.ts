import { Injectable } from '@nestjs/common';
import {
  UNIT_CATEGORY,
  UNIT_CLASS,
  UnitData,
  UnitMovement,
} from './dto/unit-data.dto';

@Injectable()
export class UnitsService {
  generateStaticUnit(unitClass: UNIT_CLASS): UnitData {
    let unitTag: UNIT_CLASS = UNIT_CLASS.ARCHER;
    let unitCategory: UNIT_CATEGORY = UNIT_CATEGORY.MILITARY;
    let unitMovement: UnitMovement = {
      distance: 1,
      localization: '',
    };

    switch (unitClass) {
      case UNIT_CLASS.ARCHER:
        unitTag = UNIT_CLASS.ARCHER;
        unitCategory = UNIT_CATEGORY.MILITARY;
        break;
      case UNIT_CLASS.HORSEMAN:
        unitTag = UNIT_CLASS.HORSEMAN;
        unitCategory = UNIT_CATEGORY.MILITARY;
        break;
      case UNIT_CLASS.SPEARMAN:
        unitTag = UNIT_CLASS.SPEARMAN;
        unitCategory = UNIT_CATEGORY.MILITARY;
        break;
      case UNIT_CLASS.CASTLE:
        unitTag = UNIT_CLASS.CASTLE;
        unitCategory = UNIT_CATEGORY.STRUCTURE;
        unitMovement.distance = 0;
        break;
      case UNIT_CLASS.WALL:
        unitTag = UNIT_CLASS.WALL;
        unitCategory = UNIT_CATEGORY.STRUCTURE;
        unitMovement.distance = 0;
        break;
      case UNIT_CLASS.GATE:
        unitTag = UNIT_CLASS.GATE;
        unitCategory = UNIT_CATEGORY.STRUCTURE;
        unitMovement.distance = 0;
        break;
    }

    return {
      id: '',
      class: unitTag,
      category: unitCategory,
      movement: unitMovement,
      movementInTurn: {
        turn: 0,
        moved: false,
      },
    };
  }
}
