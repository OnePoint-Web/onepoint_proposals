import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req){
    try{
        const formData = await req.formData()
        const file = formData.get('image')

        if (!file || file.size === 0) {
            return NextResponse.json(
                {message: 'No image provided'},
                {status: 400}
            )
        }

        if (file.size > 2_000_000) {
            return NextResponse.json(
                {message: 'Image is too large'},
                {status: 400}
            )
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const fileName = `${Date.now()}-${file.name}`
        const uploadPath = path.join(process.cwd(), 'public/uploads', fileName)

        await fs.promises.writeFile(uploadPath, buffer)

        return NextResponse.json(
            {
                message: 'Image uploaded',
                url: `/uploads/${fileName}`,
            },
            {status: 201}
        )
    }catch(err){
        console.error('Error uploading image:', err)
        return NextResponse.json(
            {message: 'Error uploading image'},
            {status: 500}
        )
    }
}
