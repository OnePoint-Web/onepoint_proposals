"use client"
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout'
import Container from '@/components/layout/Container/Container'


export default function Dashboard(){

    const onLogout = async () => {
        console.log('loggin out')
        await fetch('/api/auth/logout', {
            method: 'POST'
        })
        console.log('jwt', process.env.JWT_SECRET)
        window.location.href = '/login'
    }

    return (
        <ChildLayout>
            <Container>
                <button onClick={onLogout}>logout</button>
            </Container>
        </ChildLayout>
    )
}