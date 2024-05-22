import { SquareData } from 'src/maps/dto/square-data.dto';
import { MatchState } from 'src/match-states/dto/match-state.dto';
import { MatchData } from 'src/matches/dto/match-data.dto';
import { UnitData } from 'src/units/dto/unit-data.dto';

export class EnterInMatchResponse {
  match: MatchData;
  matchState: MatchState;
}

export class GetMapResponse {
  rows: SquareData[][];
  units: UnitData[];
  matchState: MatchState;
  matchData: MatchData;
}
