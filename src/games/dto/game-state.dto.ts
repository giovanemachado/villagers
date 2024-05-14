import { MatchData } from 'src/matches/dto/match-data.dto';
import { MoneyData } from 'src/money/dto/money-data.dto';
import { UnitData } from 'src/units/dto/unit-data.dto';

export class GameState {
  money: MoneyData[];
  turns: number;
  units: UnitData[];
  match: MatchData;
}
