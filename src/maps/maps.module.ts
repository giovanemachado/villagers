import { Module } from '@nestjs/common';
import { MapsService } from './maps.service';

@Module({
  controllers: [],
  providers: [MapsService],
})
export class MapsModule {}
