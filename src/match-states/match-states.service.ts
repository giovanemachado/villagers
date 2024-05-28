import { Injectable } from '@nestjs/common';
import { MatchState, MatchStateUpdate } from './dto/match-state.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MoneyService } from 'src/money/money.service';
import { MatchesService } from 'src/matches/matches.service';
import { INITIAL_TURN } from 'src/static-data/definitions/constants';
import { EVENT_TYPES } from 'src/events/dto/event-data.dto';
import { EventsGateway } from 'src/events/events.gateway';
import { UnitsService } from 'src/units/units.service';

@Injectable()
export class MatchStatesService {
  constructor(
    private prismaService: PrismaService,
    private moneyService: MoneyService,
    private matchService: MatchesService,
    private eventsGateway: EventsGateway,
    private unitsService: UnitsService,
  ) {}

  async getMatchState(code: string): Promise<MatchState | null> {
    try {
      // TODO usar match service
      const queryResult = await this.prismaService.match.findUnique({
        where: { code },
        include: {
          matchState: {},
        },
      });

      if (!queryResult || !queryResult.matchState) {
        return null;
      }

      return queryResult?.matchState as unknown as MatchState;
    } catch (error) {
      console.log(error);
      throw 'Something went wrong with getMatchState';
    }
  }

  async createMatchState(
    code: string,
    prismaTransaction?: any,
  ): Promise<MatchState> {
    const match = await this.matchService.getValidMatch({ code });
    const player1 = match.players[0];
    const player2 = match.players[1];

    const prismaClient = prismaTransaction ?? this.prismaService;

    const matchState = await prismaClient.matchState.create({
      data: {
        match: {
          connect: {
            id: match.id,
          },
        },
        playersEndTurn: [
          {
            playerId: player1,
            endedTurn: false,
          },
          {
            playerId: player2,
            endedTurn: false,
          },
        ],
        money: this.moneyService.getMoney(INITIAL_TURN, [
          { playerId: player1, value: 0 },
          { playerId: player1, value: 0 },
        ]),
        unitsMovement: [],
        turns: INITIAL_TURN,
      },
    });

    return matchState as unknown as MatchState;
  }

  async updateMatchState(
    code: string,
    playerId: string,
    matchStateUpdate: MatchStateUpdate,
  ) {
    try {
      const match = await this.matchService.getValidMatch({
        code,
        include: {
          matchState: {
            select: {
              id: true,
              turns: true,
              playersEndTurn: true,
              unitsMovement: true,
              money: true,
            },
          },
        },
      });

      if (!match || !match.matchState) {
        throw `Can't find Match (id: ${match?.id}) or Match State`;
      }

      const currentMatchState = match.matchState as unknown as MatchState;

      if (
        currentMatchState.playersEndTurn.find(
          (playerEndTurn) => playerEndTurn.playerId == playerId,
        )?.endedTurn == true
      ) {
        throw 'Player already passed the turn.';
      }

      let itShouldPassTurnForBothPlayers = false;

      let playersEndTurnUpdated = this.updatePlayerEndTurn(
        currentMatchState,
        playerId,
      );

      let turnsUpdated = currentMatchState.turns;

      if (
        playersEndTurnUpdated.every(
          (player: { playerId: string; endedTurn: boolean }) =>
            player.endedTurn,
        )
      ) {
        turnsUpdated = this.updateTurns(currentMatchState);

        playersEndTurnUpdated = this.updatePlayerEndTurn(
          currentMatchState,
          playerId,
          true,
        );

        itShouldPassTurnForBothPlayers = true;
      }

      const matchState = await this.prismaService.matchState.update({
        where: {
          id: currentMatchState.id,
        },
        data: {
          playersEndTurn: playersEndTurnUpdated,
          turns: turnsUpdated,
          unitsMovement: this.unitsService.updateUnitsMovement(
            currentMatchState,
            playerId,
            matchStateUpdate,
          ) as any,
          money: this.updateMoney(
            currentMatchState,
            playerId,
            matchStateUpdate,
          ),
        },
      });

      if (itShouldPassTurnForBothPlayers) {
        this.eventsGateway.emitEvent(EVENT_TYPES.BOTH_PLAYERS_ENDED_TURN, {
          matchCode: match.code,
          matchState,
        });
      }

      return matchState;
    } catch (error) {
      console.log(error);
      throw new Error('Problem to update match state');
    }
  }

  updatePlayerEndTurn(
    currentMatchState: Pick<MatchState, 'playersEndTurn'>,
    playerId: string,
    resetTurns?: boolean,
  ) {
    return currentMatchState.playersEndTurn.map(
      (player: { playerId: string; endedTurn: boolean }) => {
        if (resetTurns) {
          player.endedTurn = false;
          return player;
        }

        if (player.playerId === playerId) {
          player.endedTurn = true;
        }

        return player;
      },
    );
  }

  updateTurns(currentMatchState: Pick<MatchState, 'turns'>) {
    return currentMatchState.turns + 1;
  }

  // TODO move logic to money service
  updateMoney(
    currentMatchState: Pick<MatchState, 'money'>,
    playerId: string,
    matchStateUpdate: MatchStateUpdate,
  ) {
    return currentMatchState.money.map(
      (money: { playerId: string; value: number }) => {
        if (money.playerId != playerId) {
          return money;
        }

        let currentMoney =
          matchStateUpdate.money &&
          matchStateUpdate.money.find((money) => money.playerId === playerId);

        if (!currentMoney) {
          currentMoney = money;
        }

        money.value = currentMoney.value + 3;

        return money;
      },
    );
  }
}
