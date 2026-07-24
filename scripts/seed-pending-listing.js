const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Upsert landlord
  const landlordEmail = process.argv[2] || 'landlord1@local.test';
  const landlord = await prisma.user.upsert({
    where: { email: landlordEmail },
    update: {},
    create: {
      fullName: 'Test Landlord',
      email: landlordEmail,
      phone: '0710000000',
      passwordHash: '$2a$10$KIX/7S7qZC1F1sYk9u0s6uGQmJY9pQYcK1yqV5H1tQ9mZ8b6q1Z6', // dummy bcrypt
      role: 'LANDLORD',
      accountStatus: 'ACTIVE',
      isVerified: true,
    },
  });

  const listing = await prisma.listing.create({
    data: {
      landlordId: landlord.id,
      title: 'Pending Test Listing',
      description: 'A test listing awaiting approval.',
      propertyType: 'HOSTEL_ROOM',
      price: 5000,
      county: 'Nairobi',
      area: 'Test Area',
      status: 'PENDING',
      photos: {
        create: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80' }],
      },
    },
    include: { photos: true },
  });

  console.log('Created landlord:', landlord.id, landlord.email);
  console.log('Created listing:', listing.id);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
