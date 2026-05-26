import ChildLayout from '@/components/layout/ChildLayout/ChildLayout'
import Container from '@/components/layout/Container/Container.js'
import ServiceCreationForm from './components/ServiceCreationForm'

export default function CreateService(){
    return(
        <ChildLayout>
            <Container>
                <ServiceCreationForm/>
            </Container>
        </ChildLayout>
    )
}
