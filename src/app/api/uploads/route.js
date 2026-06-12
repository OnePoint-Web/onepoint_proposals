import { NextResponse } from 'next/server'
import { uploadToR2 } from '@/lib/uploadToR2'

export async function POST(req) {
    try {
        const formData = await req.formData()
        const file = formData.get('image')

        if (!file || file.size === 0) {
            return NextResponse.json({ message: 'No image provided' }, { status: 400 })
        }

        if (file.size > 2_000_000) {
            return NextResponse.json({ message: 'Image is too large' }, { status: 400 })
        }

        const { url } = await uploadToR2(file, { folder: 'uploads' })

        return NextResponse.json({ message: 'Image uploaded', url }, { status: 201 })
    } catch (err) {
        console.error('Error uploading image:', err)
        return NextResponse.json({ message: 'Error uploading image' }, { status: 500 })
    }
}
