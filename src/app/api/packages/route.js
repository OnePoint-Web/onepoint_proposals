import { NextResponse } from "next/server"
import { createPackageSchema } from "@/schemas/package/createPackage.schema"
import prisma from "@/lib/prisma"
import {generateUniqueSlug} from '@/utils/slug.js'


export async function POST(req){
    try{
        const body = await req.json()

        const data = createPackageSchema.parse(body)
        const slug = await generateUniqueSlug('package', data.package)

        const result = await prisma.package.create({
                data: {
                    slug,
                    package: data.package,
                    description: data.description,
                    proposedSolution: data.solution,
                    basePrice: data.price,
                    isActive: true,
                    dealItems: data.deals
                },
                include: { 
                    dealItems: {
                        include: {
                            dealEntries: true
                        }
                    }
                },
            });

        return NextResponse.json(
            { message: "Package created", ...result },
            { status: 201 }
        )

    }catch (err) {

        // Fallback for non-Prisma errors
        console.error("Unhandled error:", err)

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
        }
    }


export async function GET(req){
    try{
        const packages = await prisma.package.findMany({
            where: {
                isActive: true,
            },
            select: {
                packageId: true,
                slug: true,
                package: true,
                description: true,
                proposedSolution: true,
                basePrice: true,
                isActive: true,
                dateCreated: true,
                dateUpdated: true,
                dealItems: {
                    select: {
                            dealItemId: true,
                            dealItem: true,
                            itemType: true,
                            displayOrder: true,
                            dealEntries: true
                        }
                    }
            },
        })

        return NextResponse.json(packages)

    }catch(err){
        return NextResponse.json(
            {error: "Failed to fetch proposal packages"},
            {status: 500}
        )
    }
}