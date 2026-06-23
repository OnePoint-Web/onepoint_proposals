'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/layout/Container/Container'
import Button from '@/components/ui/button/Button'
import ClientInfoForm from './components/ClientInfoForm'
import DocumentUploadSection from './components/DocumentUploadSection'
import GeneratedOutput from './components/GeneratedOutput'
import styles from './page.module.scss'

const EMPTY_FORM = {
  title: '',
  clientName: '',
  companyName: '',
  industry: '',
  services: '',
  website: '',
  additionalContext: '',
}

export default function NewDiscoverySessionPage() {
  const router = useRouter()

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [files, setFiles] = useState([])
  const [formErrors, setFormErrors] = useState({})

  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState('')

  const [overview, setOverview] = useState('')
  const [questions, setQuestions] = useState('')
  const [outputVisible, setOutputVisible] = useState(false)

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  function validate() {
    const errors = {}
    if (!formData.title.trim()) errors.title = 'Session title is required'
    if (!formData.clientName.trim()) errors.clientName = 'Client name is required'
    return errors
  }

  async function handleGenerate() {
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    setFormErrors({})
    setGenerateError('')
    setGenerating(true)

    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v))
      files.forEach(f => fd.append('files', f))

      const res = await fetch('/api/discovery/generate', { method: 'POST', body: fd })
      const data = await res.json()

      if (!res.ok) {
        setGenerateError(data.error || 'Failed to generate. Please try again.')
        return
      }

      setOverview(data.overview)
      setQuestions(data.questions)
      setOutputVisible(true)

      setTimeout(() => {
        document.getElementById('discovery-output')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch {
      setGenerateError('An unexpected error occurred. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  async function handleSave() {
    setSaveError('')
    setSaving(true)
    try {
      const res = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, overview, questions }),
      })
      const data = await res.json()

      if (!res.ok) {
        setSaveError(data.error || 'Failed to save session.')
        return
      }

      router.push(`/discovery-session/${data.session.sessionId}`)
    } catch {
      setSaveError('An unexpected error occurred while saving.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container>
      <div className={styles.breadcrumb}>
        <button className={styles['back-link']} onClick={() => router.push('/discovery-session')}>
          ← Discovery Sessions
        </button>
      </div>

      <h1 className={styles.heading}>New Discovery Session</h1>
      <p className={styles.subheading}>Fill in client details and optionally upload supporting documents, then let Claude AI generate your discovery brief.</p>

      {/* Section 1: Client Information */}
      <div className={styles.card}>
        <div className={styles['card-header']}>
          <span className={styles['card-badge']}>Step 1</span>
          <h2 className={styles['card-title']}>Client Information</h2>
        </div>
        <ClientInfoForm data={formData} onChange={setFormData} errors={formErrors} />
      </div>

      {/* Section 2: Supporting Documents */}
      <div className={styles.card}>
        <div className={styles['card-header']}>
          <span className={styles['card-badge']}>Step 2 · Optional</span>
          <h2 className={styles['card-title']}>Supporting Documents</h2>
          <p className={styles['card-desc']}>Upload PDFs or images (company profiles, case studies, etc.) to give Claude more context.</p>
        </div>
        <DocumentUploadSection files={files} onChange={setFiles} />
      </div>

      {/* Generate button */}
      <div className={styles['generate-row']}>
        {generateError && <p className={styles.error}>{generateError}</p>}
        <Button
          label={generating ? 'Generating with Claude AI…' : 'Generate with Claude AI'}
          color='red'
          size='md'
          onClick={handleGenerate}
          disabled={generating}
        />
        {generating && <p className={styles['generate-hint']}>This may take 15–30 seconds…</p>}
      </div>

      {/* Section 3: Generated Output */}
      {outputVisible && (
        <div id='discovery-output' className={styles.card}>
          <div className={styles['card-header']}>
            <span className={styles['card-badge']}>Step 3</span>
            <h2 className={styles['card-title']}>Generated Output</h2>
            <p className={styles['card-desc']}>Review and edit the AI-generated content before saving.</p>
          </div>
          {saveError && <p className={styles.error}>{saveError}</p>}
          <GeneratedOutput
            overview={overview}
            questions={questions}
            onOverviewChange={setOverview}
            onQuestionsChange={setQuestions}
            onSave={handleSave}
            saving={saving}
          />
        </div>
      )}
    </Container>
  )
}
