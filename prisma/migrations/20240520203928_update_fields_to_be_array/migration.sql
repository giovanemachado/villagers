/*
  Warnings:

  - The `money` column on the `MatchState` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `unitsMovement` column on the `MatchState` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `playersEndTurn` column on the `MatchState` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MatchState" DROP COLUMN "money",
ADD COLUMN     "money" JSONB[],
DROP COLUMN "unitsMovement",
ADD COLUMN     "unitsMovement" JSONB[],
DROP COLUMN "playersEndTurn",
ADD COLUMN     "playersEndTurn" JSONB[];
