import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/getUserHelper'
import { recordActivity } from '@/services/activity/record-activity'


function buildEmailHtml(firstName, lastName, proposalTitle, viewLink) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
                <tr><td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                        <tr>
                            <td style="background:#1A1A2E;padding:28px 40px;text-align:center;">
                                <span style="color:#F22044;font-weight:bold;font-size:22px;letter-spacing:1px;">OnePoint</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:40px;">
                                <p style="color:#1A202C;font-size:16px;margin:0 0 12px;">Dear ${firstName} ${lastName},</p>
                                <p style="color:#4A5568;font-size:15px;line-height:1.6;margin:0 0 20px;">
                                    We are pleased to share the following proposal with you:
                                </p>
                                <p style="color:#1A1A2E;font-size:18px;font-weight:bold;margin:0 0 28px;">
                                    ${proposalTitle}
                                </p>
                                <p style="color:#4A5568;font-size:15px;line-height:1.6;margin:0 0 32px;">
                                    Click the button below to view your proposal. This link is unique to you and will expire in 30 days.
                                </p>
                                <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                                    <tr>
                                        <td style="background:#F22044;border-radius:8px;padding:14px 32px;">
                                            <a href="${viewLink}" style="color:#ffffff;font-weight:bold;font-size:15px;text-decoration:none;display:block;">
                                                View Proposal
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                <p style="color:#718096;font-size:13px;margin:0 0 4px;">
                                    If the button above does not work, copy and paste this link into your browser:
                                </p>
                                <p style="color:#F22044;font-size:13px;margin:0 0 32px;word-break:break-all;">${viewLink}</p>
                                <p style="color:#4A5568;font-size:14px;margin:0;">
                                    Regards,<br/><strong>OnePoint IT</strong>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background:#F8F9FC;padding:20px 40px;text-align:center;">
                                <p style="color:#A0AEC0;font-size:12px;margin:0;">
                                    © ${new Date().getFullYear()} OnePoint IT. This email and link are intended only for the named recipient.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td></tr>
            </table>
        </body>
        </html>
    `
}

export async function POST(req, { params }) {
    try {
        const user = await requireUser()
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
            return NextResponse.json({ error: 'Only published proposals can be sent' }, { status: 400 })
        }

        const { firstName, lastName } = proposal.clientProfile.user
        const portalUrl = process.env.PORTAL_URL ?? 'http://localhost:3001'
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

        // Pre-generate one token per recipient and look up portal accounts — before transaction
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

        // Transaction: update status, create all share tokens, record activity
        await prisma.$transaction(async (tx) => {
            await tx.proposal.update({
                where: { proposalId: proposal.proposalId },
                data: { statusId: 3, statusUpdated: new Date() }
            })

            await Promise.all(
                recipientData.map(({ email, token, isPortalUser, portalUserId }) =>
                    tx.proposalShareToken.create({
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

            await recordActivity({
                tx,
                action: 'proposal_sent',
                userId: user.userId,
                title: 'Proposal Sent',
                message: `Sent proposal "${proposal.proposalTitle}" to ${recipients.join(', ')}`,
                entityType: 'proposals',
                entityId: slug
            })
        })

        // Send emails after successful transaction
        await Promise.all(
            recipientData.map(({ email, token }) =>
                resend.emails.send({
                    from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
                    to: email,
                    subject: `Proposal: ${proposal.proposalTitle}`,
                    html: buildEmailHtml(firstName, lastName, proposal.proposalTitle, `${portalUrl}/view/${token}`)
                })
            )
        )

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error('Send proposal error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
