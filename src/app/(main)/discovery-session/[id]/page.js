'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Container from '@/components/layout/Container/Container'
import Button from '@/components/ui/button/Button'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor'
import styles from './page.module.scss'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function DiscoverySessionDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [overview, setOverview] = useState('')
  const [questions, setQuestions] = useState('')

  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/discovery/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return }
        setSession(data.session)
        setOverview(data.session.overview ?? '')
        setQuestions(data.session.questions ?? '')
      })
      .catch(() => setError('Failed to load session'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSave() {
    setSaveError('')
    setSaveSuccess(false)
    setSaving(true)
    try {
      const res = await fetch(`/api/discovery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overview, questions }),
      })
      const data = await res.json()
      if (!res.ok) { setSaveError(data.error || 'Failed to save'); return }
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch {
      setSaveError('An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await fetch(`/api/discovery/${id}`, { method: 'DELETE' })
      router.push('/discovery-session')
    } catch {
      setDeleting(false)
    }
  }

  if (loading) return <Container><p className={styles.status}>Loading…</p></Container>
  if (error) return <Container><p className={styles['status-error']}>{error}</p></Container>
  if (!session) return null

  return (
    <Container>
      <div className={styles.breadcrumb}>
        <button className={styles['back-link']} onClick={() => router.push('/discovery-session')}>
          ← Discovery Sessions
        </button>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>{session.title}</h1>
          <p className={styles.meta}>
            {session.clientName}
            {session.companyName ? ` · ${session.companyName}` : ''}
            {' · '}
            {formatDate(session.dateCreated)}
            {session.user ? ` · Prepared by ${session.user.firstName} ${session.user.lastName}` : ''}
          </p>
        </div>
        <div className={styles['header-actions']}>
          <Button
            label='Export PDF'
            color='dark'
            size='sm'
            onClick={() => window.open(`/api/discovery/${id}/pdf`, '_blank')}
          />
          <Button
            label='Delete'
            color='red'
            size='sm'
            onClick={() => setShowDeleteModal(true)}
          />
        </div>
      </div>

      {/* Client Info summary */}
      <div className={styles['info-card']}>
        <div className={styles['info-grid']}>
          {session.industry && (
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Industry</span>
              <span className={styles['info-value']}>{session.industry}</span>
            </div>
          )}
          {session.services && (
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Services of Interest</span>
              <span className={styles['info-value']}>{session.services}</span>
            </div>
          )}
          {session.website && (
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Website</span>
              <span className={styles['info-value']}>{session.website}</span>
            </div>
          )}
          {session.additionalContext && (
            <div className={`${styles['info-item']} ${styles.full}`}>
              <span className={styles['info-label']}>Additional Context</span>
              <span className={styles['info-value']}>{session.additionalContext}</span>
            </div>
          )}
        </div>
      </div>

      {/* Company Overview */}
      <div className={styles.card}>
        <div className={styles['card-header']}>
          <span className={styles['card-badge']}>Pre-call Brief</span>
          <h2 className={styles['card-title']}>Company Overview</h2>
        </div>
        <RichTextEditor value={overview} onChange={setOverview} />
      </div>

      {/* Discovery Questions */}
      <div className={styles.card}>
        <div className={styles['card-header']}>
          <span className={styles['card-badge']}>Prepared Questions</span>
          <h2 className={styles['card-title']}>Discovery Questions</h2>
        </div>
        <RichTextEditor value={questions} onChange={setQuestions} />
      </div>

      {/* Save row */}
      <div className={styles['save-row']}>
        {saveError && <p className={styles.error}>{saveError}</p>}
        {saveSuccess && <p className={styles.success}>Changes saved successfully</p>}
        <Button
          label={saving ? 'Saving changes...' : 'Save Changes'}
          color='red'
          size='md'
          onClick={handleSave}
          disabled={saving}
        />
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className={styles['modal-bg']} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>Delete Session</h3>
            <p>Are you sure you want to delete <strong>{session.title}</strong>? This cannot be undone.</p>
            <div className={styles['modal-actions']}>
              <Button label='Cancel' color='dark' size='xss' onClick={() => setShowDeleteModal(false)} />
              <Button
                label={deleting ? 'Deleting...' : 'Delete'}
                color='red'
                size='xss'
                onClick={handleDelete}
                disabled={deleting}
              />
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}
