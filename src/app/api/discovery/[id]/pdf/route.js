import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(req, { params }) {
  try {
    const { id } = await params
    const sessionId = parseInt(id)

    const session = await prisma.discoverySession.findUnique({
      where: { sessionId },
      select: { title: true, clientName: true },
    })

    const safeTitle = (session?.title ?? `discovery-${id}`)
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    })

    const page = await browser.newPage()

    await page.setExtraHTTPHeaders({
      'x-pdf-secret': process.env.PDF_SECRET,
    })

    await page.goto(
      `${process.env.NEXT_PUBLIC_APP_URL}/pdf/discovery/${id}`,
      { waitUntil: 'networkidle0' }
    )

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    })

    await browser.close()

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${safeTitle}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Discovery PDF error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
