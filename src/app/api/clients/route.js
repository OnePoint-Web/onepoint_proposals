import { NextResponse } from "next/server"
import { createUserSchema } from "@/schemas/user/createUser.schema"
import prisma from "@/lib/prisma"
import { Prisma } from '@prisma/client'

//Fetches all user accounts with client role (3)
export async function GET(req){
    try{

        const client = await prisma.user.findMany({
            where: {
                accountRole: 3,
            },
            select: {
                userId: true,
                username: true,
                firstName: true,
                lastName: true,
                userEmail: true,
                accountStatus: true,
                dateCreated: true,
                    include: {
                        clientProfile: true,
                    },
            }     
        })

        return NextResponse.json(client)

    }catch(err){
        return NextResponse.json(
            {error: "Failed to fetch client accounts"},
            {status: 500}
        )
    }
}