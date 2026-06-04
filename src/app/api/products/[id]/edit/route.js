import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { requireUser } from '@/lib/getUserHelper'
import { recordActivity } from '@/services/activity/record-activity'

async function readProductPayload(req){
    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
        const formData = await req.formData()
        const image = formData.get('image')
        const updateData = {
            product: formData.get('product'),
            price: Number(formData.get('price')),
            description: formData.get('description')
        }
        const removeImage = formData.get('removeImage') === 'true'

        if (image && image.size > 0) {
            const buffer = Buffer.from(await image.arrayBuffer())
            const fileName = `${Date.now()}-${image.name}`
            const uploadPath = path.join(process.cwd(), 'public/uploads', fileName)
            await fs.promises.writeFile(uploadPath, buffer)
            updateData.productImage = `/uploads/${fileName}`
        } else if (removeImage) {
            updateData.productImage = null
        }

        return updateData
    }

    const body = await req.json()
    return {
        product: body.product,
        price: body.price,
        description: body.description,
        ...(body.productImage !== undefined && { productImage: body.productImage })
    }
}

export async function PATCH(req, {params}){
    try{
        const user = await requireUser()
        const {id} = await params
        const productId = parseInt(id)
        const body = await readProductPayload(req)

        const result = await prisma.$transaction(async (tx) => {
            const updated = await tx.product.update({
                where: { productId },
                data: body
            })

            await recordActivity({
                tx,
                action: 'product_updated',
                userId: user.userId,
                title: 'Product Updated',
                message: `Updated product "${body.product}"`,
                entityType: 'products',
                entityId: productId
            })

            return updated
        })

        return NextResponse.json(
            {message: 'Product updated', data: result},
            {status: 200}
        )
    }catch(err){
        console.error('Error updating product: ', err)
        return NextResponse.json(
            {message: 'Error updating product'},
            {status: 500}
        )
    }
}
