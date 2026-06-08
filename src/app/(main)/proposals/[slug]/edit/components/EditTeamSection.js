import styles from './components.module.scss'
import MemberCard from '@/components/ui/member-card/MemberCard'
import Checkbox from '@/components/ui/checkbox/Checkbox'
import {useEffect, useState} from 'react'

export default function EditTeamSection({
    membersState,
    dispatch
}){

    const [members, setMembers] = useState([])

    useEffect(() => {
        fetch('/api/members')
        .then(res => res.json())
        .then(data => {
            const membersOptions = (data.data || []).map(member => ({
                memberId: member.memberId,
                memberName: member.memberName,
                memberRole: member.memberRole,
                memberImage: member.memberImage,
                description: member.description
            }))
            setMembers(membersOptions)
        })
    }, [])

    const handleRemove = () => {

    }

    return(
        <div className={styles['child-container']}>
            <div className={styles['checkbox-container']}>
                {members.map(member => (
                    <Checkbox key={member.memberId} 
                    label={member.memberName}
                    checked={membersState.some(m => m.memberId === member.memberId)}
                    onChange={() =>{
                        console.log(membersState)
                        dispatch({
                            type: 'TOGGLE_TEAM_MEMBER',
                            payload: {
                                memberId: member.memberId,
                                memberName: member.memberName, 
                                memberImage: member.memberImage, 
                                memberRole: member.memberRole, 
                                description: member.description
                            }
                        })}
                        }
                    />
                ))}
            </div>

            
            
            <hr></hr>

            <div className={styles['team-container']}>
                 {membersState.map(m => (
                    <MemberCard
                        key={m.memberId}
                        name={m.teamMember.memberName}
                        image={m.teamMember.memberImage}
                        role={m.teamMember.memberRole}
                        description={m.teamMember.description}
                        onDelete={()=>{
                            dispatch({
                                type: 'TOGGLE_TEAM_MEMBER',
                                payload: {
                                    memberId: m.memberId,
                                    memberName: m.teamMember.memberName, 
                                    memberImage: m.teamMember.memberImage, 
                                    memberRole: m.teamMember.memberRole, 
                                    description: m.teamMember.description
                                }
                            })
                        }}
                    />
                ))}
            </div>
           

        </div>
    )
}