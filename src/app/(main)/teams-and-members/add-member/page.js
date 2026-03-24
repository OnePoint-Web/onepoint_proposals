import ChildLayout from "@/components/layout/ChildLayout/ChildLayout";
import Container from "@/components/layout/Container/Container.js"
import CreateMemberForm from './components/CreateMemberForm.js'

export default function CreateUser(){
   return( 
    <ChildLayout>
        <Container>
            <CreateMemberForm/>
        </Container>
    </ChildLayout>
    
    )
}