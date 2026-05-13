"use client"
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout'
import Container from '@/components/layout/Container/Container'
import useAuthAccess from '@/hooks/auth/authAccess'
import {useAuth} from '@/context/AuthContext'



export default function Dashboard(){

    const {user, onLogout} = useAuth()

    const {isAccessible} = useAuthAccess(1)
    

    return (
        <ChildLayout>
            <Container>
                {isAccessible && user &&  <button onClick={() => window.open('/api/proposals/[slug]/pdf')}>{user.username}</button>} 
            </Container>
        </ChildLayout>
    )
}