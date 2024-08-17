import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { StaticDataModule } from 'src/static-data/static-data.module';
import { MovementsService } from './movements.service';
import { CombatsService } from './combats.service';

@Module({
  imports: [StaticDataModule],
  providers: [UnitsService, MovementsService, CombatsService],
  exports: [UnitsService, MovementsService, CombatsService],
})
export class UnitsModule {}
