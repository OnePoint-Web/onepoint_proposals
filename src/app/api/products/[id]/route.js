import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/getUserHelper'
import { recordActivity } from '@/services/activity/record-activity'

export async function GET(req, {params}){
    try{
        const {id} = await params
        const productId = parseInt(id)

        const product = await prisma.product.findUnique({
            where: { productId },
            select: {
                productId: true,
                product: true,
                price: true,
                description: true,
                productImage: true,
                dateCreated: true,
                dataUpdated: true
            }
        })

        if (!product) {
            return NextResponse.json(
                {message: 'Product not found'},
                {status: 404}
            )
        }

        return NextResponse.json(
            {message: 'Product fetched', data: product},
            {status: 200}
        )
    }catch(err){
        console.error('Error fetching product: ', err)
        return NextResponse.json(
            {message: 'Error fetching product'},
            {status: 500}
        )
    }
}

export async function DELETE(_req, {params}){
    try{
        const user = await requireUser()
        const {id} = await params
        const productId = parseInt(id)

        const existing = await prisma.product.findUnique({
            where: { productId },
            select: { product: true }
        })

        await prisma.$transaction(async (tx) => {
            await tx.product.delete({ where: { productId } })

            await recordActivity({
                tx,
                action: 'product_deleted',
                userId: user.userId,
                title: 'Product Deleted',
                message: `Deleted product "${existing?.product ?? productId}"`,
                entityType: 'products',
                entityId: String(productId)
            })
        })

        return NextResponse.json(
            {message: 'Product deleted successfully'},
            {status: 200}
        )
    }catch(err){
        console.error('Error deleting product: ', err)
        return NextResponse.json(
            {message: 'Product not found or could not be deleted'},
            {status: 404}
        )
    }
}
