import {prisma} from '@/lib/prisma'
import {NextResponse} from 'next/server'
import { requireUser } from '@/lib/getUserHelper'
import { recordActivity } from '@/services/activity/record-activity'


export async function PATCH(req, {params}){

    try{
        const user = await requireUser()
        const {id} = await params
        const serviceId = parseInt(id)

        const body = await req.json()

        const result = await prisma.$transaction(async (tx) => {
            const updated = await tx.service.update({
                where: {serviceId},
                data: {
                    service: body.service,
                    price: body.price,
                    description: body.description
                }
            })

            await recordActivity({
                tx,
                action: 'service_updated',
                userId: user.userId,
                title: 'Service Updated',
                message: `Updated service "${body.service}"`,
                entityType: 'services',
                entityId: String(serviceId)
            })

            return updated
        })

        return NextResponse.json(
            {message: 'Service updated', data: result},
            {status: 200}
        )
    }catch(err){
        console.error('Error updating service: ', err)

        return NextResponse.json(
            {message: 'Error updating service'},
            {status: 500}
        )
    }
}
