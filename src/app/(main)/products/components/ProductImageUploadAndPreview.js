'use client'

/* eslint-disable @next/next/no-img-element */

import styles from './ProductImageUploadAndPreview.module.scss'
import { useEffect, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImage } from '@/lib/getCroppedImage'

export default function ProductImageUploadAndPreview({onFileSelect, onImageRemove, initialImage = null}){
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [image, setImage] = useState(initialImage)
    const [croppedImage, setCroppedImage] = useState(null)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const inputRef = useRef(null)

    useEffect(() => {
        return () => {
            if (image?.startsWith('blob:')) URL.revokeObjectURL(image)
            if (croppedImage?.startsWith('blob:')) URL.revokeObjectURL(croppedImage)
        }
    }, [image, croppedImage])

    const handleChange = (e) => {
        const file = e.target.files[0]

        if (file && file.size > 2_000_000) {
            alert('Image is too large. File size must not exceed 2MB')
            return
        }

        if (!file) return

        const url = URL.createObjectURL(file)
        setImage(url)
        setCroppedImage(null)
        onFileSelect?.(null)
        onImageRemove?.(false)
    }

    const handleClick = () => {
        inputRef.current.click()
    }

    const handleRemove = () => {
        setImage(null)
        setCroppedImage(null)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        onFileSelect?.(null)
        onImageRemove?.(Boolean(initialImage))
    }

    const onCropComplete = (_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const handleCrop = async () => {
        if (!image || !croppedAreaPixels) return

        const croppedFile = await getCroppedImage(
            image,
            croppedAreaPixels,
            { width: 200, height: 200 }
        )
        const croppedUrl = URL.createObjectURL(croppedFile)

        setCroppedImage(croppedUrl)
        onFileSelect?.(croppedFile)
    }

    const showCropper = image && !croppedImage && image !== initialImage
    const previewImage = croppedImage || (!showCropper ? image : null)

    return(
        <>
            <input
                type='file'
                ref={inputRef}
                onChange={handleChange}
                accept='image/*'
                style={{ display: 'none' }}
            />

            <div className={styles['upload-box']}>
                <div className={styles['cropper-container']}>
                    {showCropper && (
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    )}

                    {previewImage && (
                        <img
                            className={styles['cropped-preview']}
                            src={previewImage}
                            alt='product preview'
                        />
                    )}
                </div>

                {!image && (
                    <div className={styles['upload-button']} onClick={handleClick}>
                        Choose image file to upload
                    </div>
                )}
            </div>

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
