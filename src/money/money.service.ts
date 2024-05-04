import { Injectable } from '@nestjs/common';
import { MoneyData } from './dto/money-data.dto';

@Injectable()
export class MoneyService {
  private readonly MAX_MONEY: number;
  private readonly MONEY_PER_TURN: number;

  constructor() {
    this.MAX_MONEY = 10;
    this.MONEY_PER_TURN = 3;
  }

  getMoney(turn: number, currentMoney: MoneyData[]): MoneyData[] {
    if (turn === 1) {
      return [
        { ...currentMoney[0], value: this.MONEY_PER_TURN },
        { ...currentMoney[1], value: this.MONEY_PER_TURN },
      ];
    }

    return [this.stackMoney(currentMoney[0]), this.stackMoney(currentMoney[1])];
  }

  stackMoney(currentMoney: MoneyData): MoneyData {
    const sum = currentMoney.value + this.MONEY_PER_TURN;

    if (sum > this.MAX_MONEY) {
      return { ...currentMoney, value: this.MAX_MONEY };
    }

    return { ...currentMoney, value: sum };
  }
}
