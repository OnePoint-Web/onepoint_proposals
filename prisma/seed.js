const { PrismaClient } = require('../generated/prisma/client.js')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { userEmail: 'admin@test.com' },
  })

  const hashedPassword = await bcrypt.hash('Testing123*', 12)

  if (!existingUser) {
    await prisma.user.create({
      data: {
        username: 'adminaccount',
        firstName: 'Testing',
        lastName: 'User',
        userEmail: 'admin@test.com',
        accountRole: 2,
        userPassword: hashedPassword, 
        accountStatus: 1, 
      },
    })
    console.log('Default user created')
  } else {
    console.log('Default user already exists')
  }

    const statuses = [
    { statusId: 0, status: 'draft' },
    { statusId: 1, status: 'published' },
    { statusId: 3, status: 'sent' },
    { statusId: 4, status: 'viewed' },
    { statusId: 5, status: 'approved' },
    { statusId: 6, status: 'declined' },
    { statusId: 7, status: 'deleted' },
  ]

  for (const s of statuses) {
    await prisma.proposalStatus.upsert({
      where: { statusId: s.statusId },
      update: {},
      create: s,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })