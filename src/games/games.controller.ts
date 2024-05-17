import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { GamesService } from './games.service';
import { GameState } from './dto/game-state.dto';
import { MapData } from 'src/maps/dto/map-data.dto';

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

  @Get('/initial-load/:code')
  getInitialGameState(@Param() { code }: { code: string }): Promise<GameState> {
    return this.gamesService.getInitialGameState(code);
  }

  @Post('/turn/:code')
  updateTurn(
    @Param() { code }: { code: string },
    @Body()
    { units, money, turns }: GameState,
  ) {
    return this.gamesService.updateGameState(code, {
      money,
      units,
      turns,
    });
  }

  @Get('/initial-map/:code')
  getInitialMap(@Param() { code }: { code: string }): Promise<MapData> {
    // TODO use match info to get a map
    code;
    return this.gamesService.getMap();
  }
}
