'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/layout/Container/Container'
import Button from '@/components/ui/button/Button'
import styles from './page.module.scss'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function DiscoverySessionListPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 })
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: 12, ...(search && { search }) })
    fetch(`/api/discovery?${params}`)
      .then(r => r.json())
      .then(data => {
        setSessions(data.data ?? [])
        setMeta(data.meta ?? { total: 0, page: 1, totalPages: 1 })
      })
      .finally(() => setLoading(false))
  }, [page, search])

  return (
    <Container>
      <div className={styles.header}>
        <div>
          <h1>Discovery Sessions</h1>
          <p>AI-powered discovery call preparation</p>
        </div>
        <Button
          label='New Session'
          color='red'
          size='sm'
          onClick={() => router.push('/discovery-session/new')}
        />
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder='Search by title, client or company…'
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      {loading ? (
        <div className={styles.empty}>Loading…</div>
      ) : sessions.length === 0 ? (
        <div className={styles.empty}>
          <p>No discovery sessions yet.</p>
          <Button label='Create your first session' color='red' size='sm' onClick={() => router.push('/discovery-session/new')} />
        </div>
      ) : (
        <>
          <div className={styles['table-wrapper']}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Client</th>
                  <th>Company</th>
                  <th>Industry</th>
                  <th>Prepared By</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s.sessionId} onClick={() => router.push(`/discovery-session/${s.sessionId}`)} className={styles.row}>
                    <td className={styles['title-cell']}>{s.title}</td>
                    <td>{s.clientName}</td>
                    <td>{s.companyName || '—'}</td>
                    <td>{s.industry || '—'}</td>
                    <td>{s.user ? `${s.user.firstName} ${s.user.lastName}` : '—'}</td>
                    <td>{formatDate(s.dateCreated)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta.totalPages > 1 && (
            <div className={styles.pagination}>
              <Button label='Previous' color='dark' size='xss' disabled={page <= 1} onClick={() => setPage(p => p - 1)} />
              <span>{page} / {meta.totalPages}</span>
              <Button label='Next' color='dark' size='xss' disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)} />
            </div>
          )}
        </>
      )}
    </Container>
  )
}
