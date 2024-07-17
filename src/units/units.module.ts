import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { StaticDataModule } from 'src/static-data/static-data.module';

@Module({
  imports: [StaticDataModule],
  providers: [UnitsService],
  exports: [UnitsService],
})
export class UnitsModule {}
