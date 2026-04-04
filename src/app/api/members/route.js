import { NextResponse } from "next/server"
import { createMemberSchema } from "@/schemas/member/createMember.schema"
import prisma from "@/lib/prisma"
import fs from "fs"
import path from "path"

export async function POST(req) {
  try {
    const formData = await req.formData()

    const data = {
      member_name: formData.get("member_name"),
      role: formData.get("role"),
      description: formData.get("description"),
      image: formData.get("image") // optional file
    }

    // Validate text fields
    const parsed = createMemberSchema.parse(data)

    // Handle file upload
    let imageUrl = null
    const file = formData.get("image")
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const fileName = `${Date.now()}-${file.name}`
      const uploadPath = path.join(process.cwd(), "public/uploads", fileName)
      await fs.promises.writeFile(uploadPath, buffer)
      imageUrl = `/uploads/${fileName}`
    }

    const user = await prisma.teamMember.create({
      data: {
        memberName: parsed.member_name,
        memberRole: parsed.role,
        description: parsed.description,
        memberImage: imageUrl,
        isActive: true
      },
      select: {
        memberName: true,
        memberRole: true,
        description: true,
        memberImage: true,
        isActive: true,
        dateCreated: true
      }
    })

    return NextResponse.json({ message: "Member Created", user }, { status: 201 })
  } catch (err) {
    console.error("Unhandled error:", err)
    if (err.name === "ZodError") {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(req){
    try{

        const member = await prisma.teamMember.findMany({
            where: {
                isActive: true,
            },
            select: {
                memberId: true,
                memberName: true,
                memberRole: true,
                memberImage: true,
                description: true,
                isActive: true,
                dateCreated: true,
                dateUpdated: true,
                    
            }     
        })

        return NextResponse.json(member)

    }catch(err){
        return NextResponse.json(
            {error: "Failed to fetch members"},
            {status: 500}
        )
    }
}