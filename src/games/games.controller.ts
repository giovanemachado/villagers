import { Controller, Get, Post } from '@nestjs/common';
import { GamesService } from './games.service';
import { MapData } from 'src/maps/dto/map-data.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('/map')
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
}
