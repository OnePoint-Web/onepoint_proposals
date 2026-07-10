import styles from './ProposalPageHead.module.scss'
import Container from '@/components/layout/Container/Container'
import Button from '@/components/ui/button/Button'
import EmailsInputBar from './EmailsInputBar'
import ViewTrackingTable from './ViewTrackingTable'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ProposalPageHead({ proposalData }) {
    const router = useRouter()
    const clientEmail = proposalData.clientProfile.user.userEmail
    const [recipients, setRecipients] = useState([])
    const [isSending, setIsSending] = useState(false)
    const [sendError, setSendError] = useState(null)

    const [testRecipients, setTestRecipients] = useState([])
    const [isSendingTest, setIsSendingTest] = useState(false)
    const [testSendError, setTestSendError] = useState(null)
    const [testSendSuccess, setTestSendSuccess] = useState(false)

    const toggleDeleteProposal = async () => {
        try {
            const res = await fetch(`/api/proposals/${proposalData.slug}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ proposalId: proposalData.proposalId })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Request failed')
            router.push('/proposals/')
        } catch (err) {
            console.error('Delete failed:', err.message)
        }
    }

    const handleSendProposal = async () => {
        if (isSending) return
        setSendError(null)
        setIsSending(true)
        try {
            // Always include the client email; merge with any extra recipients
            const allRecipients = Array.from(new Set([clientEmail, ...recipients]))
            const res = await fetch(`/api/proposals/${proposalData.slug}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipients: allRecipients })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to send proposal')
            router.refresh()
        } catch (err) {
            setSendError(err.message)
        } finally {
            setIsSending(false)
        }
    }

    const handleSendTestEmail = async () => {
        if (isSendingTest || testRecipients.length === 0) return
        setTestSendError(null)
        setTestSendSuccess(false)
        setIsSendingTest(true)
        try {
            const res = await fetch(`/api/proposals/${proposalData.slug}/send-test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipients: testRecipients })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to send test email')
            setTestSendSuccess(true)
        } catch (err) {
            setTestSendError(err.message)
        } finally {
            setIsSendingTest(false)
        }
    }

    return (
        <Container fit='fullwidth'>
            <div className={styles['proposal-head-section']}>
                <h1>{proposalData.proposalTitle}</h1>

                <p className={styles.statuses}>Status:{' '}
                    {proposalData.statusId === 0 && <span className={styles.draft}>Draft</span>}
                    {proposalData.statusId === 1 && <span className={styles.published}>Published (not sent)</span>}
                    {proposalData.statusId === 3 && <span className={styles.sent}>Sent</span>}
                    {proposalData.statusId === 4 && <span className={styles.viewed}>Viewed</span>}
                    {proposalData.statusId === 5 && <span className={styles.approved}>Approved</span>}
                    {proposalData.statusId === 6 && <span className={styles.declined}>Declined</span>}
                </p>

                <div className={styles['top-btn-box']}>
                    {(proposalData.statusId === 1 || proposalData.statusId === 0) && (
                        <>
                            <Button label='Delete' color='red' onClick={toggleDeleteProposal} />
                            <Button label='Edit' color='dark' onClick={() => router.push(`/proposals/${proposalData.slug}/edit`)} />
                        </>
                    )}
                    <Button
                        label='Download PDF'
                        color='dark'
                        size='xs'
                        onClick={() => window.open(`/api/proposals/${proposalData.slug}/pdf`, '_blank')}
                    />
                </div>
            </div>

            <hr />

            <div className={styles['proposal-head-section']}>
                <div className={styles['details-container']}>
                    <p>{proposalData.proposalType}</p>
                    {proposalData.proposalType === 'SLA Proposal'
                        ? <p>{proposalData.slaOffers[0].slaPackage}</p>
                        : <p>--</p>
                    }
                </div>
                <hr />
                <div className={styles['details-container']}>
                    <p>Client: {`${proposalData.clientProfile.user.firstName} ${proposalData.clientProfile.user.lastName}`}</p>
                    <p>Company: {proposalData.clientProfile.companyName}</p>
                    <p>Email: {clientEmail}</p>
                </div>
                <hr />
                <div className={styles['details-container']}>
                    <p>Date Created: {proposalData.dateCreated}</p>
                </div>
            </div>

            <hr />

            {/* Send section — only shown for published proposals */}
            {proposalData.statusId === 1 && (
                <>
                    <div className={`${styles['proposal-head-section']} ${styles['center']}`}>
                        <p>Recipients</p>
                        <p className={styles['recipient-hint']}>
                            The client email (<strong>{clientEmail}</strong>) is always included. Add additional recipients below.
                        </p>
                        <EmailsInputBar
                            tags={recipients}
                            setTags={setRecipients}
                            lockedTags={[clientEmail]}
                        />
                        {sendError && <p className={styles['send-error']}>{sendError}</p>}
                        <Button
                            label={isSending ? 'Sending...' : 'Send Proposal'}
                            color='dark'
                            onClick={handleSendProposal}
                            disabled={isSending}
                        />
                    </div>
                    <p className={styles['note-message']}>
                        Proposals cannot be edited and undone once sent. Please review proposal before sending out to client.
                    </p>

                    <hr />

                    <div className={`${styles['proposal-head-section']} ${styles['center']}`}>
                        <p>Send Test Email</p>
                        <p className={styles['recipient-hint']}>
                            Sends this proposal to the emails below for review only. Does not mark the proposal as sent, notify the client, or appear in the activity log.
                        </p>
                        <EmailsInputBar
                            tags={testRecipients}
                            setTags={setTestRecipients}
                        />
                        {testSendError && <p className={styles['send-error']}>{testSendError}</p>}
                        {testSendSuccess && <p className={styles.success}>Test email sent.</p>}
                        <Button
                            label={isSendingTest ? 'Sending...' : 'Send Test Email'}
                            color='dark'
                            onClick={handleSendTestEmail}
                            disabled={isSendingTest || testRecipients.length === 0}
                        />
                    </div>
                </>
            )}

            {/* View tracking — shown once proposal is sent */}
            {proposalData.statusId >= 3 && (
                <ViewTrackingTable slug={proposalData.slug} />
            )}
        </Container>
    )
}
