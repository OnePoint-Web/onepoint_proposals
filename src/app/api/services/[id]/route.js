import {prisma} from '@/lib/prisma'
import {NextResponse} from 'next/server'


export async function GET(req, {params}){
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
            {
                message: 'Service fetched',
                data: service
            },
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

export async function DELETE(req, {params}){
    try{
        const {id} = await params
        const serviceId = parseInt(id)

        const deletedService = await prisma.service.delete({
            where: {serviceId}
        })

        return NextResponse.json(
            {message: 'Service deleted successfully', data: deletedService},
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
