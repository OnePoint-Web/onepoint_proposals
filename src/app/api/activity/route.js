import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/getUserHelper'

export async function GET(req) {
  try {
    const user = await requireUser()
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') ?? '15')

    // Collect slugs for proposals this user created
    const ownedProposals = await prisma.proposal.findMany({
      where: { createdBy: user.userId },
      select: { slug: true },
    })
    const ownedSlugs = ownedProposals.map(p => p.slug)

    const activity = await prisma.activityLogs.findMany({
      where: {
        OR: [
          // Actions performed by this staff user
          { performedBy: user.userId },
          // Client interactions on proposals this user owns
          {
            entityType: 'proposals',
            entityId: { in: ownedSlugs },
            action: { in: ['proposal_viewed', 'proposal_accepted', 'proposal_rejected'] },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ data: activity })
  } catch (err) {
    console.error('Activity fetch error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
