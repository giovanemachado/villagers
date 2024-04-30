import { Controller, Get, Post } from '@nestjs/common';
import { GamesService } from './games.service';
import { MapData } from 'src/maps/dto/map-data.dto';
import { GameState } from './dto/game-state.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // @Get('/map')
  getMap(): Promise<MapData> {
    return this.gamesService.getMap();
  }

  @Get('/turns')
  getTurn() {
    return this.gamesService.getTurns();
  }

  @Post('/turns')
  updateTurn() {
    return this.gamesService.updateTurn();
  }

  @Get('/initial-load')
  getInitialGameState(): Promise<GameState> {
    return this.gamesService.getInitialGameState();
  }
}
