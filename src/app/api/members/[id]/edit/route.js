import {NextResponse} from 'next/server'
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/getUserHelper"
import { recordActivity } from "@/services/activity/record-activity"
import { uploadToR2 } from "@/lib/uploadToR2"

export async function PATCH(req, { params }) {
    const { id } = await params
    const memberId = Number(id)

    try{
        const authUser = await requireUser()
        const formData = await req.formData()

        const member_name = formData.get("member_name")
        const role = formData.get("role")
        const description = formData.get("description")
        const image = formData.get("image")
        const removeImage = formData.get("removeImage") === "true"

        const updateData = {
            memberName: member_name,
            memberRole: role,
            description,
        }

        if (image && image.size > 0) {
            const { url } = await uploadToR2(image, { folder: 'members', uploadedBy: authUser.userId })
            updateData.memberImage = url
        } else if (removeImage) {
            updateData.memberImage = null
        }

        const result = await prisma.$transaction(async (tx) => {
            const updated = await tx.teamMember.update({
                where: { memberId },
                data: updateData
            })

            await recordActivity({
                tx,
                action: 'member_updated',
                userId: authUser.userId,
                title: 'Member Updated',
                message: `Updated member "${member_name}"`,
                entityType: 'members',
                entityId: String(memberId)
            })

            return updated
        })

        return NextResponse.json({updated: result}, {status: 200})
    }catch(err){
        console.error('Error updating member:', err)
        return NextResponse.json(
            {error: "Failed to update member"},
            {status: 500}
        )
    }
}