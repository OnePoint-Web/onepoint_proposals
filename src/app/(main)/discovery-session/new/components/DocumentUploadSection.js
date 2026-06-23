import { useRef } from 'react'
import styles from './DocumentUploadSection.module.scss'

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']

export default function DocumentUploadSection({ files, onChange }) {
  const inputRef = useRef(null)

  function handleFileChange(e) {
    const incoming = Array.from(e.target.files ?? [])
    const valid = incoming.filter(f => {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        alert(`"${f.name}" is not a supported file type. Upload PDFs or images.`)
        return false
      }
      if (f.size > MAX_FILE_SIZE) {
        alert(`"${f.name}" exceeds the 20 MB file size limit.`)
        return false
      }
      return true
    })
    onChange([...files, ...valid])
    e.target.value = ''
  }

  function removeFile(index) {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.dropzone} onClick={() => inputRef.current?.click()}>
        <input
          ref={inputRef}
          type='file'
          multiple
          accept='.pdf,image/*'
          className={styles['file-input']}
          onChange={handleFileChange}
        />
        <div className={styles['dropzone-icon']}>📎</div>
        <p className={styles['dropzone-text']}>Click to upload PDFs or images</p>
        <p className={styles['dropzone-hint']}>PDF, JPG, PNG, WEBP · max 20 MB each</p>
      </div>

      {files.length > 0 && (
        <ul className={styles['file-list']}>
          {files.map((f, i) => (
            <li key={i} className={styles['file-pill']}>
              <span className={styles['file-icon']}>{f.type === 'application/pdf' ? '📄' : '🖼️'}</span>
              <span className={styles['file-name']}>{f.name}</span>
              <span className={styles['file-size']}>({(f.size / 1024).toFixed(0)} KB)</span>
              <button
                type='button'
                className={styles['remove-btn']}
                onClick={() => removeFile(i)}
                aria-label={`Remove ${f.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
