import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/getUserHelper'
import { recordActivity } from '@/services/activity/record-activity'

const resend = new Resend(process.env.RESEND_API_KEY)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
                        user: {
                            select: { firstName: true, lastName: true }
                        }
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

        const htmlBody = `
            <p>Dear ${firstName} ${lastName},</p>
            <p>We are pleased to share the following proposal with you:</p>
            <p><strong>${proposal.proposalTitle}</strong></p>
            <p>Please do not hesitate to contact us if you have any questions or require further information.</p>
            <br/>
            <p>Regards,<br/>OnePoint IT</p>
        `

        await Promise.all(
            recipients.map(to =>
                resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL,
                    to,
                    subject: `Proposal: ${proposal.proposalTitle}`,
                    html: htmlBody
                })
            )
        )

        await prisma.$transaction(async (tx) => {
            await tx.proposal.update({
                where: { proposalId: proposal.proposalId },
                data: { statusId: 3, statusUpdated: new Date() }
            })

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

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error('Send proposal error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
