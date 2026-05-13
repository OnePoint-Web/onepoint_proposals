import styles from './ProposalPageHead.module.scss'
import Container from '@/components/layout/Container/Container'
import Button from '@/components/ui/button/Button'
import EmailsInputBar from './EmailsInputBar'
import {useRouter} from 'next/navigation'

export default function ProposalPageHead({proposalData}){

    const router = useRouter()

    const toggleDeleteProposal = async () => {
        try{
            const res = await fetch(`/api/proposals/${proposalData.slug}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    proposalId: proposalData.proposalId
                })
            })

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Request failed");
            } 

            router.push(`/proposals/`)
            
        }catch(err){
            console.error("Delete failed:", err.message);
        }
    }

    return(
        <Container fit='fullwidth'>
            <div className={styles['proposal-head-section']}>
                 <h1>{proposalData.proposalTitle}</h1>

                 <p className={styles.statuses}>Status: {' '}
                    {proposalData.statusId === 0 && (<span className={styles.draft}>Draft</span>)}
                    {proposalData.statusId === 1 && (<span className={styles.published}>Published (not sent)</span>)}
                    {proposalData.statusId === 3 && (<span className={styles.sent}>sent</span>)}
                    {proposalData.statusId === 4 && (<span className={styles.viewed}>Viewed</span>)}
                    {proposalData.statusId === 5 && (<span className={styles.approved}>Approved</span>)}
                    {proposalData.statusId === 6 && (<span className={styles.declined}>Declined</span>)}
                 </p>

                 {(proposalData.statusId === 1 || proposalData.statusId === 0) && (
                <div className={styles['top-btn-box']}>
                    <Button
                        label='Delete'
                        color='red'
                        onClick={toggleDeleteProposal}
                    />

                    <Button
                        label='Edit'
                        color='dark'
                        onClick={() => router.push(`/proposals/${proposalData.slug}/edit`)}
                    />
                 </div>
                 )}
            </div>

            <hr></hr>

            <div className={styles['proposal-head-section']}>
                <div className={styles['details-container']}>
                    <p>{proposalData.proposalType }</p>

                    { proposalData.proposalType === 'SLA Proposal' ? (
                        <p>{proposalData.slaOffers[0].slaPackage}</p>
                        ): (<p>--</p>)}
                </div>
                 <hr></hr>
                <div className={styles['details-container']}>
                    <p>Client: {`${proposalData.clientProfile.user.firstName} ${proposalData.clientProfile.user.lastName}`}</p>
                    <p>Company: {proposalData.clientProfile.companyName}</p>
                </div>
                 <hr></hr>
                <div className={styles['details-container']}>
                    <p>Date Created: {proposalData.dateCreated }</p>
                </div>
            </div>

            <hr></hr>

            {proposalData.statusId === 1 && 
                (<>
                <div className={`${styles['proposal-head-section']} ${styles['center']}`}>
                <p>Recipients</p>
                <EmailsInputBar/>
                <Button
                    label='Send Proposal'
                    color='dark'
                />
             </div>
             
             <p className={styles['note-message']}>Proposals cannot be editted and undone once sent. Please review proposal before sending out to client.</p>
                
                </>)
            }
            
            
        </Container>
    )
}