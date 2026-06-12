import styles from './components.module.scss'

const STATUS_LABELS = {
    0: 'Draft',
    1: 'Published',
    3: 'Sent',
    4: 'Viewed',
    5: 'Approved',
    6: 'Declined',
}

const STATUS_ACTION_LABELS = {
    3: 'SENT',
    4: 'FIRST VIEWED',
    5: 'APPROVED',
    6: 'DECLINED',
}

const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(new Date(date))
}

const formatDateOnly = (date) => {
    return new Intl.DateTimeFormat('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date))
}

export default function CoverPage({ proposal }) {
    const generatedAt = new Date()
    const statusLabel = STATUS_LABELS[proposal.statusId] ?? 'Unknown'
    const actionLabel = STATUS_ACTION_LABELS[proposal.statusId] ?? 'UPDATED'
    const hasStatusDate = proposal.statusUpdated && proposal.statusId >= 3

    return (
        <div className={styles.section}>
            <div className={styles.head}>
                <p className={styles['head-title']}>Proposal Document</p>
                <p className={styles['head-title']}><span>Professional Business Proposal</span></p>
            </div>

            <div className={styles['cover-body']}>
                <p className={styles['title-head']}>BUSINESS PROPOSAL</p>
                <p className={styles.title}>PARTNERSHIP PROGRAM</p>
                <hr />

                <p className={styles['cover-description']}>
                    This proposal outlines the recommended solutions, scope of work, deliverables, timeline, and investment details tailored to meet the client's business needs and objectives.
                </p>

                <div className={`${styles['client-information']} ${styles['top']}`}>
                    <div className={styles['client-info-box']}>
                        <p>CLIENT</p>
                        <p>{`${proposal.clientProfile.user.firstName} ${proposal.clientProfile.user.lastName}`}</p>
                    </div>
                    <div className={styles['client-info-box']}>
                        <p>COMPANY</p>
                        <p>{proposal.clientProfile.companyName}</p>
                    </div>
                </div>

                <div className={styles['client-information']}>
                    <div className={styles['client-info-box']}>
                        <p>DATE SENT</p>
                        <p>{formatDateOnly(proposal.dateCreated)}</p>
                    </div>
                </div>
            </div>

            <div className={styles['head-footer']}>
                {/* Left — generation + sent date */}
                <div className={styles['footer-left']}>
                    <p>PDF GENERATED: {formatDateTime(generatedAt)}</p>
                    <p>DATE SENT: {formatDateOnly(proposal.dateCreated)}</p>
                </div>

                {/* Right — status + status date */}
                <div className={styles['footer-right']}>
                    <p>STATUS: {statusLabel.toUpperCase()}</p>
                    {hasStatusDate && (
                        <p>{actionLabel}: {formatDateOnly(proposal.statusUpdated)}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
