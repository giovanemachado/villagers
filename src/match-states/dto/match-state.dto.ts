import { PickType } from '@nestjs/mapped-types';
import { MoneyData } from 'src/money/dto/money-data.dto';

export class MatchStateUnitsMovement {
  id: string;
  localization: string;
  playerId: string;
}

export class MatchStatePlayerEndTurn {
  playerId: string;
  endedTurn: boolean;
}

export class MatchState {
  playersEndTurn: MatchStatePlayerEndTurn[];
  money: MoneyData[];
  turns: number;
  unitsMovement: MatchStateUnitsMovement[];
  id: number;
  createdAt: Date;
  updatedAt: Date;
  matchId: number;
}

export class MatchStateUpdate extends PickType(MatchState, [
  'money',
  'turns',
  'unitsMovement',
]) {}
