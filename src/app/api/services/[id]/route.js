import {prisma} from '@/lib/prisma'
import {NextResponse} from 'next/navigation'


export async function GET(req, {params}){
    try{
        const {id} = params

        const service = await prisma.service.findUnique({
            where: {serviceI: id},
            select: {
                serviceId: true,
                service: true,
                price: true,
                description: true
            }
        })

        return NextResponse.json(
            {
                message: 'Service fetched',
                data: service
            },
            {status: 200}
        )

    }catch(err){
        console.err('Error fetching service: ', err)
        return NextResponse.json(
            {message: 'Error fetching service'},
            {status: 500}
        )
    }
}

