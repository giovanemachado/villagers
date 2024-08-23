/* eslint-disable @typescript-eslint/no-unused-vars */
import { MatchStateUnitsMovement } from 'src/match-states/dto/match-state.dto';
import { UnitsService } from '../units.service';
import { StaticDataService } from '../../static-data/static-data.service';
import { CombatsService } from '../combats.service';
import { localizationsMock, playerA, playerB, square } from './mocks';
import { UNITDATA_CLASS } from '../../open-api/schema';

describe('CombatsService', () => {
  let staticDataService: StaticDataService;
  let unitsService: UnitsService;
  let combatsService: CombatsService;

  beforeEach(() => {
    unitsService = new UnitsService(staticDataService);
    combatsService = new CombatsService(unitsService);
  });

  describe('resolveUnitsCombat', () => {
    const archerAX = `${UNITDATA_CLASS.ARCHER}-ax`;
    const archerBX = `${UNITDATA_CLASS.ARCHER}-bx`;
    const spearmanAY = `${UNITDATA_CLASS.SPEARMAN}-ay`;
    const spearmanBY = `${UNITDATA_CLASS.SPEARMAN}-by`;
    const horsemanAH = `${UNITDATA_CLASS.HORSEMAN}-ah`;
    const spearmanAS = `${UNITDATA_CLASS.SPEARMAN}-as`;
    const archerAA = `${UNITDATA_CLASS.ARCHER}-aa`;
    const horsemanBH = `${UNITDATA_CLASS.HORSEMAN}-bh`;
    const spearmanBS = `${UNITDATA_CLASS.SPEARMAN}-bs`;
    const archerBA = `${UNITDATA_CLASS.ARCHER}-ba`;
    const castleAX = `${UNITDATA_CLASS.CASTLE}-ax`;
    const castleBX = `${UNITDATA_CLASS.CASTLE}-bx`;
    const wallAX = `${UNITDATA_CLASS.WALL}-ax`;
    const wallBX = `${UNITDATA_CLASS.WALL}-bx`;
    const gateAX = `${UNITDATA_CLASS.GATE}-ax`;
    const gateBX = `${UNITDATA_CLASS.GATE}-bx`;

    const unitsIds = [archerAX, archerBX, spearmanAY, spearmanBY];

    const noMovements: MatchStateUnitsMovement[] = [];
    const players: string[] = [playerA, playerB];
    const turnPriorityB: number = 1; // priority player B
    const turnPriorityA: number = 2; // priority player A

    const unitsFarFromEachOther: MatchStateUnitsMovement[] = [
      {
        id: unitsIds[0],
        localization: localizationsMock.zero,
        previousLocalization: localizationsMock.four,
        playerId: playerA,
        movedInTurn: false,
        reachableLocalizations: [localizationsMock.zero, localizationsMock.two],
      },
      {
        id: unitsIds[1],
        localization: localizationsMock.three,
        previousLocalization: localizationsMock.five,
        playerId: playerB,
        movedInTurn: false,
        reachableLocalizations: [
          localizationsMock.three,
          localizationsMock.one,
        ],
      },
    ];

    // TODO add more examples
    it.each([
      {
        matchStateUnitsMovement: noMovements,
        turns: turnPriorityB,
        expected: [],
        description: 'no movements',
      },
      {
        matchStateUnitsMovement: unitsFarFromEachOther,
        turns: turnPriorityB,
        expected: unitsFarFromEachOther,
        description: 'two units too far',
      },
    ])(
      'should not kill units if there is no touch - $description',
      ({ matchStateUnitsMovement, turns, expected }) => {
        const result = combatsService.resolveUnitsCombat(
          matchStateUnitsMovement,
          players,
          turns,
        );

        expect(result).toStrictEqual(expected);
      },
    );

    const nearStructureUnits: MatchStateUnitsMovement[] = [
      {
        id: castleAX,
        localization: `${square}_2-0`,
        previousLocalization: localizationsMock.one,
        playerId: playerA,
        movedInTurn: false,
        reachableLocalizations: [],
      },
      {
        id: unitsIds[1],
        localization: localizationsMock.three,
        previousLocalization: localizationsMock.two,
        playerId: playerB,
        movedInTurn: false,
        reachableLocalizations: [],
      },
    ];

    const nearStructureUnitsWithAPriorityResult: MatchStateUnitsMovement[] = [
      {
        id: castleAX,
        localization: `${square}_2-0`,
        previousLocalization: localizationsMock.one,
        playerId: playerA,
        movedInTurn: false,
        reachableLocalizations: [],
      },
      {
        id: unitsIds[1],
        localization: localizationsMock.three,
        previousLocalization: localizationsMock.two,
        playerId: playerB,
        movedInTurn: false,
        reachableLocalizations: [],
      },
    ];

    const nearStructureUnitsWithBPriorityResult =
      nearStructureUnitsWithAPriorityResult;

    const nearStructureUnitsFromSameTeam: MatchStateUnitsMovement[] = [
      {
        id: spearmanAS,
        localization: `${square}_2-0`,
        previousLocalization: localizationsMock.one,
        playerId: playerA,
        movedInTurn: false,
        reachableLocalizations: [],
      },
      {
        id: wallAX,
        localization: localizationsMock.three,
        previousLocalization: localizationsMock.two,
        playerId: playerA,
        movedInTurn: false,
        reachableLocalizations: [],
      },
      {
        id: gateAX,
        localization: localizationsMock.one,
        previousLocalization: localizationsMock.two,
        playerId: playerA,
        movedInTurn: false,
        reachableLocalizations: [],
      },
    ];

    const nearStructureUnitsFromSameTeamWithAPriorityResult: MatchStateUnitsMovement[] =
      nearStructureUnitsFromSameTeam;
    const nearStructureUnitsFromSameTeamWithBPriorityResult: MatchStateUnitsMovement[] =
      nearStructureUnitsFromSameTeam;

    // RLM stands for Real Life Movement, aka copy and paste from a bug in the game so we have at least 1 test on it
    const RLMSpearmanMove: MatchStateUnitsMovement[] = [
      {
        id: 'gate-10',
        playerId: playerA,
        movedInTurn: false,
        localization: 'square_5-2',
        previousLocalization: 'square_5-2',
        reachableLocalizations: [],
      },
      {
        id: 'gate-11',
        playerId: playerA,
        movedInTurn: false,
        localization: 'square_5-3',
        previousLocalization: 'square_5-3',
        reachableLocalizations: [],
      },
      {
        id: 'spearman-14',
        playerId: playerA,
        movedInTurn: false,
        localization: 'square_4-2',
        previousLocalization: 'square_6-2',
        reachableLocalizations: [],
      },
    ];

    const RLMSpearmanMoveWithAPriorityResult = RLMSpearmanMove;
    const RLMSpearmanMoveWithBPriorityResult = RLMSpearmanMove;

    it.each([
      {
        matchStateUnitsMovement: nearStructureUnits,
        turns: turnPriorityA,
        expected: nearStructureUnitsWithAPriorityResult,
        description:
          'castle vs archer, castle player priority, no kills expected',
      },
      {
        matchStateUnitsMovement: nearStructureUnits,
        turns: turnPriorityB,
        expected: nearStructureUnitsWithBPriorityResult,
        description:
          'castle vs archer, archer player priority, no kills expected',
      },
      {
        matchStateUnitsMovement: nearStructureUnitsFromSameTeam,
        turns: turnPriorityA,
        expected: nearStructureUnitsFromSameTeamWithAPriorityResult,
        description:
          'spearman vs gate and wall, same teams, prio, no kills expected',
      },
      {
        matchStateUnitsMovement: nearStructureUnitsFromSameTeam,
        turns: turnPriorityB,
        expected: nearStructureUnitsFromSameTeamWithBPriorityResult,
        description:
          'spearman vs gate and wall, same teams, no-prio, no kills expected',
      },
      {
        matchStateUnitsMovement: RLMSpearmanMove,
        turns: turnPriorityA,
        expected: RLMSpearmanMoveWithAPriorityResult,
        description:
          'spearman moves through gate, same teams, prio, no kills expected',
      },
      {
        matchStateUnitsMovement: RLMSpearmanMove,
        turns: turnPriorityB,
        expected: RLMSpearmanMoveWithBPriorityResult,
        description:
          'spearman moves through gate, same teams, no-prio, no kills expected',
      },
    ])(
      'should not envolve structure units in combat - $description',
      ({ matchStateUnitsMovement, turns, expected }) => {
        const result = combatsService.resolveUnitsCombat(
          matchStateUnitsMovement,
          players,
          turns,
        );

        expect(result).toStrictEqual(expected);
      },
    );

    const nearUnits: MatchStateUnitsMovement[] = [
      {
        id: unitsIds[0],
        localization: `${square}_2-0`,
        previousLocalization: localizationsMock.one,
        playerId: playerA,
        movedInTurn: false,
        reachableLocalizations: [],
      },
      {
        id: unitsIds[1],
        localization: localizationsMock.three,
        previousLocalization: localizationsMock.two,
        playerId: playerB,
        movedInTurn: false,
        reachableLocalizations: [],
      },
    ];

    const nearUnitsWithBPriorityResult: MatchStateUnitsMovement[] = [
      {
        id: unitsIds[1],
        localization: localizationsMock.three,
        previousLocalization: localizationsMock.two,
        playerId: playerB,
        movedInTurn: false,
        reachableLocalizations: [],
      },
    ];

    const nearUnitsWithAPriorityResult: MatchStateUnitsMovement[] = [
      {
        id: unitsIds[0],
        localization: `${square}_2-0`,
        previousLocalization: localizationsMock.one,
        playerId: playerA,
        movedInTurn: false,
        reachableLocalizations: [],
      },
    ];

    const nearUnitsInTwoCombats: MatchStateUnitsMovement[] = [
      {
        id: unitsIds[0],
        localization: `${square}_2-0`,
        previousLocalization: localizationsMock.one,
        playerId: playerA,
        movedInTurn: false,
        reachableLocalizations: [],
      },
      {
        id: unitsIds[1],
        localization: localizationsMock.three,
        previousLocalization: localizationsMock.two,
        playerId: playerB,
        movedInTurn: false,
        reachableLocalizations: [],
      },
      {
        id: unitsIds[2],
        localization: localizationsMock.five,
        previousLocalization: localizationsMock.two,
        playerId: playerA,
        movedInTurn: false,
        reachableLocalizations: [],
      },
      {
        id: unitsIds[3],
        localization: localizationsMock.six,
        previousLocalization: localizationsMock.two,
        playerId: playerB,
        movedInTurn: false,
        reachableLocalizations: [],
      },
    ];

    const nearUnitsInTwoCombatsWithBPriorityResult: MatchStateUnitsMovement[] =
      [
        {
          id: unitsIds[1],
          localization: localizationsMock.three,
          previousLocalization: localizationsMock.two,
          playerId: playerB,
          movedInTurn: false,
          reachableLocalizations: [],
        },
        {
          id: unitsIds[3],
          localization: localizationsMock.six,
          previousLocalization: localizationsMock.two,
          playerId: playerB,
          movedInTurn: false,
          reachableLocalizations: [],
        },
      ];

    const nearUnitsInTwoCombatsWithAPriorityResult: MatchStateUnitsMovement[] =
      [
        {
          id: unitsIds[0],
          localization: `${square}_2-0`,
          previousLocalization: localizationsMock.one,
          playerId: playerA,
          movedInTurn: false,
          reachableLocalizations: [],
        },
        {
          id: unitsIds[2],
          localization: localizationsMock.five,
          previousLocalization: localizationsMock.two,
          playerId: playerA,
          movedInTurn: false,
          reachableLocalizations: [],
        },
      ];

    it.each([
      {
        matchStateUnitsMovement: nearUnits,
        turns: turnPriorityB,
        expected: nearUnitsWithBPriorityResult,
        description: 'archer vs archer and b priority',
      },
      {
        matchStateUnitsMovement: nearUnits,
        turns: turnPriorityA,
        expected: nearUnitsWithAPriorityResult,
        description: 'archer vs archer and a priority',
      },
      {
        matchStateUnitsMovement: nearUnitsInTwoCombats,
        turns: turnPriorityB,
        expected: nearUnitsInTwoCombatsWithBPriorityResult,
        description: 'archer vs archer, spearman vs spearman, and b priority',
      },
      {
        matchStateUnitsMovement: nearUnitsInTwoCombats,
        turns: turnPriorityA,
        expected: nearUnitsInTwoCombatsWithAPriorityResult,
        description: 'archer vs archer, spearman vs spearman, and a priority',
      },
    ])(
      "should kill no-Priority player's units of same type when there is touch - $description",
      ({ matchStateUnitsMovement, turns, expected }) => {
        const result = combatsService.resolveUnitsCombat(
          matchStateUnitsMovement,
          players,
          turns,
        );

        expect(result).toStrictEqual(expected);
      },
    );

    // ARCHER VS SPEARMAN
    const nearUnitsArcherVsSpearman: MatchStateUnitsMovement[] = [
      {
        id: archerAA,
        localization: `${square}_2-0`,
        previousLocalization: localizationsMock.one,
        playerId: playerA,
        movedInTurn: false,
        reachableLocalizations: [],
      },
      {
        id: spearmanBS,
        localization: localizationsMock.three,
        previousLocalization: localizationsMock.two,
        playerId: playerB,
        movedInTurn: false,
        reachableLocalizations: [],
      },
    ];

    const nearUnitsArcherVsSpearmanWithPriorityBResult: MatchStateUnitsMovement[] =
      [
        {
          id: archerAA,
          localization: `${square}_2-0`,
          previousLocalization: localizationsMock.one,
          playerId: playerA,
          movedInTurn: false,
          reachableLocalizations: [],
        },
      ];

    const nearUnitsArcherVsSpearmanWithPriorityAResult: MatchStateUnitsMovement[] =
      nearUnitsArcherVsSpearmanWithPriorityBResult;

    // ARCHER VS HORSEMAN
    const nearUnitsArcherVsHorseman: MatchStateUnitsMovement[] = [
      {
        id: archerAA,
        localization: `${square}_2-0`,
        previousLocalization: localizationsMock.one,
        playerId: playerA,
        movedInTurn: false,
        reachableLocalizations: [],
      },
      {
        id: horsemanBH,
        localization: localizationsMock.three,
        previousLocalization: localizationsMock.two,
        playerId: playerB,
        movedInTurn: false,
        reachableLocalizations: [],
      },
    ];

    const nearUnitsArcherVsHorsemanWithPriorityBResult: MatchStateUnitsMovement[] =
      [
        {
          id: horsemanBH,
          localization: localizationsMock.three,
          previousLocalization: localizationsMock.two,
          playerId: playerB,
          movedInTurn: false,
          reachableLocalizations: [],
        },
      ];

    const nearUnitsArcherVsHorsemanWithPriorityAResult: MatchStateUnitsMovement[] =
      nearUnitsArcherVsHorsemanWithPriorityBResult;

    // SPEARMAN VS HORSEMAN
    const nearUnitsSpearmanVsHorseman: MatchStateUnitsMovement[] = [
      {
        id: spearmanAS,
        localization: `${square}_2-0`,
        previousLocalization: localizationsMock.one,
        playerId: playerA,
        movedInTurn: false,
        reachableLocalizations: [],
      },
      {
        id: horsemanBH,
        localization: localizationsMock.three,
        previousLocalization: localizationsMock.two,
        playerId: playerB,
        movedInTurn: false,
        reachableLocalizations: [],
      },
    ];

    const nearUnitsSpearmanVsHorsemanWithPriorityBResult: MatchStateUnitsMovement[] =
      [
        {
          id: spearmanAS,
          localization: `${square}_2-0`,
          previousLocalization: localizationsMock.one,
          playerId: playerA,
          movedInTurn: false,
          reachableLocalizations: [],
        },
      ];

    const nearUnitsSpearmanVsHorsemanWithPriorityAResult: MatchStateUnitsMovement[] =
      nearUnitsSpearmanVsHorsemanWithPriorityBResult;

    it.each([
      // ARCHER VS SPEARMAN
      {
        matchStateUnitsMovement: nearUnitsArcherVsSpearman,
        turns: turnPriorityB,
        expected: nearUnitsArcherVsSpearmanWithPriorityBResult,
        description: 'archer vs spearman and b priority',
      },
      {
        matchStateUnitsMovement: nearUnitsArcherVsSpearman,
        turns: turnPriorityA,
        expected: nearUnitsArcherVsSpearmanWithPriorityAResult,
        description: 'archer vs spearman and a priority',
      },
      // ARCHER VS HORSEMAN
      {
        matchStateUnitsMovement: nearUnitsArcherVsHorseman,
        turns: turnPriorityB,
        expected: nearUnitsArcherVsHorsemanWithPriorityBResult,
        description: 'archer vs horseman and b priority',
      },
      {
        matchStateUnitsMovement: nearUnitsArcherVsHorseman,
        turns: turnPriorityA,
        expected: nearUnitsArcherVsHorsemanWithPriorityAResult,
        description: 'archer vs horseman and a priority',
      },
      // SPEARMAN VS HORSEMAN
      {
        matchStateUnitsMovement: nearUnitsSpearmanVsHorseman,
        turns: turnPriorityB,
        expected: nearUnitsSpearmanVsHorsemanWithPriorityBResult,
        description: 'spearman vs horseman and b priority',
      },
      {
        matchStateUnitsMovement: nearUnitsSpearmanVsHorseman,
        turns: turnPriorityA,
        expected: nearUnitsSpearmanVsHorsemanWithPriorityAResult,
        description: 'spearman vs horseman and a priority',
      },
    ])(
      'should kill all units of weaker types when there is touch, regardless of Priority - $description',
      ({ matchStateUnitsMovement, turns, expected }) => {
        const result = combatsService.resolveUnitsCombat(
          matchStateUnitsMovement,
          players,
          turns,
        );

        expect(result).toStrictEqual(expected);
      },
    );
  });
});
