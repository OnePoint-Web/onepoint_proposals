import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import { requireUser } from "@/lib/getUserHelper"
import { recordActivity } from "@/services/activity/record-activity"

export async function GET(req, {params}){

    try{
        const {id} = await params

        const user = await prisma.user.findUnique({
            where: {userId: Number(id)},
            select: {
                userId: true,
                username: true,
                firstName: true,
                lastName: true,
                userEmail: true,
                accountStatus: true,
                accountRole: true,
                dateCreated: true,
                dateUpdated: true,
                role: true,
                userStatus: true
            },
        })

        if(!user){
            return NextResponse.json({message: 'User not found'}, {status: 404})
        }

        return NextResponse.json({ status: 200, data: user, message: 'User fetched successfully' })
    }catch(err){
        return NextResponse.json({status: 500, message: 'Error fetching user'})
    }
}

export async function PATCH(req, { params }) {
    try {
        const { id } = await params
        const userId = Number(id)
        const authUser = await requireUser()

        const body = await req.json()
        const { statusId, newPassword } = body

        const updateData = {}

        if (statusId !== undefined) {
            updateData.accountStatus = Number(statusId)
        }

        if (newPassword) {
            if (authUser.role !== 1) {
                return NextResponse.json({ error: 'Only superadmin can reset passwords' }, { status: 403 })
            }
            if (newPassword.length < 8) {
                return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
            }
            updateData.userPassword = await bcrypt.hash(newPassword, 12)
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
        }

        const updated = await prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { userId },
                data: updateData,
                select: { userId: true, username: true, accountStatus: true, userStatus: true }
            })

            await recordActivity({
                tx,
                action: 'user_updated',
                userId: authUser.userId,
                title: 'User Updated',
                message: `Updated user "${user.username}"`,
                entityType: 'users',
                entityId: String(userId)
            })

            return user
        })

        return NextResponse.json({ updated })
    } catch (err) {
        console.error('Error updating user:', err)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}