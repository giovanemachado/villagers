import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PlayersService } from 'src/players/players.service';
import { JwtService } from '@nestjs/jwt';
import { PlayerDataCreate } from 'src/players/dto/player-create.dto';

@Injectable()
export class AuthService {
  constructor(
    private playersService: PlayersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const player: PlayerDataCreate | null =
      await this.playersService.findPlayer({
        username,
      });
     
    if (!player) {
      throw new UnauthorizedException();
    }
    
    var bcrypt = require('bcryptjs');

    const res = await bcrypt.compare(password, player.passwordHash);

    if (!res) {
      throw new UnauthorizedException('...');
    }

    const payload = { id: player.id, username: player.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
