import { Injectable } from '@nestjs/common';
import { DataAccessService } from 'src/data-access/data-access.service';
import { MapData } from 'src/maps/dto/map-data.dto';

@Injectable()
export class GamesService {
  constructor(private readonly dataAcessService: DataAccessService) {
    this.turns = 1;
  }

  private turns: number;

  async getMap(): Promise<MapData> {
    return await this.dataAcessService.getStaticResource(
      'maps',
      'initial-map.json',
    );
  }

  getTurns() {
    return this.turns;
  }

  updateTurn() {
    this.turns++;
    return this.turns;
  }
}
