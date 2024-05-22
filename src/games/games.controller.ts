import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { GamesService } from './games.service';
import {
  MatchState,
  MatchStateUpdate,
} from '../match-states/dto/match-state.dto';
import { GeneratedMap } from 'src/maps/dto/map-data.dto';
import { MatchData } from 'src/matches/dto/match-data.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  /**
   * Create a new Match and MatchState
   */
  @Post('/match')
  createMatch(
    @Req() { player }: { player: { id: string } },
  ): Promise<MatchData> {
    return this.gamesService.createMatch(player.id);
  }

  /**
   * Enter in a Match (player is registered in that Match)
   */
  @Post('/enter-match/:code')
  enterInMatch(
    @Req() { player }: { player: { id: string } },
    @Param() { code }: { code: string },
  ): Promise<{ match: MatchData; matchState: MatchState }> {
    return this.gamesService.enterInMatch(player.id, code);
  }

  /**
   * Get initial data (map, units, and current match state)
   */
  @Get('/initial-data/:code')
  async getMap(
    @Param() { code }: { code: string },
  ): Promise<GeneratedMap & { matchState: MatchState }> {
    const rows = await this.gamesService.getMap();
    const units = await this.gamesService.getUnits(code);
    const matchState = await this.gamesService.getMatchState(code);

    return { rows, units, matchState };
  }

  /**
   * Update the MatchState, when passing the turn
   */
  @Post('/match-state/:code')
  async updateMatchState(
    @Param() { code }: { code: string },
    @Body()
    { unitsMovement, money, turns }: MatchStateUpdate,
    @Req() { player }: { player: { id: string } },
  ) {
    await this.gamesService.updateMatchState(code, player.id, {
      money,
      unitsMovement,
      turns,
    });
  }
}
