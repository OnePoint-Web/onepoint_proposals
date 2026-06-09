'use client'
import { useState, useEffect } from 'react'
import styles from './ProposalPageHead.module.scss'

function formatDuration(totalSeconds) {
  if (!totalSeconds || totalSeconds === 0) return '—'
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ViewTrackingTable({ slug }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/proposals/${slug}/tracking`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <div className={styles['tracking-section']}>
      <div className={styles['tracking-header']}>
        <h3>Proposal View Tracking</h3>
      </div>

      {loading && <p className={styles['tracking-loading']}>Loading tracking data…</p>}

      {!loading && data && (
        <>
          {(data.firstViewedAt || data.totalViewCount > 0) && (
            <div className={styles['tracking-meta']}>
              {data.firstViewedAt && (
                <span>First opened: <strong>{formatDate(data.firstViewedAt)}</strong></span>
              )}
              {data.lastViewedAt && data.lastViewedAt !== data.firstViewedAt && (
                <span>Last opened: <strong>{formatDate(data.lastViewedAt)}</strong></span>
              )}
              {data.totalViewCount > 0 && (
                <span>Total opens: <strong>{data.totalViewCount}</strong></span>
              )}
            </div>
          )}

          {data.recipients.length === 0 ? (
            <p className={styles['tracking-loading']}>No recipients found.</p>
          ) : (
            <table className={styles['tracking-table']}>
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Status</th>
                  <th>Opens</th>
                  <th>Time Viewed</th>
                </tr>
              </thead>
              <tbody>
                {data.recipients.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <span className={styles['email-cell']}>{r.email}</span>
                      {r.isPortalUser && (
                        <span className={styles['portal-badge']}>Portal</span>
                      )}
                    </td>
                    <td>
                      {r.viewed
                        ? <span className={styles['status-viewed']}>Viewed</span>
                        : <span className={styles['status-unopened']}>Unopened</span>
                      }
                    </td>
                    <td>{r.viewCount || '—'}</td>
                    <td>{formatDuration(r.totalSeconds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  )
}
