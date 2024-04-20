import { Injectable } from '@nestjs/common';
import { DataAccessService } from 'src/data-access/data-access.service';
import { MapData } from 'src/maps/types/map-data.type';

@Injectable()
export class GamesService {
  constructor(private readonly dataAcessService: DataAccessService) {}

  async getMap(): Promise<MapData> {
    return await this.dataAcessService.getStaticResource(
      'maps',
      'initial-map.json',
    );
  }
}
