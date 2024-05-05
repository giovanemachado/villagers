import { PickType } from '@nestjs/mapped-types';
import { MatchData } from './match-data.dto';

export class MatchDataCreate extends PickType(MatchData, ['code', 'players']) {}
