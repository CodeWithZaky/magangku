import { MagangStatus, PrismaClient } from "@prisma/client";
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

    // Sample data - 50 different interns
    const interns = [
      {
        name: "Budi Santoso",
        institution: "Universitas Indonesia",
        startDate: new Date(today.getFullYear(), today.getMonth() - 2, 15),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 15),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Siti Rahayu",
        institution: "Universitas Gadjah Mada",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        endDate: new Date(today.getFullYear(), today.getMonth() + 2, 1),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Ahmad Hidayat",
        institution: "Institut Teknologi Bandung",
        startDate: new Date(today.getFullYear(), today.getMonth() - 3, 10),
        endDate: new Date(today.getFullYear(), today.getMonth() - 1, 10),
        status: MagangStatus.SELESAI,
      },
      {
        name: "Dewi Lestari",
        institution: "Universitas Diponegoro",
        startDate: new Date(today.getFullYear(), today.getMonth(), 5),
        endDate: new Date(today.getFullYear(), today.getMonth() + 3, 5),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Rudi Hartono",
        institution: "Universitas Brawijaya",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 20),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 20),
        status: MagangStatus.DIBATALKAN,
      },
      {
        name: "Ani Wulandari",
        institution: "Universitas Padjadjaran",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 10),
        endDate: new Date(today.getFullYear(), today.getMonth() + 2, 10),
        status: MagangStatus.DIBATALKAN,
      },
      {
        name: "Joko Prasetyo",
        institution: "Universitas Airlangga",
        startDate: new Date(today.getFullYear(), today.getMonth() - 2, 5),
        endDate: new Date(today.getFullYear(), today.getMonth(), 5),
        status: MagangStatus.SELESAI,
      },
      {
        name: "Linda Sari",
        institution: "Universitas Sebelas Maret",
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        endDate: new Date(today.getFullYear(), today.getMonth() + 3, 1),
        status: MagangStatus.TIDAK_LULUS,
      },
      {
        name: "Hendra Kurniawan",
        institution: "Institut Pertanian Bogor",
        startDate: new Date(today.getFullYear(), today.getMonth() - 3, 15),
        endDate: new Date(today.getFullYear(), today.getMonth() - 1, 15),
        status: MagangStatus.TIDAK_LULUS,
      },
      {
        name: "Maya Indah",
        institution: "Universitas Hasanuddin",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 25),
        endDate: new Date(today.getFullYear(), today.getMonth() + 2, 25),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Fajar Nugroho",
        institution: "Universitas Andalas",
        startDate: new Date(today.getFullYear(), today.getMonth(), 10),
        endDate: new Date(today.getFullYear(), today.getMonth() + 3, 10),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Rina Wijaya",
        institution: "Universitas Udayana",
        startDate: new Date(today.getFullYear(), today.getMonth() - 2, 20),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 20),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Agus Setiawan",
        institution: "Universitas Negeri Jakarta",
        startDate: new Date(today.getFullYear(), today.getMonth() - 3, 1),
        endDate: new Date(today.getFullYear(), today.getMonth(), 1),
        status: MagangStatus.SELESAI,
      },
      {
        name: "Dian Pertiwi",
        institution: "Universitas Sriwijaya",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 15),
        endDate: new Date(today.getFullYear(), today.getMonth() + 2, 15),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Eko Saputra",
        institution: "Universitas Jenderal Soedirman",
        startDate: new Date(today.getFullYear(), today.getMonth(), 5),
        endDate: new Date(today.getFullYear(), today.getMonth() + 3, 5),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Nurul Hidayah",
        institution: "SMAN 1 Jakarta",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 10),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 10),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Rizky Ramadhan",
        institution: "SMKN 1 Bandung",
        startDate: new Date(today.getFullYear(), today.getMonth() - 2, 15),
        endDate: new Date(today.getFullYear(), today.getMonth(), 15),
        status: MagangStatus.SELESAI,
      },
      {
        name: "Siska Dewi",
        institution: "SMA Taruna Nusantara",
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        endDate: new Date(today.getFullYear(), today.getMonth() + 2, 1),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Adi Pratama",
        institution: "SMAN 3 Surabaya",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 20),
        endDate: new Date(today.getFullYear(), today.getMonth() + 2, 20),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Yuni Astuti",
        institution: "SMKN 5 Yogyakarta",
        startDate: new Date(today.getFullYear(), today.getMonth() - 3, 5),
        endDate: new Date(today.getFullYear(), today.getMonth() - 1, 5),
        status: MagangStatus.SELESAI,
      },
      {
        name: "Irfan Maulana",
        institution: "SMAN 8 Medan",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 25),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 25),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Wulan Sari",
        institution: "SMKN 2 Semarang",
        startDate: new Date(today.getFullYear(), today.getMonth(), 10),
        endDate: new Date(today.getFullYear(), today.getMonth() + 3, 10),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Hadi Susanto",
        institution: "SMAN 1 Denpasar",
        startDate: new Date(today.getFullYear(), today.getMonth() - 2, 15),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 15),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Rani Puspita",
        institution: "SMKN 4 Malang",
        startDate: new Date(today.getFullYear(), today.getMonth() - 3, 1),
        endDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        status: MagangStatus.SELESAI,
      },
      {
        name: "Dodi Kurnia",
        institution: "SMAN 5 Makassar",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 20),
        endDate: new Date(today.getFullYear(), today.getMonth() + 2, 20),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Lina Marlina",
        institution: "SMKN 1 Surakarta",
        startDate: new Date(today.getFullYear(), today.getMonth(), 5),
        endDate: new Date(today.getFullYear(), today.getMonth() + 3, 5),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Toni Gunawan",
        institution: "Politeknik Negeri Jakarta",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 10),
        endDate: new Date(today.getFullYear(), today.getMonth() + 2, 10),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Rina Anggraeni",
        institution: "Politeknik Elektronika Negeri Surabaya",
        startDate: new Date(today.getFullYear(), today.getMonth() - 2, 15),
        endDate: new Date(today.getFullYear(), today.getMonth(), 15),
        status: MagangStatus.SELESAI,
      },
      {
        name: "Aris Budiman",
        institution: "Politeknik Negeri Bandung",
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        endDate: new Date(today.getFullYear(), today.getMonth() + 3, 1),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Dina Febrianti",
        institution: "Politeknik Negeri Medan",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 20),
        endDate: new Date(today.getFullYear(), today.getMonth() + 2, 20),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Firman Syah",
        institution: "Politeknik Negeri Bali",
        startDate: new Date(today.getFullYear(), today.getMonth() - 3, 5),
        endDate: new Date(today.getFullYear(), today.getMonth() - 1, 5),
        status: MagangStatus.SELESAI,
      },
      {
        name: "Gita Permata",
        institution: "Politeknik Negeri Samarinda",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 25),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 25),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Hendra Wijaya",
        institution: "Politeknik Negeri Pontianak",
        startDate: new Date(today.getFullYear(), today.getMonth(), 10),
        endDate: new Date(today.getFullYear(), today.getMonth() + 3, 10),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Indah Permatasari",
        institution: "Politeknik Negeri Lhokseumawe",
        startDate: new Date(today.getFullYear(), today.getMonth() - 2, 15),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 15),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Joni Prakoso",
        institution: "Politeknik Negeri Manado",
        startDate: new Date(today.getFullYear(), today.getMonth() - 3, 1),
        endDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        status: MagangStatus.SELESAI,
      },
      {
        name: "Kartika Sari",
        institution: "Politeknik Negeri Padang",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 20),
        endDate: new Date(today.getFullYear(), today.getMonth() + 2, 20),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Luki Hermawan",
        institution: "Universitas Telkom",
        startDate: new Date(today.getFullYear(), today.getMonth(), 5),
        endDate: new Date(today.getFullYear(), today.getMonth() + 3, 5),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Mira Susanti",
        institution: "Universitas Bina Nusantara",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 10),
        endDate: new Date(today.getFullYear(), today.getMonth() + 2, 10),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Nando Pratama",
        institution: "Universitas Mercu Buana",
        startDate: new Date(today.getFullYear(), today.getMonth() - 2, 15),
        endDate: new Date(today.getFullYear(), today.getMonth(), 15),
        status: MagangStatus.SELESAI,
      },
      {
        name: "Oki Setiawan",
        institution: "Universitas Trisakti",
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        endDate: new Date(today.getFullYear(), today.getMonth() + 3, 1),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Putri Ayu",
        institution: "Universitas Atma Jaya",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 20),
        endDate: new Date(today.getFullYear(), today.getMonth() + 2, 20),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Rahmat Hidayat",
        institution: "Universitas Kristen Krida Wacana",
        startDate: new Date(today.getFullYear(), today.getMonth() - 3, 5),
        endDate: new Date(today.getFullYear(), today.getMonth() - 1, 5),
        status: MagangStatus.SELESAI,
      },
      {
        name: "Sari Dewi",
        institution: "Universitas Pelita Harapan",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 25),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 25),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Teguh Santoso",
        institution: "Universitas Paramadina",
        startDate: new Date(today.getFullYear(), today.getMonth(), 10),
        endDate: new Date(today.getFullYear(), today.getMonth() + 3, 10),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Umi Kulsum",
        institution: "Universitas Al Azhar Indonesia",
        startDate: new Date(today.getFullYear(), today.getMonth() - 2, 15),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 15),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Vino Ginting",
        institution: "Universitas Esa Unggul",
        startDate: new Date(today.getFullYear(), today.getMonth() - 3, 1),
        endDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        status: MagangStatus.SELESAI,
      },
      {
        name: "Winda Sari",
        institution: "Universitas Gunadarma",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 20),
        endDate: new Date(today.getFullYear(), today.getMonth() + 2, 20),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Yoga Pratama",
        institution: "Universitas Pancasila",
        startDate: new Date(today.getFullYear(), today.getMonth(), 5),
        endDate: new Date(today.getFullYear(), today.getMonth() + 3, 5),
        status: MagangStatus.AKTIF,
      },
      {
        name: "Zahra Fitriani",
        institution: "Universitas Nasional",
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 10),
        endDate: new Date(today.getFullYear(), today.getMonth() + 2, 10),
        status: MagangStatus.AKTIF,
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
