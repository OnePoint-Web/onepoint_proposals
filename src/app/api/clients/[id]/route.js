import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import { requireUser } from "@/lib/getUserHelper"
import { recordActivity } from "@/services/activity/record-activity"

export async function GET(req, { params }) {
    try {
        const { id } = await params

        const client = await prisma.user.findUnique({
            where: { userId: Number(id), role: { roleId: 3 } },
            select: {
                userId: true,
                username: true,
                firstName: true,
                lastName: true,
                userEmail: true,
                accountStatus: true,
                dateCreated: true,
                dateUpdated: true,
                userStatus: true,
                clientProfile: true,
            }
        })

        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 })
        }

        return NextResponse.json({ data: client })
    } catch (err) {
        console.error('Error fetching client:', err)
        return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 })
    }
}

export async function PATCH(req, { params }) {
    try {
        const { id } = await params
        const userId = Number(id)
        const authUser = await requireUser()

        const body = await req.json()
        const { statusId, newPassword, firstName, lastName, userEmail, companyName, companyEmail, companyAddress, website } = body

        const userUpdateData = {}
        const profileUpdateData = {}

        if (statusId !== undefined) userUpdateData.accountStatus = Number(statusId)
        if (firstName !== undefined) userUpdateData.firstName = firstName
        if (lastName !== undefined) userUpdateData.lastName = lastName
        if (userEmail !== undefined) userUpdateData.userEmail = userEmail

        if (newPassword) {
            if (authUser.role !== 1) {
                return NextResponse.json({ error: 'Only superadmin can reset passwords' }, { status: 403 })
            }
            if (newPassword.length < 8) {
                return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
            }
            userUpdateData.userPassword = await bcrypt.hash(newPassword, 12)
        }

        if (companyName !== undefined) profileUpdateData.companyName = companyName
        if (companyEmail !== undefined) profileUpdateData.companyEmail = companyEmail || null
        if (companyAddress !== undefined) profileUpdateData.companyAddress = companyAddress || null
        if (website !== undefined) profileUpdateData.website = website || null

        const updated = await prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { userId },
                data: {
                    ...userUpdateData,
                    ...(Object.keys(profileUpdateData).length > 0 && {
                        clientProfile: { update: profileUpdateData }
                    })
                },
                select: {
                    userId: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    userEmail: true,
                    accountStatus: true,
                    userStatus: true,
                    clientProfile: true,
                }
            })

            await recordActivity({
                tx,
                action: 'client_updated',
                userId: authUser.userId,
                title: 'Client Updated',
                message: `Updated client "${user.username}"`,
                entityType: 'clients',
                entityId: String(userId)
            })

            return user
        })

        return NextResponse.json({ updated })
    } catch (err) {
        if (err?.code === 'P2002') {
            return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
        }
        console.error('Error updating client:', err)
        return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
    }
}
