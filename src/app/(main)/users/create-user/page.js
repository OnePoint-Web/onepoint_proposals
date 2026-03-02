import ChildLayout from "@/components/layout/ChildLayout/ChildLayout";
import Container from "@/components/layout/Container/Container.js"
import UserCreateForm from './components/UserCreationForm.js'

export default function CreateUser(){
   return( 
    <ChildLayout>
        <Container>
            <UserCreateForm/>
        </Container>
    </ChildLayout>
    
    )
}