import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type User = any;

@Injectable()
export class PlayersService {
  constructor(private configService: ConfigService) {}

  // temporary users
  private readonly accounts = [
    {
      userId: 1,
      username: 'player1',
      password: this.configService.get('PASS1'),
    },
    {
      userId: 2,
      username: 'player2',
      password: this.configService.get('PASS2'),
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.accounts.find((user) => user.username === username);
  }

  getPlayerIds(): string[] {
    return [
      `player1-${new Date().getTime()}`,
      `player2-${new Date().getTime()}`,
    ];
  }
}
