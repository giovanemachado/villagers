-- CreateTable
CREATE TABLE "MatchState" (
    "id" SERIAL NOT NULL,
    "turns" INTEGER NOT NULL DEFAULT 1,
    "money" JSONB NOT NULL,
    "unitsMovement" JSONB NOT NULL,
    "playersEndTurn" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "matchId" INTEGER NOT NULL,

    CONSTRAINT "MatchState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchState_matchId_key" ON "MatchState"("matchId");

-- AddForeignKey
ALTER TABLE "MatchState" ADD CONSTRAINT "MatchState_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
