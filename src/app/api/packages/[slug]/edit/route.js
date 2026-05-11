import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import {generateUniqueSlug} from '@/utils/slug.js'
import { requireUser } from "@/lib/getUserHelper"

export async function PATCH(req){
    try{
        const user = await requireUser()
        const data = await req.json

        const existing = await prisma.proposal.findUnique({
            where: { packageId: data.packageId },
            select: { package: true, slug: true }
        })

        let slug = existing.slug

        if (existing.package !== data.package) {
            slug = await generateUniqueSlug('package', data.package)
        }

        const result = await prisma.package.update({
            where: {packageId: data.packageId},
            data: {
                description: data.description,
                proposedSolution: data.proposedSolution,
                basePrice: data.basePrice,

                dealItems: {
                    deleteMany: {},
                    create: data.dealItems || []
                }
            },

            include: {
                packageId: true,
                slug: true,
                description: true,
                proposedSolution: true,
                basePrice: true,
                dealItems: {
                    include: {dealEntries: true}
                }
            }
        });

        return NextResponse.json(
            { message: "Package created", ...result },
            { status: 201 }
        )

    }catch(err){
        console.error("Unhandled error:", err)

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}




