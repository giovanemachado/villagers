import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pass1 = process.env.PASS1
  const pass2 = process.env.PASS2

  if (!pass1 || !pass2) {
    throw 'No passwords'
  }

  await prisma.player.upsert({
    where: { username: 'player1' },
    update: {},
    create: {
      username: 'player1',
      passwordHash: pass1,
    },
  });
  await prisma.player.upsert({
    where: { username: 'player2' },
    update: {},
    create: {
      username: 'player2',
      passwordHash: pass2,
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
