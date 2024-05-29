import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { MatchStateUpdate } from '../match-states/dto/match-state.dto';
import { MatchData } from 'src/matches/dto/match-data.dto';
import { EnterInMatchResponse, GetMapResponse } from './dto/game-responses.dto';
import { Response } from 'express';

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
  async getMatch(
    @Req() { player }: { player: { id: string } },
    @Res({ passthrough: true }) res: Response,
  ) {
    const activeMatch = await this.gamesService.getMatch({
      playerId: player.id,
      active: true,
    });

    if (activeMatch) {
      return activeMatch;
    }

    res.status(HttpStatus.NO_CONTENT);
  }

  /**
   * Join a Match (player is registered in that Match)
   */
  @Post('/join-match/:code')
  joinMatch(
    @Req() { player }: { player: { id: string } },
    @Param() { code }: { code: string },
  ): Promise<EnterInMatchResponse> {
    return this.gamesService.joinMatch(player.id, code);
  }

  /**
   * Get initial data (map, units, and current match state)
   */
  @Get('/initial-data')
  async getMap(
    @Req() { player }: { player: { id: string } },
  ): Promise<GetMapResponse> {
    const match = await this.gamesService.getMatch({
      playerId: player.id,
      active: true,
    });

    if (!match) {
      throw 'No match';
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

  /**
   * Finish a Match
   */
  @Post('/finish-match/:code')
  async finishMatch(
    @Req() { player }: { player: { id: string } },
    @Param() { code }: { code: string },
  ) {
    return this.gamesService.finishMatch(player.id, code);
  }
}
