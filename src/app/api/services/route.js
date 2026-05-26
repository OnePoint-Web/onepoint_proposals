import {prisma} from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req){

    try{
        const body = await req.json()

        const service = await prisma.service.create({
            data: {
                service: body.service,
                price: body.price,
                description: body.description
            }
        })

        return NextResponse.json(
            {   message: 'Service successfully created', 
                data: service
            },
            {status: 201}
        )

    }catch(err){
        console.error('Error creating servce: ', err)
        return NextResponse.json(
            {message: 'Error creating service'},
            {status: 500}
        )
    }
}

export async function GET(req){
    try{
  
        const services = await prisma.service.findMany({
            select: {
                serviceId: true,
                service: true,
                price: true,
                description: true
            }
        })

        return NextResponse.json(
            {data: services},
            {status: 200}       
        )

    }catch(err){
        console.log('Error creating service')
        return NextResponse.json(
        {message: 'Error creating service'}, 
        {status: 500})
    }
}