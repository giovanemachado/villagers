import { Controller, Get, Post } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('/map')
  getMap() {
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
}
