import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayersService {
  getPlayerIds(): string[] {
    return [
      `player1-${new Date().getTime()}`,
      `player2-${new Date().getTime()}`,
    ];
  }
}
