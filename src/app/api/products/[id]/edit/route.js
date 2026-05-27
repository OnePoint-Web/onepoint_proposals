import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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
        const {id} = await params
        const productId = parseInt(id)
        const body = await readProductPayload(req)

        const updatedProduct = await prisma.product.update({
            where: { productId },
            data: body
        })

        return NextResponse.json(
            {message: 'Product updated', data: updatedProduct},
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
