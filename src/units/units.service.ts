import { Injectable } from '@nestjs/common';
import {
  UNIT_CATEGORY,
  UNIT_CLASS,
  UnitData,
  UnitMovement,
} from './dto/unit-data.dto';
import { PLAYER_CODE } from '../static-data/definitions/constants';
import {
  MatchState,
  MatchStateUnitsMovement,
  MatchStateUpdate,
} from 'src/match-states/dto/match-state.dto';
import * as lod from 'lodash';

@Injectable()
export class UnitsService {
  generateStaticUnit(unitClass: UNIT_CLASS): UnitData {
    let unitTag: UNIT_CLASS = UNIT_CLASS.ARCHER;
    let unitCategory: UNIT_CATEGORY = UNIT_CATEGORY.MILITARY;
    const unitMovement: UnitMovement = {
      distance: 1,
      initialLocalization: '',
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
  ): MatchStateUnitsMovement[] {
    const priorityPlayer =
      currentMatchState.turns % 2 === 0 ? players[0] : players[1];

    const unitsToUpdateOfCurrentPlayer = this.getUnitsFromCurrentPlayer(
      matchStateUpdate,
      playerId,
    );

    const currentUnitsUpdated = this.updateCurrentUnits(
      unitsToUpdateOfCurrentPlayer,
      currentMatchState,
    );

    const updateCurrentUnitsWithConflict =
      this.updateUnitsMovementFixingConflicts(
        currentUnitsUpdated,
        priorityPlayer,
      );

    return updateCurrentUnitsWithConflict;
  }

  private getUnitsFromCurrentPlayer(
    matchStateUpdate: Pick<MatchStateUpdate, 'unitsMovement'>,
    playerId: string,
  ): MatchStateUnitsMovement[] {
    const unitsToUpdateOfCurrentPlayer: MatchStateUnitsMovement[] = [];

    matchStateUpdate.unitsMovement.forEach((unitToUpdate) => {
      if (unitToUpdate.playerId != playerId) {
        return;
      }

      unitsToUpdateOfCurrentPlayer.push(unitToUpdate);
    });

    return unitsToUpdateOfCurrentPlayer;
  }

  private updateCurrentUnits(
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

  private updateUnitsMovementFixingConflicts(
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

    unitsMovement.forEach((unitMovement) => {
      const unitToReturn = unitsToReturn.find(
        (unitToReturn) => unitToReturn.id == unitMovement.id,
      );

      if (unitToReturn) {
        unitMovement.localization = unitMovement.previousLocalization;
      }
    });

    return unitsMovement;
  }
}
