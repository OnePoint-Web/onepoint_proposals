import {prisma} from '@/lib/prisma'
import {NextResponse} from 'next/navigation'


export async function PATCH(req, {params}){
    
    try{
        const {id} = params
        
        const body = await req.json()

        const updateService = await prisma.service.update({
            where: {serviceId: id},
            data: {
                service: body.service,
                price: body.price,
                description: body.description
            }
        })

        return NextResponse.json(
            {message: 'Servie Updated', data: updateService},
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