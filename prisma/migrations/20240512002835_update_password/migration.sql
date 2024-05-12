/*
  Warnings:

  - You are about to drop the column `password` on the `Player` table. All the data in the column will be lost.
  - Added the required column `passwordHash` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL
);
INSERT INTO "new_Player" ("id", "username") SELECT "id", "username" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
