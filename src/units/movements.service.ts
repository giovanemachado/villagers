import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MatchState } from '@prisma/client';
import {
  MatchStateUpdate,
  MatchStateUnitsMovement,
} from 'src/match-states/dto/match-state.dto';
import { UNIT_CLASS, UnitData } from 'src/units/dto/unit-data.dto';
import * as lod from 'lodash';
// TODO fix imports when file has tests (it failes for jest)
import { ERROR_MESSAGE } from '../errors/messages';
import { UnitsService } from 'src/units/units.service';

@Injectable()
export class MovementsService {
  constructor(private unitsService: UnitsService) {}
  /**
   * Units movement rules
   *  1. 2 Units can never be in the same localization
   *  2. Player with priority resolves first (use odd and even turns for now)
   *  3. If a Unit try to move to an ocuppied position, it returns to the original position
   *  4. Units never can move to an occupied position (this covers cases where unit A is not moving, but B tries to move into A position)
   */
  updateUnitsMovement(
    currentMatchState: Pick<MatchState, 'unitsMovement' | 'turns'>,
    playerId: string,
    matchStateUpdate: Pick<MatchStateUpdate, 'unitsMovement'>,
    players: string[],
    unitsInMap: UnitData[],
  ): MatchStateUnitsMovement[] {
    const priorityPlayer = this.getPriorityPlayerInTurn(
      currentMatchState.turns,
      players,
    );

    const currentPlayerUnitsForUpdate =
      this.unitsService.getUnitsFromCurrentPlayer(matchStateUpdate, playerId);

    const updatedUnits = this.updateUnitsLocalization(
      currentPlayerUnitsForUpdate,
      currentMatchState as any,
    );

    const updatedUnitsWithoutConflicts = this.resolveUnitsLocalizationConflicts(
      updatedUnits,
      priorityPlayer,
    );

    const unitsMovement = this.updateReachableLocalizationsInUnits(
      updatedUnitsWithoutConflicts,
      unitsInMap,
    );

    return unitsMovement;
  }

  updateReachableLocalizationsInUnits(
    unitsMovement: MatchStateUnitsMovement[],
    unitsInMap: UnitData[],
  ) {
    const unitsInStore: UnitData[] = Array.from(unitsInMap);

    unitsMovement.forEach((unitMovement) => {
      unitMovement.reachableLocalizations = this.getCanBeReached(
        unitsMovement,
        unitMovement.id,
        unitsInMap,
        unitsInStore,
      );
    });

    return unitsMovement;
  }

  private updateUnitsLocalization(
    unitsToUpdateOfCurrentPlayer: MatchStateUnitsMovement[],
    currentMatchState: Pick<MatchStateUpdate, 'unitsMovement'>,
  ): MatchStateUnitsMovement[] {
    const currentUnitsToUpdate: MatchStateUnitsMovement[] = [];
    const unitsToAdd: MatchStateUnitsMovement[] = [];

    unitsToUpdateOfCurrentPlayer.forEach((unitToUpdate) => {
      const unitInCurrentState = currentMatchState.unitsMovement.find(
        (u) => u.id == unitToUpdate.id,
      );

      if (!unitInCurrentState) {
        unitsToAdd.push({ ...unitToUpdate, movedInTurn: false });
        return;
      }

      unitInCurrentState.previousLocalization = unitInCurrentState.localization;
      unitInCurrentState.localization = unitToUpdate.localization;

      // this is set to true on front, during the turn
      unitInCurrentState.movedInTurn = false;
      currentUnitsToUpdate.push(unitInCurrentState);
    });

    return lod.uniqBy(
      [
        ...currentMatchState.unitsMovement,
        ...currentUnitsToUpdate,
        ...unitsToAdd,
      ],
      'id',
    );
  }

  private resolveUnitsLocalizationConflicts(
    unitsMovement: MatchStateUnitsMovement[],
    priorityPlayer: string,
  ): MatchStateUnitsMovement[] {
    let safetyCounter = 0;

    let unitsToReturn: MatchStateUnitsMovement[] = this.getUnitsForFallback(
      unitsMovement,
      priorityPlayer,
    );

    while (unitsToReturn.length > 0) {
      // TODO not the greatest, hopefully I can come up with 2 thousand tests to this or a better safer implementation
      safetyCounter++;
      if (safetyCounter > 500) {
        throw new InternalServerErrorException(
          { unitsMovement },
          ERROR_MESSAGE.unitMovementUpdateIsStuck,
        );
      }
      unitsMovement.forEach((unitMovement) => {
        const unitToReturn = unitsToReturn.find(
          (unitToReturn) => unitToReturn.id == unitMovement.id,
        );

        if (unitToReturn) {
          unitMovement.localization = unitMovement.previousLocalization;
        }
      });

      unitsToReturn = this.getUnitsForFallback(unitsMovement, priorityPlayer);
    }

    return unitsMovement;
  }

  private getUnitsForFallback(
    unitsMovement: MatchStateUnitsMovement[],
    priorityPlayer: string,
  ): MatchStateUnitsMovement[] {
    const unitsByLocalization: { [key: string]: MatchStateUnitsMovement[] } =
      {};
    const allLocalizations: string[] = [];

    unitsMovement.forEach((unitMovement) => {
      if (!unitsByLocalization[unitMovement.localization]) {
        unitsByLocalization[unitMovement.localization] = [];
      }

      unitsByLocalization[unitMovement.localization].push(unitMovement);
      allLocalizations.push(unitMovement.localization);
    });

    const uniqueLocalizations = lod.uniq(allLocalizations);
    const unitsToReturn: MatchStateUnitsMovement[] = [];

    uniqueLocalizations.forEach((localization) => {
      const unitsInLocalization = unitsByLocalization[localization];

      if (unitsInLocalization.length < 2) {
        return;
      }

      unitsInLocalization.forEach((unitInLocalization) => {
        if (unitInLocalization.playerId == priorityPlayer) {
          return;
        }

        unitsToReturn.push(unitInLocalization);
      });
    });

    return unitsToReturn;
  }

  // TODO duplicated from units service
  private getPriorityPlayerInTurn(turns: number, players: string[]) {
    return turns % 2 === 0 ? players[0] : players[1];
  }

  private getCanBeReached(
    unitsMovement: MatchStateUnitsMovement[],
    unitId: string,
    unitsInMap: UnitData[],
    unitsInStore: UnitData[],
  ): string[] {
    const unitInStoreIndex = this.unitsService.getUnitDataIndex(
      unitsInMap,
      unitId,
    );

    const unitInStoreIndexD = this.unitsService.getUnitIndex(
      unitsMovement,
      unitId,
    );
    const currentLocalization = unitsMovement[unitInStoreIndexD].localization;

    const { distance } = unitsInStore[unitInStoreIndex].movement;

    const { rowId, colId } =
      this.unitsService.getLocalizationIds(currentLocalization);

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

    const gateUnitReachable = unitsInStore.find(
      (unit) =>
        unit.class === UNIT_CLASS.GATE &&
        [leftMovement, rightMovement, upMovement, downMovement].includes(
          unit.movement.initialLocalization,
        ),
    );

    let upMovementGate = '';
    let downMovementGate = '';

    if (gateUnitReachable) {
      const { rowId, colId } = this.unitsService.getLocalizationIds(
        gateUnitReachable.movement.initialLocalization,
      );
      upMovementGate = this.unitsService.createSquareId(rowId - 1, colId);
      downMovementGate = this.unitsService.createSquareId(rowId + 1, colId);
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
}
