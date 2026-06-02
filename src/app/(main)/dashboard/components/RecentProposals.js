import styles from './dashboard.module.scss'
import Button from '@/components/ui/button/Button'
import { useRouter } from 'next/navigation'

export default function RecentProposals({ proposals }) {
    const router = useRouter()

    return (
        <div className={styles.section}>
            <div className={styles['section-header']}>
                <h2>Recent Proposals</h2>
            </div>

            <div className={styles['proposals-list']}>
                <div className={`${styles['proposals-row']} ${styles['header-row']}`}>
                    <span>Title</span>
                    <span>Type</span>
                    <span>Client</span>
                    <span>Status</span>
                    <span></span>
                </div>

                {proposals.length === 0 && (
                    <p className={styles['empty-state']}>No proposals yet.</p>
                )}

                {proposals.map(p => {
                    const statusClass = p.proposalStatus?.status?.toLowerCase() ?? ''
                    return (
                        <div key={p.proposalId} className={styles['proposals-row']}>
                            <span className={styles['proposal-title']}>{p.proposalTitle}</span>
                            <span className={styles['proposal-meta']}>{p.proposalType}</span>
                            <span className={styles['proposal-meta']}>
                                {p.clientProfile.user.firstName} {p.clientProfile.user.lastName}
                            </span>
                            <span className={`${styles['status-badge']} ${styles[statusClass]}`}>
                                {p.proposalStatus?.status}
                            </span>
                            <button
                                className={styles['view-btn']}
                                onClick={(e) => {
                                        e.preventDefault()
                                        router.push(`/proposals/${p.slug}`)
                                    }}
                            >View</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
