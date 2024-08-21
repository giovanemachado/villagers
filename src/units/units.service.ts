import { Injectable } from '@nestjs/common';
import {
  UNIT_CATEGORY,
  UNIT_CLASS,
  UnitData,
  UnitMovement,
} from './dto/unit-data.dto';
import { PLAYER_CODE } from '../static-data/definitions/constants';
import {
  MatchStateUnitsMovement,
  MatchStateUpdate,
} from 'src/match-states/dto/match-state.dto';
import { StaticDataService } from '../static-data/static-data.service';
// TODO fix imports when file has tests (it failes for jest)
import { MAPS } from '../static-data/types/maps.enum';

@Injectable()
export class UnitsService {
  constructor(private staticDataService: StaticDataService) {}

  generateStaticUnit(unitClass: UNIT_CLASS): UnitData {
    let unitTag: UNIT_CLASS = UNIT_CLASS.ARCHER;
    let unitCategory: UNIT_CATEGORY = UNIT_CATEGORY.MILITARY;
    const unitMovement: UnitMovement = {
      distance: 1,
      initialLocalization: '',
      initialReachableLocalizations: [],
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
      playerId: '',
      category: unitCategory,
      movement: unitMovement,
    };
  }

  setUnitsToPlayers(units: UnitData[], playerIds: string[]) {
    units.forEach((unit) => {
      if (unit.playerId == PLAYER_CODE.A) {
        unit.playerId = playerIds[0];
      } else if (unit.playerId == PLAYER_CODE.B) {
        unit.playerId = playerIds[1];
      }
    });

    return units;
  }

  async getUnitsInMap(players?: string[]): Promise<UnitData[]> {
    const mapName = MAPS.COMBAT_TEST;

    const { units } = await this.staticDataService.getStaticResource(
      'maps',
      `${mapName}.json`,
    );

    if (players) {
      return this.setUnitsToPlayers(units, players);
    }

    return units;
  }

  // TODO remove duplicated code from above getCanBeReached method
  getReachableLocalizationsForUnit(
    unitId: string,
    unitsInMap: UnitData[],
  ): string[] {
    const unitInStoreIndex = this.getUnitDataIndex(unitsInMap, unitId);

    const currentLocalization = unitsInMap.find((u) => u.id == unitId)?.movement
      .initialLocalization;

    if (!currentLocalization) {
      throw 'failed'; // TODO improve error
    }

    const { distance } = unitsInMap[unitInStoreIndex].movement;

    const { rowId, colId } = this.getLocalizationIds(currentLocalization);

    const leftMovement = this.createSquareId(rowId, colId - distance);
    const rightMovement = this.createSquareId(rowId, colId + distance);
    const upMovement = this.createSquareId(rowId - distance, colId);
    const downMovement = this.createSquareId(rowId + distance, colId);

    const gateUnitReachable = unitsInMap.find(
      (unit) =>
        unit.class === UNIT_CLASS.GATE &&
        [leftMovement, rightMovement, upMovement, downMovement].includes(
          unit.movement.initialLocalization,
        ),
    );

    let upMovementGate = '';
    let downMovementGate = '';

    if (gateUnitReachable) {
      const { rowId, colId } = this.getLocalizationIds(
        gateUnitReachable.movement.initialLocalization,
      );
      upMovementGate = this.createSquareId(rowId - 1, colId);
      downMovementGate = this.createSquareId(rowId + 1, colId);
    }

    return [
      leftMovement,
      rightMovement,
      upMovement,
      downMovement,
      upMovementGate,
      downMovementGate,
    ].filter((u) => !!u);
  }

  getUnitDataIndex = (units: UnitData[], unitId: string): number => {
    const unitIndex = units.findIndex((unit) => unit.id === unitId);

    if (unitIndex == -1) {
      throw 'No unitDataIndex';
    }

    return unitIndex;
  };

  getLocalizationIds(localization: string) {
    const ids = localization.split('_')[1].split('-');
    const rowId = +ids[0];
    const colId = +ids[1];

    return { rowId, colId };
  }

  createSquareId(rowId: number, colId: number) {
    return `square_${rowId}-${colId}`;
  }

  getUnitIndex(units: MatchStateUnitsMovement[], unitId: string): number {
    const unitIndex = units.findIndex((unit) => unit.id === unitId);

    if (unitIndex == -1) {
      throw 'No unitIndex';
    }

    return unitIndex;
  }

  getUnitsFromCurrentPlayer(
    matchStateUpdate: Pick<MatchStateUpdate, 'unitsMovement'>,
    playerId: string,
  ): MatchStateUnitsMovement[] {
    const unitsForUpdate: MatchStateUnitsMovement[] = [];

    matchStateUpdate.unitsMovement.forEach((unitForUpdate) => {
      if (unitForUpdate.playerId != playerId) {
        return;
      }

      unitsForUpdate.push(unitForUpdate);
    });

    return unitsForUpdate;
  }
}
