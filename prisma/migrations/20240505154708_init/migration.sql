-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "numberOfPlayers" INTEGER NOT NULL DEFAULT 2,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Match" ("active", "code", "createdAt", "id", "updatedAt") SELECT "active", "code", "createdAt", "id", "updatedAt" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE UNIQUE INDEX "Match_code_key" ON "Match"("code");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
