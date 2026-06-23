import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/getUserHelper'
import { recordActivity } from '@/services/activity/record-activity'

export async function GET(req) {
  try {
    await requireUser()

    const { searchParams } = new URL(req.url)
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1)
    const limit = Math.max(parseInt(searchParams.get('limit') || '12'), 1)
    const search = searchParams.get('search') || ''

    const where = search
      ? {
          OR: [
            { title: { contains: search } },
            { clientName: { contains: search } },
            { companyName: { contains: search } },
          ],
        }
      : {}

    const [sessions, total] = await Promise.all([
      prisma.discoverySession.findMany({
        where,
        select: {
          sessionId: true,
          title: true,
          clientName: true,
          companyName: true,
          industry: true,
          dateCreated: true,
          user: { select: { firstName: true, lastName: true } },
        },
        orderBy: { dateCreated: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.discoverySession.count({ where }),
    ])

    return NextResponse.json({
      data: sessions,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch discovery sessions' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const authUser = await requireUser()
    const body = await req.json()

    const { title, clientName, companyName, industry, services, website, additionalContext, overview, questions } = body

    if (!title || !clientName) {
      return NextResponse.json({ error: 'title and clientName are required' }, { status: 400 })
    }

    const session = await prisma.$transaction(async (tx) => {
      const created = await tx.discoverySession.create({
        data: {
          title,
          clientName,
          companyName: companyName || null,
          industry: industry || null,
          services: services || null,
          website: website || null,
          additionalContext: additionalContext || null,
          overview: overview || null,
          questions: questions || null,
          createdBy: authUser.userId,
        },
      })

      await recordActivity({
        tx,
        action: 'discovery_session_created',
        userId: authUser.userId,
        title: 'Discovery Session Created',
        message: `Created discovery session "${title}" for ${clientName}`,
        entityType: 'discovery',
        entityId: String(created.sessionId),
      })

      return created
    })

    return NextResponse.json({ session }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to save discovery session' }, { status: 500 })
  }
}
