import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/getUserHelper'
import { recordActivity } from '@/services/activity/record-activity'

export async function DELETE(req){
    try{
        const user = await requireUser()
        const body = await req.json()

        const proposalId = Number(body.proposalId)

        const existing = await prisma.proposal.findUnique({
            where: { proposalId },
            select: { proposalTitle: true, slug: true }
        })

        await prisma.$transaction(async (tx) => {
            await tx.proposal.delete({ where: { proposalId } })

            await recordActivity({
                tx,
                action: 'proposal_deleted',
                userId: user.userId,
                title: 'Proposal Deleted',
                message: `Deleted proposal "${existing?.proposalTitle ?? proposalId}"`,
                entityType: 'proposals',
                entityId: existing?.slug ?? String(proposalId)
            })
        })

        return NextResponse.json({
            message: "Proposal deleted successfully",
            status: "success",
        })
    }catch(err){
        return NextResponse.json(
            { message: err.message || "Failed to delete proposal", status: "error" },
            { status: 500 }
        )
    }
}