'use client'
import styles from './page.module.scss'
import Container from '@/components/layout/Container/Container.js'
import ChildLayout from '@/components/layout/ChildLayout/ChildLayout.js'
import MemberCard from '@/components/ui/member-card/MemberCard.js'
import {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'

export default function MembersPage(){

    const router = useRouter();
    const [members, setMembers] = useState([])

    useEffect(() => {
        fetch('api/members')
        .then(res => res.json())
        .then(data => {
            const allMembers = data.map(member => ({
                id: member.memberId,
                memberImage: member.memberImage,
                memberName: member.memberName,
                memberRole: member.memberRole,
                description: member.description 
            }))
            setMembers(allMembers)
        })
    }, [])

    return(
        <ChildLayout>

            <Container>
                
                <div className={styles['member-container']}>

                    {members.map((m, i) => (
                        <MemberCard
                            key={i}
                            image={m.memberImage}
                            name={m.memberName}
                            role={m.memberRole}
                            description={m.description}
                            onClick={() => router.push(`teams-and-members/${m.id}`)}
                        />
                    ))}
                
                </div>

            </Container>

        </ChildLayout>
    )
}