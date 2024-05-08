import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [PrismaModule, EventsModule],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
