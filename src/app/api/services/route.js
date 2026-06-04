import {prisma} from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/getUserHelper'
import { recordActivity } from '@/services/activity/record-activity'

export async function POST(req){

    try{
        const user = await requireUser()
        const body = await req.json()

        const result = await prisma.$transaction(async (tx) => {
            const service = await tx.service.create({
                data: {
                    service: body.service,
                    price: body.price,
                    description: body.description
                }
            })

            await recordActivity({
                tx,
                action: 'service_created',
                userId: user.userId,
                title: 'Service Created',
                message: `Created service "${body.service}"`,
                entityType: 'services',
                entityId: String(service.serviceId)
            })

            return service
        })

        return NextResponse.json(
            { message: 'Service successfully created', data: result },
            {status: 201}
        )

    }catch(err){
        console.error('Error creating service: ', err)
        return NextResponse.json(
            {message: 'Error creating service'},
            {status: 500}
        )
    }
}

export async function GET(req){
    try{
        const {searchParams} = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "12")
        const search = searchParams.get("search") || ""
        const sortBy = searchParams.get("sortBy") || "dateCreated"
        const sortOrder = searchParams.get("sortOrder") || "desc"

        const safePage = Math.max(page, 1)
        const safeLimit = Math.max(limit, 1)
        const searchTerms = search.trim().split(" ").filter(Boolean)

        const where = {
            ...(searchTerms.length > 0 && {
                AND: searchTerms.map((term) => ({
                    OR: [
                        { service: { contains: term } },
                        { description: { contains: term } },
                    ],
                })),
            }),
        }
  
        const [services, total] = await Promise.all([
            prisma.service.findMany({
                where,
                select: {
                    serviceId: true,
                    service: true,
                    price: true,
                    description: true,
                    dateCreated: true
                },
                skip: (safePage - 1) * safeLimit,
                take: safeLimit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            prisma.service.count({ where }),
        ])

        return NextResponse.json(
            {
                data: services,
                meta: {
                    total,
                    page: safePage,
                    limit: safeLimit,
                    totalPages: Math.ceil(total / safeLimit),
                },
            },
            {status: 200}       
        )

    }catch(err){
        console.log('Error creating service')
        return NextResponse.json(
        {message: 'Error creating service'}, 
        {status: 500})
    }
}
