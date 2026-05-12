    import { NextResponse } from "next/server"
    import prisma from "@/lib/prisma"
    import { Prisma } from "@/lib/prisma"
    import {generateUniqueSlug} from '@/utils/slug.js'
    import { requireUser } from "@/lib/getUserHelper"
    import { createPackageSchema } from "@/schemas/package/createPackage.schema"

    export async function PATCH(req, {params}){
        
        try{
            const user = await requireUser()
            const body = await req.json()
            const data = createPackageSchema.parse(body)

            const duplicate = await prisma.package.findFirst({
                where: {
                    package: data.package,
                    NOT: {
                    packageId: body.packageId
                    }
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

            console.log(body.packageId)

            const existing = await prisma.package.findUnique({
                where: { packageId: body.packageId },
                select: { package: true, slug: true }
            })

            let slug = existing.slug

            if (existing.package !== data.package) {
                slug = await generateUniqueSlug('package', data.package)
            }

            const result = await prisma.package.update({
                where: {packageId: body.packageId},
                data: {
                    slug,
                    package: data.package,
                    description: data.description,
                    proposedSolution: data.solution,
                    basePrice: data.price,

                    dealItems: {
                        deleteMany: {},
                        create: data.dealItems || []
                    }
                },

                select: {
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

            if (err?.message?.includes("Out of range value")) {
                return NextResponse.json(
                {
                    message: "Base price exceeds maximum allowed value",
                    field: "price"
                },
                { status: 400 }
                )
            }

            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                console.log('ERROR:', err)
            // Unique constraint violation
            if (err.code === "P2002") {
                return NextResponse.json(
                {
                    message: "Duplicate value detected",
                    field: err.meta?.target
                },
                { status: 409 }
                )
            }

            // Record not found
            if (err.code === "P2025") {
                return NextResponse.json(
                {
                    error: "Record not found"
                },
                { status: 404 }
                )
            }

            // Foreign key constraint
            if (err.code === "P2003") {
                return NextResponse.json(
                {
                    error: "Invalid relation reference"
                },
                { status: 400 }
                )
            }
            }

            console.error("Unhandled error:", err)
            
            return NextResponse.json(
                { error: "Internal Server Error" },
                { status: 500 }
            )
        }
    }




