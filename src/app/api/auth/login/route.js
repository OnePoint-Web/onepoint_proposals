import {NextResponse} from 'next/server'
import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
import { SignJWT } from "jose"
import prisma from '@/lib/prisma'


export async function POST(req){
    const { username, password, rememberMe = false } = await req.json()

    const user = await prisma.user.findUnique({
        where: {username},
        include: {
            role: true,
            userStatus: true
        }
    })

    if(!user){
        return NextResponse.json(
            {type: 'error', message: "Invalid Credentials"},
            {status: 401}
        )
    }

    const valid = await bcrypt.compare(password, user.userPassword)

    if(!valid){
        return NextResponse.json(
            {type: 'error', message: "Invalid Credentials"},
            {status: 401}
        )
    }

    if (user.userStatus.statusId !== 2) {
        return NextResponse.json(
            { type: 'error', message: `Account is ${user.userStatus.status}` },
            { status: 403 }
        )
    }
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    const sessionDuration = rememberMe ? '30d' : '1d'

    const token = await new SignJWT(
        {
            userId: user.userId,
            role: user.role.roleId,
            status: user.userStatus.statusId
        })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(sessionDuration)
        .sign(secret)

    const res = NextResponse.json({success: true})

    res.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        path: '/',
        ...(rememberMe && { maxAge: 60 * 60 * 24 * 30 })
    })

    return res
}