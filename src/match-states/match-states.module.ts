import { Module } from '@nestjs/common';
import { MatchStatesService } from './match-states.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UnitsModule } from 'src/units/units.module';
import { MoneyModule } from 'src/money/money.module';
import { MatchesModule } from 'src/matches/matches.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    PrismaModule,
    UnitsModule,
    MoneyModule,
    MatchesModule,
    EventsModule,
  ],
  exports: [MatchStatesService],
  providers: [MatchStatesService],
})
export class MatchStatesModule {}
