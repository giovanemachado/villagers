import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PlayersService } from 'src/players/players.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private playersService: PlayersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const player = await this.playersService.findOne(username);

    if (player?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: player.userId, username: player.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
