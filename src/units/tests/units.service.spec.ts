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

    describe('no units are moving to the same spot', () => {
      it('Player A move his units', () => {
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
        const paramsPlayerACurrentMatchState = lod.cloneDeep(
          paramsPlayerA.currentMatchState,
        );
        const paramsPlayerAMatchStateUpdate = lod.cloneDeep(
          paramsPlayerA.matchStateUpdate,
        );

        // Player A move his units
        expect(
          unitsService.updateUnitsMovement(
            paramsPlayerACurrentMatchState,
            paramsPlayerA.playerId,
            paramsPlayerAMatchStateUpdate,
            paramsPlayerA.players,
          ),
        ).toStrictEqual(resultPlayerA);
      });

      it('Player B move his units', () => {
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
        const paramsPlayerB: UpdateUnitsMovementParams = {
          ...mockParamsBase,
          playerId: playerB,
          matchStateUpdate: {
            unitsMovement: [unitBXNewLocalization, unitBYNewLocalization],
          },
        };

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

        const paramsPlayerBCurrentMatchState = lod.cloneDeep(
          paramsPlayerB.currentMatchState,
        );
        const paramsPlayerBMatchStateUpdate = lod.cloneDeep(
          paramsPlayerB.matchStateUpdate,
        );

        expect(
          unitsService.updateUnitsMovement(
            paramsPlayerBCurrentMatchState,
            paramsPlayerB.playerId,
            paramsPlayerBMatchStateUpdate,
            paramsPlayerB.players,
          ),
        ).toStrictEqual(resultPlayerB);
      });

      it('Player A doesnt move any unit', () => {
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
        const paramsPlayerA: UpdateUnitsMovementParams = {
          ...mockParamsBase,
          matchStateUpdate: {
            unitsMovement: [unitAXNewLocalization, unitAYNewLocalization],
          },
        };
        const resultPlayerANoMoves: MatchStateUnitsMovement[] = [
          unitAX,
          unitAY,
          unitAZ,
          unitBX,
          unitBY,
        ];

        const paramsPlayerANoMoveCurrentMatchState = lod.cloneDeep({
          ...mockParamsBase.currentMatchState,
        });
        const paramsPlayerANoMoveMatchStateUpdate = lod.cloneDeep({
          unitsMovement: [],
        });

        // Player A doesnt move any unit
        expect(
          unitsService.updateUnitsMovement(
            paramsPlayerANoMoveCurrentMatchState,
            paramsPlayerA.playerId,
            paramsPlayerANoMoveMatchStateUpdate,
            paramsPlayerA.players,
          ),
        ).toStrictEqual(resultPlayerANoMoves);
      });

      it('Player A try move units in Bs turn (aka via API Player B moves As units, not possible via UI)', () => {
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
        const resultPlayerAMovesInBsTurn: MatchStateUnitsMovement[] = [
          unitAX,
          unitAY,
          unitAZ,
          unitBX,
          unitBY,
        ];
        const paramsPlayerANotHisTurnCurrentMatchState = lod.cloneDeep({
          ...paramsPlayerA.currentMatchState,
        });
        const paramsPlayerANotHisTurnMatchStateUpdate = lod.cloneDeep({
          ...paramsPlayerA.matchStateUpdate,
          unitsMovement: paramsPlayerB.matchStateUpdate.unitsMovement,
        });

        expect(
          unitsService.updateUnitsMovement(
            paramsPlayerANotHisTurnCurrentMatchState,
            paramsPlayerA.playerId,
            paramsPlayerANotHisTurnMatchStateUpdate,
            paramsPlayerA.players,
          ),
        ).toStrictEqual(resultPlayerAMovesInBsTurn);
      });
    });

    describe('units moving to the same spot', () => {
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

        // Player A move two units to ocuppied (by Bs units) positions
        expect(
          unitsService.updateUnitsMovement(
            lod.cloneDeep(paramsPlayerA.currentMatchState),
            paramsPlayerA.playerId,
            lod.cloneDeep(paramsPlayerA.matchStateUpdate),
            paramsPlayerA.players,
          ),
        ).toStrictEqual(resultPlayerA);
      });

      it('Player A move two units to free positions, then Player B move its units to the same positions with priority', () => {
        const unitAXNewLocalization: MatchStateUnitsMovement = {
          ...unitAX,
          localization: 'localization-10',
          movedInTurn: true,
        };

        const unitAYNewLocalization: MatchStateUnitsMovement = {
          ...unitAY,
          localization: 'localization-11',
          movedInTurn: true,
        };

        const resultPlayerA: MatchStateUnitsMovement[] = [
          {
            ...unitAXNewLocalization,
            localization: 'localization-10',
            previousLocalization: 'localization-1',
            movedInTurn: false,
          },
          {
            ...unitAYNewLocalization,
            localization: 'localization-11',
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

        const unitsMovementAfterPlayerA = unitsService.updateUnitsMovement(
          lod.cloneDeep(paramsPlayerA.currentMatchState),
          paramsPlayerA.playerId,
          lod.cloneDeep(paramsPlayerA.matchStateUpdate),
          paramsPlayerA.players,
        );
        expect(unitsMovementAfterPlayerA).toStrictEqual(resultPlayerA);

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

        const resultPlayerB: MatchStateUnitsMovement[] = [
          {
            ...unitAX,
            previousLocalization: 'localization-1',
          },
          {
            ...unitAY,
            previousLocalization: 'localization-3',
          },
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

        const paramsPlayerB: UpdateUnitsMovementParams = {
          ...mockParamsBase,
          playerId: playerB,
          currentMatchState: {
            ...mockParamsBase.currentMatchState,
            unitsMovement: unitsMovementAfterPlayerA,
            turns: oddTurn,
          },
          matchStateUpdate: {
            unitsMovement: [unitBXNewLocalization, unitBYNewLocalization],
          },
        };

        expect(
          unitsService.updateUnitsMovement(
            lod.cloneDeep(paramsPlayerB.currentMatchState),
            paramsPlayerB.playerId,
            lod.cloneDeep(paramsPlayerB.matchStateUpdate),
            paramsPlayerB.players,
          ),
        ).toStrictEqual(resultPlayerB);
      });

      it.todo(
        'Player A move one unit to an ocuppied (by Bs units movement) position, and another to first units position (both need to go back)',
      );
    });
  });
});
