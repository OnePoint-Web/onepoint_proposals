import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server"
import { requireUser } from '@/lib/getUserHelper'
import { recordActivity } from '@/services/activity/record-activity'

export async function GET(_req, {params}) {
    const {id} = await params;

    try{
        const member = await prisma.teamMember.findUnique({
            where: {memberId: Number(id)}
        })

        if (!member) {
            return NextResponse.json({ message: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ data: member }, { status: 200 });

    } catch(err){
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}


export async function DELETE(_req, {params}){
    const {id} = await params
    const memberId = Number(id)

    try{
        const user = await requireUser()

        const existing = await prisma.teamMember.findUnique({
            where: { memberId },
            select: { memberName: true }
        })

        if (!existing) {
            return NextResponse.json(
                { message: "Member not found" },
                { status: 404 }
            );
        }

        await prisma.$transaction(async (tx) => {
            await tx.teamMember.update({
                where: { memberId },
                data: { deleted: true, isActive: false }
            })

            await recordActivity({
                tx,
                action: 'member_deleted',
                userId: user.userId,
                title: 'Member Deleted',
                message: `Deleted member "${existing?.memberName ?? memberId}"`,
                entityType: 'members',
                entityId: String(memberId)
            })
        })

        return NextResponse.json({ message: 'Member deleted successfully' }, { status: 200 })
    } catch(err){
        console.error('Error deleting member:', err)
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}