import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireUser } from '@/lib/getUserHelper'

const RANGE_DAYS = {
    week: 7,
    month: 30,
    quarter: 90,
    year: 365,
}

export async function GET(req) {
    try {
        await requireUser()

        const { searchParams } = new URL(req.url)
        const range = searchParams.get('range') || 'month'
        const days = RANGE_DAYS[range] ?? RANGE_DAYS.month

        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        const dateFilter = { dateCreated: { gte: startDate } }

        const [sent, approved, declined] = await Promise.all([
            prisma.proposal.count({
                where: { ...dateFilter, statusId: { in: [3, 4, 5, 6] } }
            }),
            prisma.proposal.count({
                where: { ...dateFilter, statusId: 5 }
            }),
            prisma.proposal.count({
                where: { ...dateFilter, statusId: 6 }
            }),
        ])

        return NextResponse.json({ sent, approved, declined })

    } catch (err) {
        console.error('Dashboard stats error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
