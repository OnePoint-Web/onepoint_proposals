import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireUser } from '@/lib/getUserHelper'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function buildPrompt({ clientName, companyName, industry, services, website, additionalContext }) {
  const lines = [
    `Client Name: ${clientName}`,
    companyName ? `Company: ${companyName}` : null,
    industry ? `Industry: ${industry}` : null,
    services ? `Services / products of interest: ${services}` : null,
    website ? `Website: ${website}` : null,
    additionalContext ? `Additional context: ${additionalContext}` : null,
  ].filter(Boolean)

  return `You are preparing a discovery call brief for a B2B sales team.

${lines.join('\n')}

Generate two things:
1. A company overview (3–4 paragraphs) summarising what the company likely does, their probable needs, and key context to brief the sales team before the call. If supporting documents are attached, use them to enrich this section.
2. A list of 12–15 targeted discovery questions covering: business goals, current pain points, existing solutions/tools, decision-making process, timeline, and budget.

Respond ONLY with valid JSON in exactly this shape:
{ "overview": "<html>", "questions": "<html>" }

Both values must be HTML strings using only <p>, <ul>, <li>, <strong>, <em> tags. Do not include markdown, code fences, or any text outside the JSON object.`
}

export async function POST(req) {
  try {
    await requireUser()

    const formData = await req.formData()

    const clientName = formData.get('clientName') ?? ''
    const companyName = formData.get('companyName') ?? ''
    const industry = formData.get('industry') ?? ''
    const services = formData.get('services') ?? ''
    const website = formData.get('website') ?? ''
    const additionalContext = formData.get('additionalContext') ?? ''

    if (!clientName) {
      return NextResponse.json({ error: 'clientName is required' }, { status: 400 })
    }

    const content = [
      { type: 'text', text: buildPrompt({ clientName, companyName, industry, services, website, additionalContext }) }
    ]

    const files = formData.getAll('files')
    for (const file of files) {
      if (!file || file.size === 0) continue

      const mimeType = file.type
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')

      if (mimeType === 'application/pdf') {
        content.push({
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: base64 }
        })
      } else if (mimeType.startsWith('image/')) {
        const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (supportedImageTypes.includes(mimeType)) {
          content.push({
            type: 'image',
            source: { type: 'base64', media_type: mimeType, data: base64 }
          })
        }
      }
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content }]
    })

    const rawText = message.content[0]?.text ?? ''

    let parsed
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawText)
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response', raw: rawText }, { status: 500 })
    }

    return NextResponse.json({ overview: parsed.overview ?? '', questions: parsed.questions ?? '' })
  } catch (err) {
    console.error('Discovery generate error:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
