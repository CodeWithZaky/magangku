import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create default admin
  const adminExists = await prisma.admin.findUnique({
    where: { email: "admin@example.com" },
  });

  if (!adminExists) {
    await prisma.admin.create({
      data: {
        name: "Admin",
        email: "admin@example.com",
        passwordHash: await hash("password123", 10),
      },
    });
    console.log("Created default admin");
  }

  // Create sample interns
  const internsCount = await prisma.intern.count();

  if (internsCount === 0) {
    const today = new Date();

    // Sample data
    const interns = [
      {
        name: "Budi Santoso",
        institution: "Universitas Indonesia",
        startDate: new Date(today.getFullYear(), today.getMonth() - 2, 15),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 15),
        status: "Aktif",
      },
      {
        name: "Siti Rahayu",
        institution: "Universitas Gadjah Mada",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        endDate: new Date(today.getFullYear(), today.getMonth() + 2, 1),
        status: "Aktif",
      },
      {
        name: "Ahmad Hidayat",
        institution: "Institut Teknologi Bandung",
        startDate: new Date(today.getFullYear(), today.getMonth() - 3, 10),
        endDate: new Date(today.getFullYear(), today.getMonth() - 1, 10),
        status: "Selesai",
      },
      {
        name: "Dewi Lestari",
        institution: "Universitas Diponegoro",
        startDate: new Date(today.getFullYear(), today.getMonth(), 5),
        endDate: new Date(today.getFullYear(), today.getMonth() + 3, 5),
        status: "Aktif",
      },
      {
        name: "Rudi Hartono",
        institution: "Universitas Brawijaya",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 20),
        endDate: new Date(
          today.getFullYear(),
          today.getMonth() + 0,
          today.getDate() + 5
        ),
        status: "Aktif",
      },
    ];

    for (const intern of interns) {
      await prisma.intern.create({ data: intern });
    }

    console.log(`Created ${interns.length} sample interns`);
  }
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
