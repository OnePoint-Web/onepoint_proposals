import Input from '@/components/ui/input/Input'
import styles from './ClientInfoForm.module.scss'

export default function ClientInfoForm({ data, onChange, errors = {} }) {
  function set(field) {
    return (e) => onChange({ ...data, [field]: e.target.value })
  }

  return (
    <div className={styles.grid}>
      <div className={styles.field}>
        <label className={styles.label}>Session Title <span className={styles.required}>*</span></label>
        <Input
          label='Session Title'
          hideLabel
          placeholder='e.g. Initial Discovery — Acme Corp'
          value={data.title}
          onChange={set('title')}
          error={errors.title ? 'error' : ''}
          errorMessage={errors.title}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Client Name <span className={styles.required}>*</span></label>
        <Input
          label='Client Name'
          hideLabel
          placeholder='Full name of the contact person'
          value={data.clientName}
          onChange={set('clientName')}
          error={errors.clientName ? 'error' : ''}
          errorMessage={errors.clientName}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Company Name</label>
        <Input
          label='Company Name'
          hideLabel
          placeholder='Company or organisation name'
          value={data.companyName}
          onChange={set('companyName')}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Industry / Sector</label>
        <Input
          label='Industry'
          hideLabel
          placeholder='e.g. Healthcare, Retail, Finance…'
          value={data.industry}
          onChange={set('industry')}
        />
      </div>

      <div className={`${styles.field} ${styles.full}`}>
        <label className={styles.label}>Services / Products of Interest</label>
        <Input
          label='Services'
          hideLabel
          placeholder='e.g. Web development, SEO, CRM integration…'
          value={data.services}
          onChange={set('services')}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Website</label>
        <Input
          label='Website'
          hideLabel
          placeholder='https://example.com'
          value={data.website}
          onChange={set('website')}
        />
      </div>

      <div className={`${styles.field} ${styles.full}`}>
        <label className={styles.label}>Additional Context</label>
        <textarea
          className={styles.textarea}
          placeholder='Any other background information, notes, or context about the client…'
          value={data.additionalContext}
          onChange={set('additionalContext')}
          rows={4}
        />
      </div>
    </div>
  )
}
