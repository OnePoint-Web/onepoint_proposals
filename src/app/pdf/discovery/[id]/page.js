import styles from './page.module.scss'
import { prisma } from '@/lib/prisma'

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function DiscoveryPDF({ params }) {
  const { id } = await params
  const sessionId = parseInt(id)

  const session = await prisma.discoverySession.findUnique({
    where: { sessionId },
    include: { user: { select: { firstName: true, lastName: true } } },
  })

  if (!session) {
    return <div style={{ color: 'black', padding: '40px' }}>Discovery session not found</div>
  }

  const preparedBy = session.user ? `${session.user.firstName} ${session.user.lastName}` : '—'

  return (
    <>
      <div className={styles['pdf-bg']} />
      <div className={styles['pdf-page']}>

        {/* Header */}
        <div className={styles.header}>
          <p className={styles['header-label']}>OnePoint · Discovery Session</p>
          <h1 className={styles['header-title']}>{session.title}</h1>
          <p className={styles['header-sub']}>{session.clientName}{session.companyName ? ` · ${session.companyName}` : ''}</p>
          <p className={styles['header-date']}>Prepared by {preparedBy} · {formatDate(session.dateCreated)}</p>
        </div>

        {/* Client Info */}
        <div className={styles['client-info']}>
          <table className={styles['info-table']}>
            <tbody>
              {session.companyName && (
                <tr><td>Company</td><td>{session.companyName}</td></tr>
              )}
              {session.industry && (
                <tr><td>Industry</td><td>{session.industry}</td></tr>
              )}
              {session.services && (
                <tr><td>Services of Interest</td><td>{session.services}</td></tr>
              )}
              {session.website && (
                <tr><td>Website</td><td>{session.website}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Company Overview */}
        {session.overview && (
          <div className={styles.section}>
            <p className={styles['section-label']}>Pre-call Brief</p>
            <h2 className={styles['section-title']}>Company Overview</h2>
            <div
              className={styles['rich-content']}
              dangerouslySetInnerHTML={{ __html: session.overview }}
            />
          </div>
        )}

        {/* Discovery Questions */}
        {session.questions && (
          <div className={styles.section}>
            <p className={styles['section-label']}>Prepared Questions</p>
            <h2 className={styles['section-title']}>Discovery Questions</h2>
            <div
              className={styles['rich-content']}
              dangerouslySetInnerHTML={{ __html: session.questions }}
            />
          </div>
        )}

        <div className={styles.footer}>
          <span>OnePoint · Confidential</span>
          <span>{formatDate(session.dateCreated)}</span>
        </div>

      </div>
    </>
  )
}
