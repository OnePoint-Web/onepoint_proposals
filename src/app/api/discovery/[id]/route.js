import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/getUserHelper'
import { recordActivity } from '@/services/activity/record-activity'

export async function GET(req, { params }) {
  try {
    await requireUser()
    const { id } = await params
    const sessionId = parseInt(id)

    const session = await prisma.discoverySession.findUnique({
      where: { sessionId },
      include: { user: { select: { firstName: true, lastName: true } } },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json({ session })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 })
  }
}

export async function PATCH(req, { params }) {
  try {
    const authUser = await requireUser()
    const { id } = await params
    const sessionId = parseInt(id)
    const body = await req.json()

    const { overview, questions } = body

    const session = await prisma.$transaction(async (tx) => {
      const updated = await tx.discoverySession.update({
        where: { sessionId },
        data: {
          ...(overview !== undefined && { overview }),
          ...(questions !== undefined && { questions }),
        },
      })

      await recordActivity({
        tx,
        action: 'discovery_session_updated',
        userId: authUser.userId,
        title: 'Discovery Session Updated',
        message: `Updated discovery session "${updated.title}"`,
        entityType: 'discovery',
        entityId: String(sessionId),
      })

      return updated
    })

    return NextResponse.json({ session })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const authUser = await requireUser()
    const { id } = await params
    const sessionId = parseInt(id)

    await prisma.$transaction(async (tx) => {
      const session = await tx.discoverySession.delete({ where: { sessionId } })

      await recordActivity({
        tx,
        action: 'discovery_session_deleted',
        userId: authUser.userId,
        title: 'Discovery Session Deleted',
        message: `Deleted discovery session "${session.title}"`,
        entityType: 'discovery',
        entityId: String(sessionId),
      })
    })

    return NextResponse.json({ message: 'Session deleted' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 })
  }
}
