import {NextResponse} from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'


export async function POST(req){
    const {username, password} = await req.json()

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
            {tpye: 'error', message: "Invalid Credentials"},
            {status: 401}
        )
    }

    if (user.userStatus.statusId !== 1) {
        return NextResponse.json(
            { type: 'error', message: `Account is ${user.userStatus.status}` },
            { status: 403 }
        )
    }

    const token = jwt.sign(
        {
            userId: user.userId,
            role: user.role.roleId,
            status: user.userStatus.statusId
        },
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    )

    const res = NextResponse.json({success: true})

    res.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        path: '/'
    })

    return res
}