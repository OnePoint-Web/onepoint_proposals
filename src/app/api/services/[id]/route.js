import {prisma} from '@/lib/prisma'
import {NextResponse} from 'next/server'
import { requireUser } from '@/lib/getUserHelper'
import { recordActivity } from '@/services/activity/record-activity'


export async function GET(_req, {params}){
    try{
        const {id} = await params
        const serviceId = parseInt(id)

        const service = await prisma.service.findUnique({
            where: {serviceId},
            select: {
                serviceId: true,
                service: true,
                price: true,
                description: true,
                dateCreated: true,
                dataUpdated: true
            }
        })

        if (!service) {
            return NextResponse.json(
                {message: 'Service not found'},
                {status: 404}
            )
        }

        return NextResponse.json(
            { message: 'Service fetched', data: service },
            {status: 200}
        )

    }catch(err){
        console.error('Error fetching service: ', err)
        return NextResponse.json(
            {message: 'Error fetching service'},
            {status: 500}
        )
    }
}

export async function DELETE(_req, {params}){
    try{
        const user = await requireUser()
        const {id} = await params
        const serviceId = parseInt(id)

        const existing = await prisma.service.findUnique({
            where: {serviceId},
            select: { service: true }
        })

        await prisma.$transaction(async (tx) => {
            await tx.service.delete({ where: {serviceId} })

            await recordActivity({
                tx,
                action: 'service_deleted',
                userId: user.userId,
                title: 'Service Deleted',
                message: `Deleted service "${existing?.service ?? serviceId}"`,
                entityType: 'services',
                entityId: serviceId
            })
        })

        return NextResponse.json(
            {message: 'Service deleted successfully'},
            {status: 200}
        )
    }catch(err){
        console.error('Error deleting service: ', err)
        return NextResponse.json(
            {message: 'Service not found or could not be deleted'},
            {status: 404}
        )
    }
}
