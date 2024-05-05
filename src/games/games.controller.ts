import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { GamesService } from './games.service';
import { GameState } from './dto/game-state.dto';
import { PlayerData } from 'src/players/dto/player-data.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('/match')
  createMatch(@Req() { player }: { player: PlayerData }) {
    return this.gamesService.createMatch(player);
  }

  @Post('/enter-match/:code')
  enterInMatch(
    @Req() { player }: { player: PlayerData },
    @Param() { code }: { code: string },
  ) {
    return this.gamesService.enterInMatch(player, code);
  }

  @Get('/initial-load')
  getInitialGameState(): Promise<GameState> {
    return this.gamesService.getInitialGameState();
  }

  @Post(':gameId/state/')
  updateTurn(
    @Param() { gameId }: { gameId: string },
    @Body()
    {
      playerIds,
      units,
      money,
      turns,
    }: Pick<GameState, 'playerIds' | 'units' | 'money' | 'turns'>,
  ) {
    return this.gamesService.updateGameState({
      playerIds,
      gameId,
      money,
      units,
      turns,
    });
  }
}
