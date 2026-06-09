'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './dashboard.module.scss'

const ACTION_CONFIG = {
    proposal_viewed:   { label: 'Proposal Viewed',   icon: '👁',  colorKey: 'viewed'   },
    proposal_accepted: { label: 'Proposal Approved',  icon: '✅', colorKey: 'approved'  },
    proposal_rejected: { label: 'Proposal Declined',  icon: '❌', colorKey: 'rejected'  },
    proposal_sent:     { label: 'Proposal Sent',      icon: '📤', colorKey: 'sent'      },
    proposal_created:  { label: 'Proposal Created',   icon: '📄', colorKey: 'created'   },
    proposal_updated:  { label: 'Proposal Updated',   icon: '✏️', colorKey: 'updated'   },
    proposal_deleted:  { label: 'Proposal Deleted',   icon: '🗑',  colorKey: 'rejected'  },
}

function formatRelativeTime(date) {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return 'Yesterday'
    return `${days}d ago`
}

function buildMessage(item) {
    const meta = item.metaData ?? {}
    const title = meta.proposalTitle ?? item.entityId
    const executor = meta.executor ?? null

    switch (item.action) {
        case 'proposal_viewed':   return executor ? `${executor} opened "${title}"` : `"${title}" was opened`
        case 'proposal_accepted': return executor ? `${executor} approved "${title}"` : `"${title}" was approved`
        case 'proposal_rejected': return executor ? `${executor} declined "${title}"` : `"${title}" was declined`
        case 'proposal_sent':     return `Sent "${title}"`
        case 'proposal_created':  return `Created "${title}"`
        case 'proposal_updated':  return `Updated "${title}"`
        case 'proposal_deleted':  return `Deleted "${title}"`
        default:                  return `${item.action} — ${item.entityId}`
    }
}

export default function RecentActivity() {
    const [activity, setActivity] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetch('/api/activity?limit=10')
            .then(r => r.json())
            .then(data => setActivity(data.data ?? []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className={styles.section}>
            <div className={styles['section-header']}>
                <h2>Recent Activity</h2>
            </div>

            {loading && (
                <div className={styles['activity-list']}>
                    {[1,2,3].map(i => (
                        <div key={i} className={styles['activity-item']} style={{ opacity: 0.4 }}>
                            <div className={`${styles['activity-icon']} ${styles.default}`}>·</div>
                            <div className={styles['activity-body']}>
                                <div className={styles['activity-title']}>Loading…</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && activity.length === 0 && (
                <div className={styles['activity-placeholder']}>
                    <p>No activity yet. Activity will appear here as proposals are sent, viewed, and responded to.</p>
                </div>
            )}

            {!loading && activity.length > 0 && (
                <div className={styles['activity-list']}>
                    {activity.map(item => {
                        const config = ACTION_CONFIG[item.action] ?? { label: item.action, icon: '●', colorKey: 'default' }
                        return (
                            <div
                                key={item.activityId}
                                className={styles['activity-item']}
                                style={{ cursor: item.entityType === 'proposals' ? 'pointer' : 'default' }}
                                onClick={() => {
                                    if (item.entityType === 'proposals') {
                                        router.push(`/proposals/${item.entityId}`)
                                    }
                                }}
                            >
                                <div className={`${styles['activity-icon']} ${styles[config.colorKey]}`}>
                                    {config.icon}
                                </div>
                                <div className={styles['activity-body']}>
                                    <p className={styles['activity-title']}>{config.label}</p>
                                    <p className={styles['activity-message']}>{buildMessage(item)}</p>
                                    <p className={styles['activity-time']}>{formatRelativeTime(item.createdAt)}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
