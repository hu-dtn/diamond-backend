import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  await prisma.diamond.create({
    data: {
      stockId: "328",
      shape: "Round",
      carat: 1.05,
      color: "G",
      clarity: "VS2",
      cut: "Ideal",
      polish: "Excellent",
      symmetry: "Excellent",
      measurements: "23.2 x 13.3 x 13.4",
      location: "BKK",
      lab: "IGI",
      certNumber: "622470023",
      priceOnRequest: true,
    },
  });
}
main().finally(() => prisma.$disconnect());
