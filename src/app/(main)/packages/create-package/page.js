import ChildLayout from "@/components/layout/ChildLayout/ChildLayout";
import Container from "@/components/layout/Container/Container.js"
import PackageCreationForm from './components/PackageCreationForm.js'

export default function CreatePackage(){
   return( 
    <ChildLayout>
        <Container>
            <PackageCreationForm/>
        </Container>
    </ChildLayout>
    
    )
}