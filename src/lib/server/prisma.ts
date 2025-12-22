import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type { Prisma } from '@prisma/client';

export default prisma;
