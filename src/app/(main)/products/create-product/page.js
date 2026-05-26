import ChildLayout from '@/components/layout/ChildLayout/ChildLayout'
import Container from '@/components/layout/Container/Container.js'
import ProductCreationForm from './components/ProductCreationForm'

export default function CreateProduct(){
    return(
        <ChildLayout>
            <Container>
                <ProductCreationForm/>
            </Container>
        </ChildLayout>
    )
}
