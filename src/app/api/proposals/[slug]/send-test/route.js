import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/getUserHelper'
import { buildProposalEmailHtml } from '@/lib/proposalEmailTemplate'

export async function POST(req, { params }) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    try {
        await requireUser()
        const { slug } = await params
        const { recipients } = await req.json()

        if (!Array.isArray(recipients) || recipients.length === 0) {
            return NextResponse.json({ error: 'At least one recipient is required' }, { status: 400 })
        }

        const invalidEmails = recipients.filter(e => !EMAIL_REGEX.test(e))
        if (invalidEmails.length > 0) {
            return NextResponse.json({ error: `Invalid email address(es): ${invalidEmails.join(', ')}` }, { status: 400 })
        }

        const proposal = await prisma.proposal.findUnique({
            where: { slug },
            select: {
                proposalId: true,
                proposalTitle: true,
                statusId: true,
                clientProfile: {
                    select: {
                        user: { select: { firstName: true, lastName: true } }
                    }
                }
            }
        })

        if (!proposal) {
            return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
        }

        if (proposal.statusId !== 1) {
            return NextResponse.json({ error: 'Only published proposals can be test sent' }, { status: 400 })
        }

        const { firstName, lastName } = proposal.clientProfile.user
        const portalUrl = process.env.PORTAL_URL ?? 'http://localhost:3001'
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

        // Pre-generate one token per test recipient — before transaction
        const recipientData = await Promise.all(
            recipients.map(async (email) => {
                const token = crypto.randomBytes(32).toString('hex')
                const portalUser = await prisma.user.findFirst({
                    where: { userEmail: email, accountRole: 3 },
                    select: { userId: true }
                })
                return { email, token, isPortalUser: !!portalUser, portalUserId: portalUser?.userId ?? null }
            })
        )

        // Only create the share tokens — proposal status and activity log are untouched for test sends
        await prisma.$transaction(
            recipientData.map(({ email, token, isPortalUser, portalUserId }) =>
                prisma.proposalShareToken.create({
                    data: {
                        token,
                        proposalId: proposal.proposalId,
                        recipientEmail: email,
                        isPortalUser,
                        portalUserId,
                        expiresAt
                    }
                })
            )
        )

        // Send emails — test sends never include client portal credentials
        await Promise.all(
            recipientData.map(({ email, token }) =>
                resend.emails.send({
                    from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
                    to: email,
                    subject: `[TEST] Proposal: ${proposal.proposalTitle}`,
                    html: buildProposalEmailHtml(firstName, lastName, proposal.proposalTitle, `${portalUrl}/view/${token}`, null, true)
                })
            )
        )

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error('Send test proposal email error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
