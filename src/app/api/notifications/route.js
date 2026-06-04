import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/getUserHelper'

export async function GET() {
    try {
        const user = await requireUser()

        const notifications = await prisma.notification.findMany({
            where: {
                userId: user.userId,
                isRead: false
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        })

        return NextResponse.json({ data: notifications })

    } catch (err) {
        console.error('Error fetching notifications:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
