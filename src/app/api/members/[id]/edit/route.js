import {NextResponse} from 'next/server'
import prisma from "@/lib/prisma"
import fs from "fs"
import path from "path"

export async function PATCH(req, { params }) {
    const { id } = await params

    try{
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

        // only update image IF new image uploaded
        if (image && image.size > 0) {

            const buffer = Buffer.from(await file.arrayBuffer())
            const fileName = `${Date.now()}-${file.name}`
            const uploadPath = path.join(process.cwd(), "public/uploads", fileName)
            await fs.promises.writeFile(uploadPath, buffer)
            const imageUrl = `/uploads/${fileName}`

            updateData.memberImage = imageUrl
        }

        const updatedMember = await prisma.teamMember.update({
            where: {
                memberId: Number(id)
            },
            data: updateData
        })

        return NextResponse.json({updated: updatedMember}, {status: 200})
    }catch(err){
         return NextResponse.json(
            {error: "Failed to update member"},
            {status: 500}
        )

    }
    
}