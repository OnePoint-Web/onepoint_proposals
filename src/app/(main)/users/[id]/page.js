import ChildLayout from "@/components/layout/ChildLayout/ChildLayout";
import Container from "@/components/layout/Container/Container.js"
import UserProfileForm from './components/UserProfileForm.js'

export default function UserPage(){
   return( 
    <ChildLayout>
        <Container>
            <UserProfileForm/>
        </Container>
    </ChildLayout>
    
    )
}