import {prisma} from '@/lib/prisma'
import {NextResponse} from 'next/server'


export async function PATCH(req, {params}){
    
    try{
        const {id} = await params
        const serviceId = parseInt(id)
        
        const body = await req.json()

        const updateService = await prisma.service.update({
            where: {serviceId},
            data: {
                service: body.service,
                price: body.price,
                description: body.description
            }
        })

        return NextResponse.json(
            {message: 'Service updated', data: updateService},
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
