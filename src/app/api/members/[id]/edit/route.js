import {NextResponse} from 'next/server'
import { prisma } from "@/lib/prisma"
import fs from "fs"
import path from "path"
import { requireUser } from "@/lib/getUserHelper"
import { recordActivity } from "@/services/activity/record-activity"

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

        const updateData = {
            memberName: member_name,
            memberRole: role,
            description,
        }

        if (image && image.size > 0) {
            const buffer = Buffer.from(await image.arrayBuffer())
            const fileName = `${Date.now()}-${image.name}`
            const uploadPath = path.join(process.cwd(), "public/uploads", fileName)
            await fs.promises.writeFile(uploadPath, buffer)
            updateData.memberImage = `/uploads/${fileName}`
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