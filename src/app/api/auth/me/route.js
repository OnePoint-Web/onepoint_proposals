import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import prisma from '@/lib/prisma'

//Check user authentication and returns user account access (1: admin, 2: superadmin, 3: client)

export async function GET(req) {

    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if(!token){
        return NextResponse.json(
            { authentication: false },
            { status: 401 }
        )
    }
    try{
         
        const {payload} = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))

        const user = await prisma.user.findUnique({
            where: {userId: payload.userId},
            select: {
                userId: true,
                username: true,
                userEmail: true,
                firstName: true,
                lastName: true,
                accountRole: true
            }
        })

        return NextResponse.json(
            { authentication: true, user }
        ) 
    } catch{
       
        return NextResponse.json(
            {authentication: false},
            {status: 401}
        )
    }
}