'use client'
import styles from './EmailsInputBar.module.scss'
import { useState } from 'react'

export default function EmailsInputBar({ tags, setTags, lockedTags = [] }) {
  const [input, setInput] = useState('')

  const handleKeyDown = (e) => {
    if (e.key === ',' && input.trim()) {
      e.preventDefault()
      const trimmed = input.trim()
      if (!lockedTags.includes(trimmed) && !tags.includes(trimmed)) {
        setTags([...tags, trimmed])
      }
      setInput('')
    }

    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault()
      const trimmed = input.trim()
      if (!lockedTags.includes(trimmed) && !tags.includes(trimmed)) {
        setTags([...tags, trimmed])
      }
      setInput('')
    }

    if (e.key === 'Backspace' && !input && tags.length) {
      setTags(tags.slice(0, -1))
    }
  }

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.container}>
      {lockedTags.map((tag, i) => (
        <span key={`locked-${i}`} className={`${styles.tag} ${styles['tag-locked']}`}>
          {tag}
          <span className={styles['locked-icon']}>🔒</span>
        </span>
      ))}

      {tags.map((tag, i) => (
        <span key={`tag-${i}`} className={styles.tag}>
          {tag}
          <button
            type="button"
            className={styles['remove-btn']}
            onClick={() => removeTag(i)}
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </span>
      ))}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className={styles.input}
        placeholder="Add more emails, press comma or Enter..."
      />
    </div>
  )
}
