import {prisma} from '@/lib/prisma'
import { NextResponse } from 'next/server'


export async function POST(req){
    try{
        const body = req.json()

        const product = await prisma.product.create({
            data:{
                product: body.product,
                price: body.price,
                productImage: body.productImage,
                description: body.description
            }
        })

        return NextResponse.json(
            {message: 'Successfully created product', data: product},
            {status: 201}
        )

    }catch(err){
        console.error('Error creating product', err)
        return NextResponse.json(
            {message: 'Error creating product'},
            {status: 500}
        )
    }
}

export async function GET(){
    try{

        const products = await prisma.product.findMany({
            select: {
                productId: true,
                product: true,
                price: true,
                description: true,
                productImage: true
            }
        })

        return NextResponse.json(
            {message: 'Successfully fetched products', data: products},
            {status: 200}
        )

    }catch(err){
        console.error('Error fetching products: ', err)

        return NextResponse.json(
            {message: 'Error fetching products'},
            {status: 500}
        )
    }
}