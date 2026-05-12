import { PrismaClient, Prisma} from '../../generated/prisma/client.js'

const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["error"] })

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma

export {Prisma}
export default prisma

