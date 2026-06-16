import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2 } from './r2'
import { prisma } from './prisma'
import crypto from 'crypto'
import path from 'path'

/**
 * Upload a file to Cloudflare R2 and record it in the Media table.
 *
 * @param {File} file  - Web API File / Blob from formData.get('image')
 * @param {{ folder?: string, uploadedBy?: number|null }} options
 *   folder:     key prefix in the bucket (e.g. 'members', 'products')
 *   uploadedBy: userId of the staff member performing the upload
 * @returns {{ url: string, mediaId: number, key: string }}
 */
export async function uploadToR2(file, { folder = 'uploads', uploadedBy = null } = {}) {
  const ext = path.extname(file.name) || '.jpg'
  const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`
  const key = `${folder}/${uniqueName}`
  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type || 'application/octet-stream',
      })
    )
  } catch (err) {
    throw new Error(`R2 upload failed for key "${key}": ${err.message}`)
  }

  const media = await prisma.media.create({
    data: {
      fileName: uniqueName,
      originalName: file.name,
      bucketKey: key,
      mimeType: file.type || '',
      fileSize: file.size,
      uploadedBy,
    },
  })

  return {
    url: `${process.env.R2_PUBLIC_URL}/${key}`,
    mediaId: media.mediaId,
    key,
  }
}
