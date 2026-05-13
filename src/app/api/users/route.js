import { NextResponse } from "next/server"
import { createUserSchema } from "@/schemas/user/createUser.schema"
import prisma from "@/lib/prisma"
import { Prisma } from '@prisma/client'
import bcrypt from "bcryptjs"


export async function POST(req){
    try{
        const body = await req.json()

        const data = createUserSchema.parse(body)

        const hashedPassword = await bcrypt.hash(data.password, 12)

        const user = await prisma.user.create({
            data:{
                username: data.username,
                firstName: data.first_name,
                lastName: data.last_name,
                userEmail: data.email,
                userPassword: hashedPassword,
                accountStatus: 2,
                accountRole: parseInt(data.role),
            },
            select:{ 
                userId: true,
                username: true, 
                userEmail: true, 
                accountStatus: true,
                accountRole: true, 
                dateCreated: true, 
            },
        })

        return NextResponse.json(
            { message: "User created", user },
            { status: 201 }
        )

    }catch (err) {
        // Handle Prisma duplicate errors (P2002)
        if (err && typeof err === "object" && "code" in err) {
            if (err.code === "P2002") {
            const prismaField = err.meta?.target ?? "field"

            const fieldMap = {
                User_username_key: 'username',
                User_userEmail_key: "email"
            }
            const field = fieldMap[prismaField] ?? "unknown"
            console.log("Duplicate field(1):", field)

            return NextResponse.json(
                { field, message: `Account with ${field} already exists` },
                { status: 409 }
            )
            }

            // Any other Prisma error
            return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
            )
        }

        // Fallback for non-Prisma errors
        console.error("Unhandled error:", err)

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
        }
    }


    export async function GET(req){
        try{
            const user = await prisma.user.findMany({
                where: {
                    accountRole:{
                        in: [1, 2]
                    }
                },
                select: {
                    userId: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    userEmail: true,
                    accountStatus: true,
                    role: {
                        select: {
                            roleId: true,
                            role: true,
                        },
                    },
                    userStatus: {
                        select: {
                            statusId: true,
                            status: true
                        }
                    },
                    dateCreated: true
                },
            })

            return NextResponse.json(user)

        } catch(err){
            return NextResponse.json(
                { error: "Failed to fetch roles" },
                { status: 500 }
            )
        }
    }