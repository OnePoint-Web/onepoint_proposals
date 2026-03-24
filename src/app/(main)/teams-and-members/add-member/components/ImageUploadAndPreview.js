'use client'

import styles from './CreateMemberForm.module.scss'
import { FormInputContainer } from '@/components/ui/form/Form.js'
import { useState, useEffect, useRef } from 'react'

export default function ImageUploadAndPreview({onFileSelect}) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  const handleClick = () => {
    inputRef.current.click()
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFile(file)
    setPreview(URL.createObjectURL(file))

    onFileSelect?.(file)
  }

  const handleRemove = () => {
    setFile(null)
    setPreview(null)
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  return (
    <>
      <FormInputContainer label="File Upload">

        <input
          type="file"
          ref={inputRef}
          onChange={handleChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        <div
          className={styles['upload-box']}
          onClick={handleClick}
        >
          {preview ? (
            <>
                <img src={preview} alt="Preview" />
            </>
            
          ) : (
            <div className={styles['upload-button']}>Choose image file to upload</div>
          )}
        </div>

      </FormInputContainer>

      {preview && (
        <FormInputContainer label="">
          <div className={styles['image-actions']}>
            <div className={styles['action-button']} onClick={handleClick}>
              Replace
            </div>
            <div className={styles['action-button']} onClick={handleRemove}>
              Remove
            </div>
          </div>
        </FormInputContainer>
      )}
    </>
  )
}