import { PlayerData } from 'src/players/dto/player-data.dto';

export class MatchData {
  id: number;
  code: string;
  players: PlayerData[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
