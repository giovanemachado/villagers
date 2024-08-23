import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { MatchStateUnitsMovement } from 'src/match-states/dto/match-state.dto';
import { UNIT_CLASS } from './dto/unit-data.dto';
import * as lod from 'lodash';
import { UnitsService } from './units.service';

@Injectable()
export class CombatsService {
  constructor(private unitsService: UnitsService) {}

  resolveUnitsCombat(
    updatedUnitsWithoutConflicts: MatchStateUnitsMovement[],
    players: string[],
    turns: number,
  ): MatchStateUnitsMovement[] {
    const priorityPlayer = this.getPriorityPlayerInTurn(turns, players);

    const killedUnitsIds: string[] = [];

    updatedUnitsWithoutConflicts.forEach((killerUnit) => {
      const killedUnitId = this.checkIfUnitIsKilledByOthers(
        killerUnit,
        priorityPlayer,
        updatedUnitsWithoutConflicts,
      );

      if (killedUnitId) {
        killedUnitsIds.push(killedUnitId);
      }
    });

    const survivorUnits = updatedUnitsWithoutConflicts.filter(
      (survivorUnit) => !killedUnitsIds.includes(survivorUnit.id),
    );

    return survivorUnits;
  }

  private checkIfUnitIsKilledByOthers(
    mightBeKilledUnit: MatchStateUnitsMovement,
    priorityPlayer: string,
    updatedUnitsWithoutConflicts: MatchStateUnitsMovement[],
  ): string | undefined {
    let killedUnitId: any;

    for (const possibleKillerUnit of updatedUnitsWithoutConflicts) {
      if (killedUnitId != undefined) {
        break;
      }

      const killerUnitClass = possibleKillerUnit.id.split('-')[0];
      const mightBeKilledUnitClass = mightBeKilledUnit.id.split('-')[0];

      if (
        possibleKillerUnit.id == mightBeKilledUnit.id ||
        possibleKillerUnit.playerId == mightBeKilledUnit.playerId ||
        this.isStructure(killerUnitClass) ||
        this.isStructure(mightBeKilledUnitClass)
      ) {
        continue;
      }

      const classesThatCanBeKilled = this.classesThisUnitCanKill(
        killerUnitClass as UNIT_CLASS,
        possibleKillerUnit.playerId == priorityPlayer,
      );

      const isInKilledLocalizations = this.getAroundLocalizations(
        1,
        possibleKillerUnit.localization,
      ).includes(mightBeKilledUnit.localization);

      if (
        isInKilledLocalizations &&
        classesThatCanBeKilled.includes(mightBeKilledUnitClass as UNIT_CLASS)
      ) {
        killedUnitId = mightBeKilledUnit.id;
        break;
      }
    }

    return killedUnitId;
  }

  private getAroundLocalizations(distance: number, localization: string) {
    // TODO use this method to get reachable pos
    const { rowId, colId } = this.unitsService.getLocalizationIds(localization);

    const leftMovement = this.unitsService.createSquareId(
      rowId,
      colId - distance,
    );
    const rightMovement = this.unitsService.createSquareId(
      rowId,
      colId + distance,
    );
    const upMovement = this.unitsService.createSquareId(
      rowId - distance,
      colId,
    );
    const downMovement = this.unitsService.createSquareId(
      rowId + distance,
      colId,
    );

    return lod.uniq([leftMovement, rightMovement, upMovement, downMovement]);
  }

  // TODO duplicated from units service
  private getPriorityPlayerInTurn(turns: number, players: string[]) {
    return turns % 2 === 0 ? players[0] : players[1];
  }

  private classesThisUnitCanKill(
    unitClass: UNIT_CLASS,
    isPriorityTurn: boolean,
  ): UNIT_CLASS[] {
    const classesThisUnitCanKill = [];

    if (unitClass == UNIT_CLASS.ARCHER) {
      classesThisUnitCanKill.push(UNIT_CLASS.SPEARMAN);
    }

    if (unitClass == UNIT_CLASS.SPEARMAN) {
      classesThisUnitCanKill.push(UNIT_CLASS.HORSEMAN);
    }

    if (unitClass == UNIT_CLASS.HORSEMAN) {
      classesThisUnitCanKill.push(UNIT_CLASS.ARCHER);
    }

    if (isPriorityTurn) {
      classesThisUnitCanKill.push(unitClass);
    }

    return classesThisUnitCanKill;
  }

  private isStructure(unitClass: string): boolean {
    if (!(<any>Object).values(UNIT_CLASS).includes(unitClass)) {
      throw new UnprocessableEntityException('Unknown unit class');
    }

    if (
      unitClass == UNIT_CLASS.CASTLE ||
      unitClass == UNIT_CLASS.WALL ||
      unitClass == UNIT_CLASS.GATE
    ) {
      return true;
    }

    return false;
  }
}
