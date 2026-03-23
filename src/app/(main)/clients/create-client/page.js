import ChildLayout from "@/components/layout/ChildLayout/ChildLayout";
import Container from "@/components/layout/Container/Container.js"
import ClientCreationForm from './components/ClientCreationForm.js'

export default function CreateUser(){
   return( 
    <ChildLayout>
        <Container>
            <ClientCreationForm/>
        </Container>
    </ChildLayout>
    
    )
}