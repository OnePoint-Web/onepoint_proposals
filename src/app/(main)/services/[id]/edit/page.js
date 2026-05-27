import EditServicePage from './EditServicePage'
import { prisma } from '@/lib/prisma'

export default async function EditService({params}){
    const {id} = await params
    const serviceId = parseInt(id)

    const serviceData = await prisma.service.findUnique({
        where: { serviceId }
    })

    if (!serviceData) return <p>Service not found</p>

    const serializedData = {
        ...serviceData,
        price: serviceData.price.toString()
    }

    return <EditServicePage serviceData={serializedData}/>
}
