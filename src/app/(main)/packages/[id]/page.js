import ChildLayout from "@/components/layout/ChildLayout/ChildLayout";
import Container from "@/components/layout/Container/Container.js"
import styles from './page.module.scss'
import { prisma } from "@/lib/prisma";

  export default async function Package({params}){
  
  const { id } = await params;

  const packageData = await prisma.package.findUnique({
    where: { packageId: parseInt(id) },
  });

  if (!packageData) return <div>Package not found</div>;

     return(
        <ChildLayout>
            <Container>
                <div className={styles['package-container']}>
                  <p>packageData.packageItem</p>
                  <div className={styles['btn-container']}>
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                </div>

                <div className={styles['package-container']}>
                
                </div>
            </Container>
        </ChildLayout>
     )
}