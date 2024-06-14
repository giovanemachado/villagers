/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  MatchState,
  MatchStateUnitsMovement,
  MatchStateUpdate,
} from 'src/match-states/dto/match-state.dto';
import { UnitsService } from '../units.service';
import * as lod from 'lodash';

type UpdateUnitsMovementParams = {
  currentMatchState: Pick<MatchState, 'unitsMovement' | 'turns'>;
  playerId: string;
  matchStateUpdate: Pick<MatchStateUpdate, 'unitsMovement'>;
  players: string[];
};

describe('UnitsService', () => {
  let unitsService: UnitsService;

  beforeEach(() => {
    unitsService = new UnitsService();
  });

  describe('updateUnitsMovement', () => {
    const playerA = 'player-a';
    const playerB = 'player-b';

    const mockUnitMovementBase: MatchStateUnitsMovement = {
      id: 'unit-x', // x, y, z
      localization: 'localization-1',
      previousLocalization: 'localization-1',
      playerId: 'player-a', // a,  b
      movedInTurn: false,
    };

    const unitAX: MatchStateUnitsMovement = {
      ...mockUnitMovementBase,
      id: 'unit-ax',
      localization: 'localization-1',
      previousLocalization: 'localization-0',
    };
    const unitAY: MatchStateUnitsMovement = {
      ...mockUnitMovementBase,
      id: 'unit-ay',
      localization: 'localization-3',
      previousLocalization: 'localization-2',
    };
    const unitAZ: MatchStateUnitsMovement = {
      ...mockUnitMovementBase,
      id: 'unit-az',
      localization: 'localization-5',
      previousLocalization: 'localization-4',
    };
    const unitBX: MatchStateUnitsMovement = {
      ...mockUnitMovementBase,
      id: 'unit-bx',
      playerId: playerB,
      localization: 'localization-7',
      previousLocalization: 'localization-6',
    };
    const unitBY: MatchStateUnitsMovement = {
      ...mockUnitMovementBase,
      id: 'unit-by',
      playerId: playerB,
      localization: 'localization-9',
      previousLocalization: 'localization-8',
    };

    const mockParamsBase: {
      currentMatchState: Pick<MatchState, 'unitsMovement' | 'turns'>;
      playerId: string;
      matchStateUpdate: Pick<MatchStateUpdate, 'unitsMovement'>;
      players: string[];
    } = {
      currentMatchState: {
        turns: 1,
        unitsMovement: [unitAX, unitAY, unitAZ, unitBX, unitBY],
      },
      playerId: playerA,
      matchStateUpdate: { unitsMovement: [] },
      players: [playerA, playerB],
    };

    // best scenario, where no units are moving to the same spot
    it('move units from player', () => {
      const unitAXNewLocalization: MatchStateUnitsMovement = {
        ...unitAX,
        localization: 'localization-2',
        movedInTurn: true,
      };
      const unitAYNewLocalization: MatchStateUnitsMovement = {
        ...unitAY,
        localization: 'localization-4',
        movedInTurn: true,
      };
      const unitBXNewLocalization: MatchStateUnitsMovement = {
        ...unitBX,
        localization: 'localization-10',
        movedInTurn: true,
      };
      const unitBYNewLocalization: MatchStateUnitsMovement = {
        ...unitBY,
        localization: 'localization-11',
        movedInTurn: true,
      };
      const paramsPlayerA: UpdateUnitsMovementParams = {
        ...mockParamsBase,
        matchStateUpdate: {
          unitsMovement: [unitAXNewLocalization, unitAYNewLocalization],
        },
      };
      const paramsPlayerB: UpdateUnitsMovementParams = {
        ...mockParamsBase,
        playerId: playerB,
        matchStateUpdate: {
          unitsMovement: [unitBXNewLocalization, unitBYNewLocalization],
        },
      };
      const resultPlayerA: MatchStateUnitsMovement[] = [
        {
          ...unitAXNewLocalization,
          localization: 'localization-2',
          previousLocalization: 'localization-1',
          movedInTurn: false,
        },
        {
          ...unitAYNewLocalization,
          localization: 'localization-4',
          previousLocalization: 'localization-3',
          movedInTurn: false,
        },
        unitAZ,
        unitBX,
        unitBY,
      ];
      const resultPlayerB: MatchStateUnitsMovement[] = [
        unitAX,
        unitAY,
        unitAZ,
        {
          ...unitBXNewLocalization,
          localization: 'localization-10',
          previousLocalization: 'localization-7',
          movedInTurn: false,
        },
        {
          ...unitBYNewLocalization,
          localization: 'localization-11',
          previousLocalization: 'localization-9',
          movedInTurn: false,
        },
      ];
      const resultPlayerANoMoves: MatchStateUnitsMovement[] = [
        unitAX,
        unitAY,
        unitAZ,
        unitBX,
        unitBY,
      ];
      const resultPlayerAMovesInBsTurn: MatchStateUnitsMovement[] = [
        unitAX,
        unitAY,
        unitAZ,
        unitBX,
        unitBY,
      ];

      const paramsPlayerACurrentMatchState = lod.cloneDeep(
        paramsPlayerA.currentMatchState,
      );
      const paramsPlayerAMatchStateUpdate = lod.cloneDeep(
        paramsPlayerA.matchStateUpdate,
      );

      const paramsPlayerBCurrentMatchState = lod.cloneDeep(
        paramsPlayerB.currentMatchState,
      );
      const paramsPlayerBMatchStateUpdate = lod.cloneDeep(
        paramsPlayerB.matchStateUpdate,
      );

      const paramsPlayerANoMoveCurrentMatchState = lod.cloneDeep({
        ...mockParamsBase.currentMatchState,
      });
      const paramsPlayerANoMoveMatchStateUpdate = lod.cloneDeep({
        unitsMovement: [],
      });

      const paramsPlayerANotHisTurnCurrentMatchState = lod.cloneDeep({
        ...paramsPlayerA.currentMatchState,
      });
      const paramsPlayerANotHisTurnMatchStateUpdate = lod.cloneDeep({
        ...paramsPlayerA.matchStateUpdate,
        unitsMovement: paramsPlayerB.matchStateUpdate.unitsMovement,
      });

      // Player A move his units
      expect(
        unitsService.updateUnitsMovement(
          paramsPlayerACurrentMatchState,
          paramsPlayerA.playerId,
          paramsPlayerAMatchStateUpdate,
          paramsPlayerA.players,
        ),
      ).toStrictEqual(resultPlayerA);

      // Player B move his units
      expect(
        unitsService.updateUnitsMovement(
          paramsPlayerBCurrentMatchState,
          paramsPlayerB.playerId,
          paramsPlayerBMatchStateUpdate,
          paramsPlayerB.players,
        ),
      ).toStrictEqual(resultPlayerB);

      // Player A doesnt move any unit
      expect(
        unitsService.updateUnitsMovement(
          paramsPlayerANoMoveCurrentMatchState,
          paramsPlayerA.playerId,
          paramsPlayerANoMoveMatchStateUpdate,
          paramsPlayerA.players,
        ),
      ).toStrictEqual(resultPlayerANoMoves);

      // Player A try move units in Bs turn (aka via API Player B moves As units, not possible via UI)
      expect(
        unitsService.updateUnitsMovement(
          paramsPlayerANotHisTurnCurrentMatchState,
          paramsPlayerA.playerId,
          paramsPlayerANotHisTurnMatchStateUpdate,
          paramsPlayerA.players,
        ),
      ).toStrictEqual(resultPlayerAMovesInBsTurn);
    });

    it('dont move units from player without priority if conflicts', () => {
      const unitAXNewLocalization: MatchStateUnitsMovement = {
        ...unitAX,
        localization: 'localization-7',
        movedInTurn: true,
      };

      const unitAYNewLocalization: MatchStateUnitsMovement = {
        ...unitAY,
        localization: 'localization-9',
        movedInTurn: true,
      };

      const resultPlayerA: MatchStateUnitsMovement[] = [
        {
          ...unitAXNewLocalization,
          localization: 'localization-1',
          previousLocalization: 'localization-1',
          movedInTurn: false,
        },
        {
          ...unitAYNewLocalization,
          localization: 'localization-3',
          previousLocalization: 'localization-3',
          movedInTurn: false,
        },
        unitAZ,
        unitBX,
        unitBY,
      ];

      const oddTurn = 5; // priority player b

      const paramsPlayerA: UpdateUnitsMovementParams = {
        ...mockParamsBase,
        currentMatchState: {
          ...mockParamsBase.currentMatchState,
          turns: oddTurn,
        },
        matchStateUpdate: {
          unitsMovement: [unitAXNewLocalization, unitAYNewLocalization],
        },
      };

      expect(
        unitsService.updateUnitsMovement(
          lod.cloneDeep(paramsPlayerA.currentMatchState),
          paramsPlayerA.playerId,
          lod.cloneDeep(paramsPlayerA.matchStateUpdate),
          paramsPlayerA.players,
        ),
      ).toStrictEqual(resultPlayerA);
    });
  });
});
