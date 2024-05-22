-- DropForeignKey
ALTER TABLE "MatchState" DROP CONSTRAINT "MatchState_matchId_fkey";

-- AlterTable
ALTER TABLE "MatchState" ALTER COLUMN "matchId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MatchState" ADD CONSTRAINT "MatchState_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;
