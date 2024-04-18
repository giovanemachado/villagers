import { Injectable } from '@nestjs/common';
import initialData from 'src/maps/data/initial-map';
import { MapData } from 'src/maps/types/map-data.type';

@Injectable()
export class GamesService {
  getMap(): MapData {
    return initialData;
  }
}
