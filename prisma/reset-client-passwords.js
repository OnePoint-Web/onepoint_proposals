// One-off: resets every existing client-portal account (accountRole 3) to the
// shared temporary password used going forward for all client accounts.
// Run once via: node prisma/reset-client-passwords.js
const { PrismaClient } = require('../generated/prisma/client.js')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const CLIENT_PORTAL_TEMP_PASSWORD = '1PtProposals@2026!'

async function main() {
  const hashedPassword = await bcrypt.hash(CLIENT_PORTAL_TEMP_PASSWORD, 12)

  const result = await prisma.user.updateMany({
    where: { accountRole: 3 },
    data: { userPassword: hashedPassword },
  })

  console.log(`Reset password for ${result.count} client account(s).`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
