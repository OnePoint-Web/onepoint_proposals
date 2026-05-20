import { NextResponse } from "next/server"
import { createPackageSchema } from "@/schemas/package/createPackage.schema"
import prisma from "@/lib/prisma"
import {generateUniqueSlug} from '@/utils/slug.js'


export async function POST(req){
    try{
        const body = await req.json()

        const data = createPackageSchema.parse(body)
        const slug = await generateUniqueSlug('package', data.package)

        console.log('prismadata', data.dealItems)

        const duplicate = await prisma.package.findFirst({
            where: {
                package: data.package,
            }
        })

        if (duplicate) {
            return NextResponse.json(
                {
                message: "Package title already exists",
                field: "package"
                },
                { status: 409 }
            )
        }

        const result = await prisma.package.create({
                data: {
                    slug,
                    package: data.package,
                    description: data.description,
                    proposedSolution: data.solution,
                    basePrice: data.price,
                    isActive: true,
                    dealItems: {create: data.dealItems}
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

        console.error("Unhandled error:", err)

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
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
            ...(status && { isActive: status === 'true' }),

            ...(searchTerms.length > 0 && {
                AND: searchTerms.map((term) => ({
                    OR: [
                        {
                            package: {
                                contains: term,
                            },
                        },
                    ]
                }))
            })
        }
        
        const [packages, total] = await Promise.all([
            prisma.package.findMany({
            where,
    
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
    
            skip: (safePage - 1) * safeLimit,
            take: safeLimit,
    
            orderBy: {
                [sortBy]: sortOrder,
            },
            }),
    
            prisma.package.count({
                where,
            }),
        ]);

        return Response.json({
            data: packages,
            meta: {
                total,
                page: safePage,
                limit: safeLimit,
                totalPages: Math.ceil(total / safeLimit),
            },
        });


    }catch(err){
        return NextResponse.json(
            {error: "Failed to fetch proposal packages"},
            {status: 500}
        )
    }
}