import { Injectable } from '@nestjs/common';
import { MatchStateUnitsMovement } from 'src/match-states/dto/match-state.dto';
import { UnitCombatInformation, UNIT_CLASS } from './dto/unit-data.dto';
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

    const combatInformationOfPriorityPlayer: UnitCombatInformation[] =
      this.getCombatInformation(updatedUnitsWithoutConflicts, priorityPlayer);

    const killedUnits: UnitCombatInformation[] = [];

    updatedUnitsWithoutConflicts.forEach((killerUnit) => {
      const unitsKilled = this.getKilledUnitsPerUnit(
        killerUnit,
        combatInformationOfPriorityPlayer,
        priorityPlayer,
      );

      if (unitsKilled) {
        killedUnits.push(unitsKilled);
      }
    });

    const killedUnitsIds = killedUnits.map((killedUnit) => {
      return killedUnit.id;
    });

    const survivorUnits = updatedUnitsWithoutConflicts.filter(
      (survivorUnit) => !killedUnitsIds.includes(survivorUnit.id),
    );

    return survivorUnits;
  }

  private getCombatInformation(
    unitsMovement: MatchStateUnitsMovement[],
    playerId: string,
  ): UnitCombatInformation[] {
    const combatInformation: UnitCombatInformation[] = [];

    unitsMovement.forEach((unitMovement) => {
      if (unitMovement.playerId != playerId) {
        return;
      }

      const unitClass = unitMovement.id.split('-')[0]; // TODO get class

      // TODO remove structures in a better way
      if (
        unitClass == UNIT_CLASS.CASTLE ||
        unitClass == UNIT_CLASS.WALL ||
        unitClass == UNIT_CLASS.GATE
      ) {
        return;
      }

      combatInformation.push(
        {
          localization: this.getAroundLocalizations(
            1,
            unitMovement.localization,
          ),
          class: unitClass,
          id: unitMovement.id,
        }, // TODO get actual distance here
      );
    });

    return lod.flatten(combatInformation);
  }

  private getKilledUnitsPerUnit(
    killerUnit: MatchStateUnitsMovement,
    unitCombatInformation: UnitCombatInformation[],
    priorityPlayer: string,
  ): UnitCombatInformation | undefined {
    const isPriorityPlayerUnits = killerUnit.playerId == priorityPlayer;

    const isInKilledLocalizationsByKillerClass = unitCombatInformation.find(
      (mightBeKilledUnit) => {
        const isInKilledLocalizations =
          mightBeKilledUnit.localization.includes(killerUnit.localization) ||
          mightBeKilledUnit.localization.includes(
            killerUnit.previousLocalization,
          );

        const killerUnitClass = killerUnit.id.split('-')[0];

        const archerKilled =
          mightBeKilledUnit.class == UNIT_CLASS.ARCHER &&
          (killerUnitClass == UNIT_CLASS.ARCHER ||
            killerUnitClass == UNIT_CLASS.HORSEMAN);

        const horsermanKilled =
          mightBeKilledUnit.class == UNIT_CLASS.HORSEMAN &&
          (killerUnitClass == UNIT_CLASS.HORSEMAN ||
            killerUnitClass == UNIT_CLASS.SPEARMAN);

        const spearManKilled =
          mightBeKilledUnit.class == UNIT_CLASS.SPEARMAN &&
          (killerUnitClass == UNIT_CLASS.SPEARMAN ||
            killerUnitClass == UNIT_CLASS.ARCHER);

        const isKilledByClass =
          archerKilled || horsermanKilled || spearManKilled;

        return isInKilledLocalizations && isKilledByClass;
      },
    );

    if (
      !isPriorityPlayerUnits &&
      isInKilledLocalizationsByKillerClass != null
    ) {
      return isInKilledLocalizationsByKillerClass;
    }
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
}
