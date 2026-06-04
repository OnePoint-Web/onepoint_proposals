import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/getUserHelper'

export async function PATCH(_req, { params }) {
    try {
        await requireUser()

        const { id } = await params
        const notificationId = parseInt(id)

        const updated = await prisma.notification.update({
            where: { notificationId },
            data: {
                isRead: true,
                readtAt: new Date()
            }
        })

        return NextResponse.json({ data: updated })

    } catch (err) {
        console.error('Error marking notification as read:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
