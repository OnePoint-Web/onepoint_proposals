import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req, {params}){

    try{
        const {id} = await params
        
        const user = await prisma.user.findUnique({
            where: {userId: Number(id)},
            select: {
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
            return NextResponse.json({message: 'User not found'})
        }
        console.log(user)
        return NextResponse.json(
            {status: 200,
            data: user,
            message: 'User fetched succesfully'}
        )
    }catch(err){
        return NextResponse.json({status: 500, message: 'Error fetching user'})
    }
}