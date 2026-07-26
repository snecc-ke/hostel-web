const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const fullName = process.argv[4] || "Admin";

  if (!email || !password) {
    console.error("Usage: node scripts/create-admin.js <email> <password> [fullName]");
    process.exit(1);
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash },
    create: {
      fullName,
      email,
      // Placeholder phone value only exists to satisfy the unique phone constraint for admin seed users.
      phone: `admin-${Date.now()}`,
      passwordHash,
      role: "ADMIN",
      isVerified: true,
    },
  });

  console.log("Admin ready:", { id: admin.id, email: admin.email, role: admin.role });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
