import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { GamesService } from './games.service';
import { GameState } from './dto/game-state.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('/match')
  createMatch(@Req() { player }: { player: { id: string } }) {
    return this.gamesService.createMatch(player.id);
  }

  @Post('/enter-match/:code')
  enterInMatch(
    @Req() { player }: { player: { id: string } },
    @Param() { code }: { code: string },
  ) {
    return this.gamesService.enterInMatch(player.id, code);
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
