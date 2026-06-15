import ChildLayout from "@/components/layout/ChildLayout/ChildLayout"
import Container from "@/components/layout/Container/Container"
import ClientEditForm from './components/ClientEditForm'

export default function ClientPage() {
    return (
        <ChildLayout>
            <Container>
                <ClientEditForm />
            </Container>
        </ChildLayout>
    )
}
