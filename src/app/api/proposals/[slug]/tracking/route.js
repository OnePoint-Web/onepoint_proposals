import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/getUserHelper'

export async function GET(req, { params }) {
  try {
    await requireUser()
    const { slug } = await params

    const proposal = await prisma.proposal.findUnique({
      where: { slug },
      select: {
        proposalId: true,
        firstViewedAt: true,
        lastViewedAt: true,
        viewCount: true,
      },
    })

    if (!proposal) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const tokens = await prisma.proposalShareToken.findMany({
      where: { proposalId: proposal.proposalId },
      orderBy: { createdAt: 'asc' },
    })

    if (tokens.length === 0) {
      return NextResponse.json({ recipients: [], firstViewedAt: null, lastViewedAt: null, totalViewCount: 0 })
    }

    const tokenIds = tokens.map(t => t.tokenId)

    // Aggregate view counts and session durations per token
    const [viewCounts, sessionTotals] = await Promise.all([
      prisma.proposalView.groupBy({
        by: ['tokenId'],
        where: { tokenId: { in: tokenIds } },
        _count: { viewId: true },
      }),
      prisma.proposalSession.groupBy({
        by: ['tokenId'],
        where: { tokenId: { in: tokenIds }, durationSeconds: { not: null } },
        _sum: { durationSeconds: true },
      }),
    ])

    const viewCountMap = Object.fromEntries(viewCounts.map(r => [r.tokenId, r._count.viewId]))
    const durationMap = Object.fromEntries(sessionTotals.map(r => [r.tokenId, r._sum.durationSeconds ?? 0]))

    const recipients = tokens.map(t => ({
      email: t.recipientEmail,
      isPortalUser: t.isPortalUser,
      viewed: !!t.usedAt,
      viewCount: viewCountMap[t.tokenId] ?? 0,
      totalSeconds: durationMap[t.tokenId] ?? 0,
    }))

    return NextResponse.json({
      recipients,
      firstViewedAt: proposal.firstViewedAt,
      lastViewedAt: proposal.lastViewedAt,
      totalViewCount: proposal.viewCount ?? 0,
    })
  } catch (err) {
    console.error('Tracking error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
