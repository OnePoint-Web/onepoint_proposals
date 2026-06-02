import styles from './dashboard.module.scss'
import { Icons } from '@/components/icons/icons'

export default function RecentActivity() {
    const ConstructionIcon = Icons.construction

    return (
        <div className={styles.section}>
            <div className={styles['section-header']}>
                <h2>Recent Activity</h2>
            </div>

            <div className={styles['activity-placeholder']}>
                <ConstructionIcon className={styles['placeholder-icon']} />
                <p>Activity tracking will appear here once the activity log is set up.</p>
            </div>
        </div>
    )
}
