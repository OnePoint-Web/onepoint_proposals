'use client'

import styles from './CreateMemberForm.module.scss'
import { useState, useEffect, useRef } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImage } from '@/lib/getCroppedImage'

export default function ImageUploadAndPreview({ onFileSelect, initialImage=null}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const [image, setImage] = useState(null) // original image URL
  const [croppedImage, setCroppedImage] = useState(null) // final image URL

    useEffect(() => {
    if (initialImage) {
      setImage(initialImage);
    }
  }, [initialImage]);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const inputRef = useRef(null)

  const handleChange = (e) => {
    const file = e.target.files[0]

    if (file && file.size > 2_000_000) {
      alert("Image is too large. File size must not exceed 2MB")
      return
    }

    if (!file) return

    
    
    const url = URL.createObjectURL(file)

    setImage(url)
    setCroppedImage(null)
  }

  const handleClick = () => {
    inputRef.current.click()
  }

  const handleRemove = () => {
    setImage(null)
    setCroppedImage(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleCrop = async () => {
    if (!image || !croppedAreaPixels) return

    const croppedFile = await getCroppedImage(image, croppedAreaPixels)
    const croppedUrl = URL.createObjectURL(croppedFile)

    setCroppedImage(croppedUrl)

    onFileSelect?.(croppedFile)
  }

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image)
      if (croppedImage) URL.revokeObjectURL(croppedImage)
    }
  }, [image, croppedImage])

  const showCropper = image && !croppedImage

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div className={styles['upload-box']}>
        <div className={styles['cropper-container']}>

          {showCropper && (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={7 / 10}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          )}
          {croppedImage && (
            <img className={styles['cropped-preview']}
              src={croppedImage}
              alt="cropped preview"
            />
          )}

        </div>

          {!image && (
            <div className={styles['upload-button']} onClick={handleClick}>
              Choose image file to upload
            </div>
          )}
      </div>

      {/* ACTIONS */}
      {image && (
        <div className={styles['image-actions']}>

          <div className={styles['action-button']} onClick={handleClick}>
            Replace
          </div>

          <div className={styles['action-button']} onClick={handleRemove}>
            Remove
          </div>

          {showCropper && (
            <div className={styles['action-button']} onClick={handleCrop}>
              Apply crop and upload
            </div>
          )}

        </div>
      )}
    </>
  )
}