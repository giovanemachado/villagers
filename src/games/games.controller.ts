import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { GamesService } from './games.service';
import { MatchStateUpdate } from '../match-states/dto/match-state.dto';
import { MatchData } from 'src/matches/dto/match-data.dto';
import { EnterInMatchResponse, GetMapResponse } from './dto/game-responses.dto';

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
   * Check if there is a Match
   */
  @Get('/match')
  getMatch(
    @Req() { player }: { player: { id: string } },
  ): Promise<MatchData | null> {
    return this.gamesService.getMatchActiveByPlayer(player.id);
  }

  /**
   * Enter in a Match (player is registered in that Match)
   */
  @Post('/enter-match/:code')
  enterInMatch(
    @Req() { player }: { player: { id: string } },
    @Param() { code }: { code: string },
  ): Promise<EnterInMatchResponse> {
    return this.gamesService.enterInMatch(player.id, code);
  }

  /**
   * Get initial data (map, units, and current match state)
   */
  @Get('/initial-data')
  async getMap(
    @Req() { player }: { player: { id: string } },
  ): Promise<GetMapResponse> {
    const match = await this.gamesService.getMatchActiveByPlayer(player.id);

    if (!match) {
      throw 'There is no active match';
    }

    const rows = await this.gamesService.getMap();
    const units = await this.gamesService.getUnits(match.code);
    const matchState = await this.gamesService.getMatchState(match.code);

    if (!matchState) {
      throw 'There is no Match State';
    }

    return { rows, units, matchState, matchData: match };
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
    return await this.gamesService.updateMatchState(code, player.id, {
      money,
      unitsMovement,
      turns,
    });
  }
}
