const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const all = await prisma.listing.findMany({ select: { id: true, title: true, status: true, landlord: { select: { email: true } } } });
    console.log(JSON.stringify(all, null, 2));
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
