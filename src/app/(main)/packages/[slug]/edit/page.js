import styles from './page.module.scss'
import { prisma } from "@/lib/prisma";
import EditPackagePage from './EditPackagePage'

export default async function EditPackage({params}){

    const { slug } = await params;
     const packageData = await prisma.package.findUnique({
        where: { slug },
        include: {
            dealItems: {
            include: {       
                dealEntries: true
            },
            }
        },

    });

    if(!packageData) return <p>Package not found</p>

    const serializedData = {
        ...packageData,
        dealItems: packageData.dealItems.map(d => ({
            packageDealItemId: d.dealItemId,
            item: d.dealItem,
            itemType: d.itemType,
            displayOrder: d.displayOrder,
            packageDealEntries: d.dealEntries
        })),
        basePrice: packageData.basePrice.toString()
    }

    return <EditPackagePage packageData={serializedData}/>
}