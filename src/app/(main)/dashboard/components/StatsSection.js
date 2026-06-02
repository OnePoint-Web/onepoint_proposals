import styles from './dashboard.module.scss'

const RANGES = [
    { key: 'week',    label: 'Week' },
    { key: 'month',   label: 'Month' },
    { key: 'quarter', label: 'Quarter' },
    { key: 'year',    label: 'Year' },
]

export default function StatsSection({ stats, range, setRange }) {
    return (
        <div className={styles.section}>
            <div className={styles['section-header']}>
                <h2>Proposal Overview</h2>
                <div className={styles['range-filter']}>
                    {RANGES.map(r => (
                        <button
                            key={r.key}
                            className={range === r.key ? styles.active : ''}
                            onClick={() => setRange(r.key)}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles['stats-grid']}>
                <div className={`${styles['stat-card']} ${styles.sent}`}>
                    <span className={styles['stat-label']}>Proposals Sent</span>
                    <span className={styles['stat-value']}>{stats?.sent ?? '—'}</span>
                </div>
                <div className={`${styles['stat-card']} ${styles.approved}`}>
                    <span className={styles['stat-label']}>Approved</span>
                    <span className={styles['stat-value']}>{stats?.approved ?? '—'}</span>
                </div>
                <div className={`${styles['stat-card']} ${styles.declined}`}>
                    <span className={styles['stat-label']}>Declined</span>
                    <span className={styles['stat-value']}>{stats?.declined ?? '—'}</span>
                </div>
            </div>
        </div>
    )
}
