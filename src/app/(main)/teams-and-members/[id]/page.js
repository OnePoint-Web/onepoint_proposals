'use client'
import Container from "@/components/layout/Container/Container"
import { useParams } from "next/navigation"
import {useEffect, useState} from 'react'
import Button from "@/components/ui/button/Button"
import styles from './page.module.scss'
import SuccessModal from '@/components/ui/success-modal/SuccessModal'
import {useRouter} from 'next/navigation'
import {Icons} from '@/components/icons/icons'

    const ErrorIcon = Icons.error
    const MemberIcon = Icons.teamIcon


export default function MemberPage({}){

    const router = useRouter()

    const params = useParams()
    const {id} = params

    const [member, setMember] = useState({})
    const [toggleDeleteModal, setToggleDeletedModal] = useState(false)
    const [toggleModal, setToggleModal] = useState(false)

    useEffect(() => {
        fetch(`/api/members/${id}`)
        .then(res => res.json())
        .then(result => {
            const memberData = result.data

            setMember(memberData)
        })
    }, [])

    const deleteMember = async (id) => {
        try {
            const res = await fetch(`/api/members/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete member");
            }

            let result = null;
            const contentType = res.headers.get("content-type");

            if (contentType?.includes("application/json")) {
                result = await res.json();
            }

            setToggleDeletedModal(false);

            router.push("/teams-and-members");

        } catch (err) {
            console.error("Delete error:", err);
        }   
    };

    if(!member) return <p>Member Not Found</p>

    return(
        <Container>
            <div className={styles['member-profile']}>
                <h2>Member Profile</h2>

                <hr></hr>

                <div className={styles['profile-child']}>

                        <img src={member.memberImage || '/profile-placeholder.png'} alt={member.memberName} />

                    <div className={styles['profile-section']}>
                        <table>
                            <tbody>
                                <tr>
                                    <td className={styles['label-td']}> <p className={styles['text']}> <span>Name: </span></p></td>
                                    <td> <p className={styles['text']}>{member.memberName} </p></td>
                                </tr>
                                <tr>
                                    <td className={styles['label-td']}> <p className={styles['text']}> <span>Position: </span></p></td>
                                    <td> <p className={styles['text']}>{member.memberRole}</p></td>
                                </tr>
                                <tr>
                                    <td className={styles['label-td']}> <p className={styles['text']}> <span>Description: </span></p></td>
                                    <td> <p className={styles['text']}>{member.description}</p></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                </div>
            </div>

            <div className={styles['buttons']}>
                <Button 
                    color='dark'
                    label='Edit Member Details'
                    onClick={() => {router.push(`/teams-and-members/${id}/edit`)}}
                />

                <Button 
                    color='red'
                    label='Delete Member'
                    onClick={() => setToggleDeletedModal(true)}
                />
            </div>

            {toggleDeleteModal && (
                <div 
                  className={`${styles['modal-bg']}`} 
                  onClick={() => setToggleDeletedModal(false)}
                >  

                  <div className={styles['modal-container']} onClick={(e) => e.stopPropagation()}>
                      

                    <p className={styles.head}> <MemberIcon className={styles.icon}/> Delete Member</p>
                    <p className={styles.body}> Are you sure you want to delete <span>{member.memberName}?</span></p>
                    

                    <div className={styles['delete-btns']}>

                      <Button
                        label='Cancel'
                        size='xss'
                        color='dark'
                        onClick={() => setToggleDeletedModal(false)}
                      />

                      <Button
                        label='Confirm'
                        size='xss'
                        color='red'
                        onClick={() => deleteMember(id)}
                      />
                    </div>
                  </div>              
              
                </div>  
              )}

              {toggleModal && (
                    <SuccessModal
                        message='Member deleted'
                        actionMessage={'Redirecting to members list...'}
                    />
                )}

        </Container>
    )
}