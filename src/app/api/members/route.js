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
        const {searchParams} = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");

        const search = searchParams.get("search") || "";
        const status = searchParams.get("status");

        const sortBy = searchParams.get("sortBy") || "dateCreated";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        const safePage = Math.max(page, 1);
        const safeLimit = Math.max(limit, 1);

        const searchTerms = search
            .trim()
            .split(" ")
            .filter(Boolean);

        const where = {
            ...(status && { isActive: status === 'true'}),

            ...(searchTerms.length > 0 && {
                AND: searchTerms.map((term) => ({
                    OR: [
                        {
                            memberName: {
                                contains: term,
                            },
                        },
                        {
                            memberRole: {
                                contains: term,
                            }
                        },
                    ]
                }))
            })
        }


        const [members, total] = await Promise.all([
                    prisma.teamMember.findMany({
                    where,
            
                    select: {
                        memberId: true,
                        memberName: true,
                        memberRole: true,
                        memberImage: true,
                        description: true,
                        isActive: true,
                        dateCreated: true,
                        dateUpdated: true,
                    },
            
                    skip: (safePage - 1) * safeLimit,
                    take: safeLimit,
            
                    orderBy: {
                        [sortBy]: sortOrder,
                    },
                    }),
            
                    prisma.teamMember.count({
                        where,
                    }),
                  ]);
        
        
                return Response.json({
                    data: members,
                    meta: {
                        total,
                        page: safePage,
                        limit: safeLimit,
                        totalPages: Math.ceil(total / safeLimit),
                    },
                });
    }catch(err){
        return NextResponse.json(
            {error: "Failed to fetch members"},
            {status: 500}
        )
    }
}