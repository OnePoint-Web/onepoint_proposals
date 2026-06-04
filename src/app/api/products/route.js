import {prisma} from '@/lib/prisma'
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
        let imageUrl = null

        if (image && image.size > 0) {
            const buffer = Buffer.from(await image.arrayBuffer())
            const fileName = `${Date.now()}-${image.name}`
            const uploadPath = path.join(process.cwd(), 'public/uploads', fileName)
            await fs.promises.writeFile(uploadPath, buffer)
            imageUrl = `/uploads/${fileName}`
        }

        return {
            product: formData.get('product'),
            price: Number(formData.get('price')),
            description: formData.get('description'),
            productImage: imageUrl
        }
    }

    const body = await req.json()
    return {
        product: body.product,
        price: body.price,
        description: body.description,
        productImage: body.productImage || null
    }
}

export async function POST(req){
    try{
        const user = await requireUser()
        const body = await readProductPayload(req)

        const result = await prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data:{
                    product: body.product,
                    price: body.price,
                    description: body.description,
                    productImage: body.productImage
                }
            })

            await recordActivity({
                tx,
                action: 'product_created',
                userId: user.userId,
                title: 'Product Created',
                message: `Created product "${body.product}"`,
                entityType: 'products',
                entityId: String(product.productId)
            })

            return product
        })

        return NextResponse.json(
            {message: 'Successfully created product', data: result},
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

export async function GET(req){
    try{
        const {searchParams} = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "12")
        const search = searchParams.get("search") || ""
        const sortBy = searchParams.get("sortBy") || "dateCreated"
        const sortOrder = searchParams.get("sortOrder") || "desc"

        const safePage = Math.max(page, 1)
        const safeLimit = Math.max(limit, 1)
        const searchTerms = search.trim().split(" ").filter(Boolean)

        const where = {
            ...(searchTerms.length > 0 && {
                AND: searchTerms.map((term) => ({
                    OR: [
                        { product: { contains: term } },
                        { description: { contains: term } },
                    ],
                })),
            }),
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                select: {
                    productId: true,
                    product: true,
                    price: true,
                    description: true,
                    productImage: true,
                    dateCreated: true
                },
                skip: (safePage - 1) * safeLimit,
                take: safeLimit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            prisma.product.count({ where }),
        ])

        return NextResponse.json(
            {
                message: 'Successfully fetched products',
                data: products,
                meta: {
                    total,
                    page: safePage,
                    limit: safeLimit,
                    totalPages: Math.ceil(total / safeLimit),
                },
            },
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
