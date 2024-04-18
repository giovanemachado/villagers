import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Module({
  controllers: [],
  providers: [MatchesService],
})
export class MatchesModule {}
