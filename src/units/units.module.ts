import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';

@Module({
  controllers: [],
  providers: [UnitsService],
})
export class UnitsModule {}
