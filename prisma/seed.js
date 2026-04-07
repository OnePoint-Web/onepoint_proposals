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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })