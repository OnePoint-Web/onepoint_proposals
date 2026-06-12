import styles from './components.module.scss'

export default function OurApproach({ proposal }) {
    const sorted = [...proposal.timelines].sort((a, b) => a.progress - b.progress)

    return (
        <div className={styles.section}>
            <div className={styles['approach-body']}>
                <div className={styles['section-head']}>
                    <p className={styles['section-title']}>PROJECT TIMELINE</p>
                    <hr />
                </div>

                <table className={styles['timeline-table']}>
                    <thead>
                        <tr>
                            <th>Timeframe</th>
                            <th>Assigned To</th>
                            <th>Progress</th>
                            <th>Tasks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((t) => (
                            <tr key={t.timelineId}>
                                <td>{t.timeFrame}</td>
                                <td>{t.assignedTo || '—'}</td>
                                <td>
                                    <div className={styles['progress-wrapper']}>
                                        <div className={styles['progress-bar']}>
                                            <div
                                                className={styles['progress-fill']}
                                                style={{ width: `${t.progress}%` }}
                                            />
                                        </div>
                                        <span className={styles['progress-label']}>{t.progress}%</span>
                                    </div>
                                </td>
                                <td>
                                    {t.timelineScopeItems?.length > 0 ? (
                                        <ul className={styles['scope-list']}>
                                            {t.timelineScopeItems.map((s) => (
                                                <li key={s.scopeItemId}>{s.scope}</li>
                                            ))}
                                        </ul>
                                    ) : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
