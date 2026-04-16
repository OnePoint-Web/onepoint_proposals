import styles from './ProposalPageHead.module.scss'
import Container from '@/components/layout/Container/Container'
import Button from '@/components/ui/button/Button'
import EmailsInputBar from './EmailsInputBar'
export default function ProposalPageHead({proposalData}){
    return(
        <Container fit='fullwidth'>
            <div className={styles['proposal-head-section']}>
                 <h1>{proposalData.proposalTitle}</h1>

                 <p className={styles.statuses}>Status: {' '}
                    {proposalData.statusId === 1 && (<span className={styles.published}>Published (not sent)</span>)}
                    {proposalData.statusId === 3 && (<span className={styles.sent}>sent</span>)}
                    {proposalData.statusId === 4 && (<span className={styles.viewed}>Viewed</span>)}
                    {proposalData.statusId === 5 && (<span className={styles.approved}>Approved</span>)}
                    {proposalData.statusId === 6 && (<span className={styles.declined}>Declined</span>)}
                 </p>

                 {proposalData.statusId === 1 && (
                <div className={styles['top-btn-box']}>
                    <Button
                        label='Delete'
                        color='red'
                    />

                    <Button
                        label='Edit'
                        color='dark'
                    />
                 </div>
                 )}
            </div>

            <hr></hr>

            <div className={styles['proposal-head-section']}>
                <div className={styles['details-container']}>
                    <p>{proposalData.proposalType }</p>
                    <p>{proposalData.slaOffers[0].slaPackage}</p>
                </div>
                 <hr></hr>
                <div className={styles['details-container']}>
                    <p>Client: {`${proposalData.clientProfile.user.firstName} ${proposalData.clientProfile.user.lastName}`}</p>
                    <p>Company: {proposalData.clientProfile.companyName}</p>
                </div>
                 <hr></hr>
                <div className={styles['details-container']}>
                    <p>Date Created: {proposalData.dateCreated }</p>
                    {/* <p>Created by: {proposalData.slaOffers[0].slaPackage}</p> */}
                </div>
            </div>

            <hr></hr>
             <div className={`${styles['proposal-head-section']} ${styles['center']}`}>
                <p>Recipients</p>
                <EmailsInputBar/>
                <Button
                    label='Send Proposal'
                    color='dark'
                />
             </div>
             
             <p className={styles['note-message']}>Proposals cannot be editted and undone once sent. Please review proposal before sending out to client.</p>
            
        </Container>
    )
}