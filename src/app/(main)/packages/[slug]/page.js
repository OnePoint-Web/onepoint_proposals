import PackagePage from './PackagePage'
import { prisma } from "@/lib/prisma";

  export default async function Package({params}){
  
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


  if (!packageData) return <div>Package not found</div>;

  const serializedData = {
    ...packageData,
    basePrice: packageData.basePrice.toString()
  }

     return <PackagePage packageData={serializedData} slug={slug}/>
}


