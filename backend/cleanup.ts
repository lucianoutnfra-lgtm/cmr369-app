import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up bad records...');
  const tenants = await prisma.tenant.findMany({
    where: {
      OR: [
        { slug: { contains: 'umbra' } },
        { slug: { contains: 'lenceria' } },
        { name: { contains: 'umbra' } },
        { name: { contains: 'lenceria' } },
      ]
    }
  });

  for (const t of tenants) {
    console.log(`Deleting tenant: ${t.slug} (${t.id})`);
    await prisma.tenant.delete({ where: { id: t.id } });
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: 'umbra' } },
        { email: { contains: 'lenceria' } },
      ]
    }
  });

  for (const u of users) {
    console.log(`Deleting user: ${u.email}`);
    await prisma.user.delete({ where: { id: u.id } });
  }

  console.log('Cleanup complete!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
