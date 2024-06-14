import { PickType } from '@nestjs/mapped-types';
import { MatchState } from '../dto/match-state.dto';
import { MatchData } from 'src/matches/dto/match-data.dto';

export class MatchAndMatchState extends PickType(MatchData, [
  'id',
  'code',
  'active',
  'players',
  'numberOfPlayers',
]) {
  matchState: MatchState;
}
