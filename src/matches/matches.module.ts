import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
