import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.player.upsert({
    where: { username: 'player1' },
    update: {},
    create: {
      username: 'player1',
      password: 'pass1',
    },
  });
  await prisma.player.upsert({
    where: { username: 'player2' },
    update: {},
    create: {
      username: 'player2',
      password: 'pass2',
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
