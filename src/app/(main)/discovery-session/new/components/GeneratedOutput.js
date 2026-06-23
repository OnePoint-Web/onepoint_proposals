import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor'
import Button from '@/components/ui/button/Button'
import styles from './GeneratedOutput.module.scss'

export default function GeneratedOutput({ overview, questions, onOverviewChange, onQuestionsChange, onSave, saving }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <div className={styles['section-header']}>
          <span className={styles.badge}>Pre-call Brief</span>
          <h3 className={styles.title}>Company Overview</h3>
          <p className={styles.hint}>AI-generated summary — edit as needed before saving</p>
        </div>
        <RichTextEditor value={overview} onChange={onOverviewChange} />
      </div>

      <div className={styles.section}>
        <div className={styles['section-header']}>
          <span className={styles.badge}>Prepared Questions</span>
          <h3 className={styles.title}>Discovery Questions</h3>
          <p className={styles.hint}>Edit, reorder, or add questions before your call</p>
        </div>
        <RichTextEditor value={questions} onChange={onQuestionsChange} />
      </div>

      <div className={styles.actions}>
        <Button
          label={saving ? 'Saving session...' : 'Save Session'}
          color='red'
          size='md'
          onClick={onSave}
          disabled={saving}
        />
        <p className={styles['save-hint']}>Saved sessions can be exported as PDF</p>
      </div>
    </div>
  )
}
