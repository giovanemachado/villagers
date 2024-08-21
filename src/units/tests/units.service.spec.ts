/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  MatchState,
  MatchStateUnitsMovement,
  MatchStateUpdate,
} from 'src/match-states/dto/match-state.dto';
import { UnitsService } from '../units.service';
import * as lod from 'lodash';
import { StaticDataService } from '../../static-data/static-data.service';
import { UNIT_CATEGORY, UNIT_CLASS } from '../dto/unit-data.dto';
import { localizationsMock, squaresMock, playerB, playerA } from './mocks';

type UpdateUnitsMovementParams = {
  currentMatchState: Pick<MatchState, 'unitsMovement' | 'turns'>;
  playerId: string;
  matchStateUpdate: Pick<MatchStateUpdate, 'unitsMovement'>;
  players: string[];
};

describe('UnitsService', () => {
  let staticDataService: StaticDataService;
  let unitsService: UnitsService;

  beforeEach(() => {
    staticDataService = new StaticDataService();
    unitsService = new UnitsService(staticDataService);
  });

  describe('updateUnitsMovement', () => {
    const mockUnitMovementBase: MatchStateUnitsMovement = {
      id: 'unit-x', // x, y, z
      localization: localizationsMock.one,
      previousLocalization: localizationsMock.one,
      playerId: 'player-a', // a,  b
      movedInTurn: false,
      reachableLocalizations: [],
    };

    const unitAX: MatchStateUnitsMovement = {
      ...mockUnitMovementBase,
      id: 'unit-ax',
      localization: localizationsMock.one,
      previousLocalization: localizationsMock.zero,
      reachableLocalizations: [
        squaresMock.one,
        squaresMock.one,
        squaresMock.one,
        squaresMock.one,
      ],
    };
    const unitAY: MatchStateUnitsMovement = {
      ...mockUnitMovementBase,
      id: 'unit-ay',
      localization: localizationsMock.three,
      previousLocalization: localizationsMock.two,
      reachableLocalizations: [
        squaresMock.three,
        squaresMock.three,
        squaresMock.three,
        squaresMock.three,
      ],
    };
    const unitAZ: MatchStateUnitsMovement = {
      ...mockUnitMovementBase,
      id: 'unit-az',
      localization: localizationsMock.five,
      previousLocalization: localizationsMock.four,
      reachableLocalizations: [
        squaresMock.five,
        squaresMock.five,
        squaresMock.five,
        squaresMock.five,
      ],
    };
    const unitBX: MatchStateUnitsMovement = {
      ...mockUnitMovementBase,
      id: 'unit-bx',
      playerId: playerB,
      localization: localizationsMock.seven,
      previousLocalization: localizationsMock.six,
      reachableLocalizations: [
        squaresMock.seven,
        squaresMock.seven,
        squaresMock.seven,
        squaresMock.seven,
      ],
    };
    const unitBY: MatchStateUnitsMovement = {
      ...mockUnitMovementBase,
      id: 'unit-by',
      playerId: playerB,
      localization: localizationsMock.nine,
      previousLocalization: localizationsMock.eight,
      reachableLocalizations: [
        squaresMock.nine,
        squaresMock.nine,
        squaresMock.nine,
        squaresMock.nine,
      ],
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
    const unitInMapMock = {
      category: UNIT_CATEGORY.MILITARY,
      playerId: 'playerId',
      class: UNIT_CLASS.ARCHER,
      movement: {
        distance: 0,
        initialLocalization: 'some_1-2',
        initialReachableLocalizations: [],
      },
    };

    const unitsInMapMock = [
      {
        id: unitAX.id,
        ...unitInMapMock,
      },
      {
        id: unitAY.id,
        ...unitInMapMock,
      },
      {
        id: unitAZ.id,
        ...unitInMapMock,
      },
      {
        id: unitBX.id,
        ...unitInMapMock,
      },
      {
        id: unitBY.id,
        ...unitInMapMock,
      },
    ];

    describe('no units are moving to the same spot', () => {
      it('Player A move his units', () => {
        const unitAXNewLocalization: MatchStateUnitsMovement = {
          ...unitAX,
          localization: localizationsMock.two,
          movedInTurn: true,
        };
        const unitAYNewLocalization: MatchStateUnitsMovement = {
          ...unitAY,
          localization: localizationsMock.four,
          movedInTurn: true,
        };
        const paramsPlayerA: UpdateUnitsMovementParams = {
          ...mockParamsBase,
          matchStateUpdate: {
            unitsMovement: [unitAXNewLocalization, unitAYNewLocalization],
          },
        };
        const resultPlayerA: MatchStateUnitsMovement[] = [
          {
            ...unitAXNewLocalization,
            localization: localizationsMock.two,
            previousLocalization: localizationsMock.one,
            movedInTurn: false,
            reachableLocalizations: [
              squaresMock.two,
              squaresMock.two,
              squaresMock.two,
              squaresMock.two,
            ],
          },
          {
            ...unitAYNewLocalization,
            localization: localizationsMock.four,
            previousLocalization: localizationsMock.three,
            movedInTurn: false,
            reachableLocalizations: [
              squaresMock.four,
              squaresMock.four,
              squaresMock.four,
              squaresMock.four,
            ],
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
            unitsInMapMock,
          ),
        ).toStrictEqual(resultPlayerA);
      });

      it('Player B move his units', () => {
        const unitBXNewLocalization: MatchStateUnitsMovement = {
          ...unitBX,
          localization: localizationsMock.ten,
          movedInTurn: true,
        };
        const unitBYNewLocalization: MatchStateUnitsMovement = {
          ...unitBY,
          localization: localizationsMock.eleven,
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
            localization: localizationsMock.ten,
            previousLocalization: localizationsMock.seven,
            movedInTurn: false,
            reachableLocalizations: [
              squaresMock.ten,
              squaresMock.ten,
              squaresMock.ten,
              squaresMock.ten,
            ],
          },
          {
            ...unitBYNewLocalization,
            localization: localizationsMock.eleven,
            previousLocalization: localizationsMock.nine,
            movedInTurn: false,
            reachableLocalizations: [
              squaresMock.eleven,
              squaresMock.eleven,
              squaresMock.eleven,
              squaresMock.eleven,
            ],
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
            unitsInMapMock,
          ),
        ).toStrictEqual(resultPlayerB);
      });

      it('Player A doesnt move any unit', () => {
        const unitAXNewLocalization: MatchStateUnitsMovement = {
          ...unitAX,
          localization: localizationsMock.two,
          movedInTurn: true,
        };
        const unitAYNewLocalization: MatchStateUnitsMovement = {
          ...unitAY,
          localization: localizationsMock.four,
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
            unitsInMapMock,
          ),
        ).toStrictEqual(resultPlayerANoMoves);
      });

      it('Player A try move units in Bs turn (aka via API Player B moves As units, not possible via UI)', () => {
        const unitAXNewLocalization: MatchStateUnitsMovement = {
          ...unitAX,
          localization: localizationsMock.two,
          movedInTurn: true,
        };
        const unitAYNewLocalization: MatchStateUnitsMovement = {
          ...unitAY,
          localization: localizationsMock.four,
          movedInTurn: true,
        };
        const unitBXNewLocalization: MatchStateUnitsMovement = {
          ...unitBX,
          localization: localizationsMock.ten,
          movedInTurn: true,
        };
        const unitBYNewLocalization: MatchStateUnitsMovement = {
          ...unitBY,
          localization: localizationsMock.eleven,
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
            unitsInMapMock,
          ),
        ).toStrictEqual(resultPlayerAMovesInBsTurn);
      });
    });

    describe('units moving to the same spot', () => {
      it('dont move units from player without priority if conflicts', () => {
        const unitAXNewLocalization: MatchStateUnitsMovement = {
          ...unitAX,
          localization: localizationsMock.seven,
          movedInTurn: true,
        };

        const unitAYNewLocalization: MatchStateUnitsMovement = {
          ...unitAY,
          localization: localizationsMock.nine,
          movedInTurn: true,
        };

        const resultPlayerA: MatchStateUnitsMovement[] = [
          {
            ...unitAXNewLocalization,
            localization: localizationsMock.one,
            previousLocalization: localizationsMock.one,
            movedInTurn: false,
            reachableLocalizations: [
              squaresMock.one,
              squaresMock.one,
              squaresMock.one,
              squaresMock.one,
            ],
          },
          {
            ...unitAYNewLocalization,
            localization: localizationsMock.three,
            previousLocalization: localizationsMock.three,
            movedInTurn: false,
            reachableLocalizations: [
              squaresMock.three,
              squaresMock.three,
              squaresMock.three,
              squaresMock.three,
            ],
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
            unitsInMapMock,
          ),
        ).toStrictEqual(resultPlayerA);
      });

      it('Player A move two units to free positions, then Player B move its units to the same positions with priority', () => {
        const unitAXNewLocalization: MatchStateUnitsMovement = {
          ...unitAX,
          localization: localizationsMock.ten,
          movedInTurn: true,
        };

        const unitAYNewLocalization: MatchStateUnitsMovement = {
          ...unitAY,
          localization: localizationsMock.eleven,
          movedInTurn: true,
        };

        const resultPlayerA: MatchStateUnitsMovement[] = [
          {
            ...unitAXNewLocalization,
            localization: localizationsMock.ten,
            previousLocalization: localizationsMock.one,
            movedInTurn: false,
            reachableLocalizations: [
              squaresMock.ten,
              squaresMock.ten,
              squaresMock.ten,
              squaresMock.ten,
            ],
          },
          {
            ...unitAYNewLocalization,
            localization: localizationsMock.eleven,
            previousLocalization: localizationsMock.three,
            movedInTurn: false,
            reachableLocalizations: [
              squaresMock.eleven,
              squaresMock.eleven,
              squaresMock.eleven,
              squaresMock.eleven,
            ],
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
          unitsInMapMock,
        );
        expect(unitsMovementAfterPlayerA).toStrictEqual(resultPlayerA);

        const unitBXNewLocalization: MatchStateUnitsMovement = {
          ...unitBX,
          localization: localizationsMock.ten,
          movedInTurn: true,
        };

        const unitBYNewLocalization: MatchStateUnitsMovement = {
          ...unitBY,
          localization: localizationsMock.eleven,
          movedInTurn: true,
        };

        const resultPlayerB: MatchStateUnitsMovement[] = [
          {
            ...unitAX,
            previousLocalization: localizationsMock.one,
          },
          {
            ...unitAY,
            previousLocalization: localizationsMock.three,
          },
          unitAZ,
          {
            ...unitBXNewLocalization,
            localization: localizationsMock.ten,
            previousLocalization: localizationsMock.seven,
            movedInTurn: false,
            reachableLocalizations: [
              squaresMock.ten,
              squaresMock.ten,
              squaresMock.ten,
              squaresMock.ten,
            ],
          },
          {
            ...unitBYNewLocalization,
            localization: localizationsMock.eleven,
            previousLocalization: localizationsMock.nine,
            movedInTurn: false,
            reachableLocalizations: [
              squaresMock.eleven,
              squaresMock.eleven,
              squaresMock.eleven,
              squaresMock.eleven,
            ],
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
            unitsInMapMock,
          ),
        ).toStrictEqual(resultPlayerB);
      });

      it('Player A move one unit to an ocuppied (by Bs units movement) position, and another to first units position (both need to go back)', () => {
        const unitAXNewLocalization: MatchStateUnitsMovement = {
          ...unitAX,
          localization: localizationsMock.ten,
          movedInTurn: true,
        };

        const unitAYNewLocalization: MatchStateUnitsMovement = {
          ...unitAY,
          localization: localizationsMock.one,
          movedInTurn: true,
        };

        const unitAZNewLocalization: MatchStateUnitsMovement = {
          ...unitAZ,
          localization: localizationsMock.three,
          movedInTurn: true,
        };

        const resultPlayerA: MatchStateUnitsMovement[] = [
          {
            ...unitAXNewLocalization,
            localization: localizationsMock.ten,
            previousLocalization: localizationsMock.one,
            movedInTurn: false,
            reachableLocalizations: [
              squaresMock.ten,
              squaresMock.ten,
              squaresMock.ten,
              squaresMock.ten,
            ],
          },
          {
            ...unitAYNewLocalization,
            localization: localizationsMock.one,
            previousLocalization: localizationsMock.three,
            movedInTurn: false,
            reachableLocalizations: [
              squaresMock.one,
              squaresMock.one,
              squaresMock.one,
              squaresMock.one,
            ],
          },
          {
            ...unitAZNewLocalization,
            localization: localizationsMock.three,
            previousLocalization: localizationsMock.five,
            movedInTurn: false,
            reachableLocalizations: [
              squaresMock.three,
              squaresMock.three,
              squaresMock.three,
              squaresMock.three,
            ],
          },
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
            unitsMovement: [
              unitAXNewLocalization,
              unitAYNewLocalization,
              unitAZNewLocalization,
            ],
          },
        };
        console.log(
          '------------------------------ EXEC 1 ---------------------------------------- ',
        );
        const unitsMovementAfterPlayerA = unitsService.updateUnitsMovement(
          lod.cloneDeep(paramsPlayerA.currentMatchState),
          paramsPlayerA.playerId,
          lod.cloneDeep(paramsPlayerA.matchStateUpdate),
          paramsPlayerA.players,
          unitsInMapMock,
        );
        expect(unitsMovementAfterPlayerA).toStrictEqual(resultPlayerA);

        const unitBXNewLocalization: MatchStateUnitsMovement = {
          ...unitBX,
          localization: localizationsMock.ten,
          movedInTurn: true,
        };

        const resultPlayerB: MatchStateUnitsMovement[] = [
          {
            ...unitAX,
            previousLocalization: localizationsMock.one,
          },
          {
            ...unitAY,
            previousLocalization: localizationsMock.three,
          },
          {
            ...unitAZ,
            previousLocalization: localizationsMock.five,
          },
          {
            ...unitBXNewLocalization,
            localization: localizationsMock.ten,
            previousLocalization: localizationsMock.seven,
            movedInTurn: false,
            reachableLocalizations: [
              squaresMock.ten,
              squaresMock.ten,
              squaresMock.ten,
              squaresMock.ten,
            ],
          },
          unitBY,
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
            unitsMovement: [unitBXNewLocalization],
          },
        };

        console.log(
          '------------------------------ EXEC 2 ---------------------------------------- ',
        );
        expect(
          unitsService.updateUnitsMovement(
            lod.cloneDeep(paramsPlayerB.currentMatchState),
            paramsPlayerB.playerId,
            lod.cloneDeep(paramsPlayerB.matchStateUpdate),
            paramsPlayerB.players,
            unitsInMapMock,
          ),
        ).toStrictEqual(resultPlayerB);
      });
    });
  });
});
