import ProductPage from './ProductPage'
import { prisma } from '@/lib/prisma'

export default async function Product({params}){
    const {id} = await params
    const productId = parseInt(id)

    const productData = await prisma.product.findUnique({
        where: { productId }
    })

    if (!productData) return <p>Product not found</p>

    const serializedData = {
        ...productData,
        price: productData.price.toString()
    }

    return <ProductPage productData={serializedData}/>
}
