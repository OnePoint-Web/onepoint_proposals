import { NextResponse } from "next/server"
import { createClientSchema } from "@/schemas/client/createClient.schema"
import prisma from "@/lib/prisma"
import bcrypt from 'bcryptjs'



export async function POST(req){
    try{
        const body = await req.json()

        const data = createClientSchema.parse(body)

        const hashedPassword = await bcrypt.hash(data.password, 12)

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                username: data.username,
                firstName: data.first_name,
                lastName: data.last_name,
                userEmail: data.email,
                userPassword: hashedPassword,
                accountStatus: 2,
                accountRole: 3,
                },
                select: { 
                userId: true,
                username: true, 
                userEmail: true, 
                accountStatus: true,
                accountRole: true, 
                dateCreated: true, 
                },
            });

            const clientProfile = await tx.clientProfile.create({
                data: {
                userId: user.userId,
                companyName: data.company_name,
                companyEmail: data.company_email || null,
                companyAddress: data.company_address || null,
                website: data.website || null,
                },
            });

            return { user, clientProfile };
            });


        return NextResponse.json(
            { message: "User created", ...result },
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


//Fetches all user accounts with client role (3)
export async function GET(req){
    try{


        const {searchParams} = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");

        const search = searchParams.get("search") || "";
        const status = searchParams.get("status");

        const sortBy = searchParams.get("sortBy") || "dateCreated";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        const safePage = Math.max(page, 1);
        const safeLimit = Math.max(limit, 1);

        const searchTerms = search
            .trim()
            .split(" ")
            .filter(Boolean);


        const where = {
            role: {roleId: 3},
            ...(status && { userStatus:{status: status} }),

            ...(searchTerms.length > 0 && {
                AND: searchTerms.map((term) => ({
                    OR: [
                        {
                            username: {
                                contains: term,
                            },
                        },
                        {
                            firstName: {
                                contains: term,
                            }
                        },
                        {
                            lastName: {
                                contains: term,
                            }
                        },
                        {
                            userEmail: {
                                contains: term,
                            }
                        },
                        {
                            clientProfiles: {
                                companyName: {
                                    contains: term
                                } 
                            }
                        }
                    ]
                }))
            })
        }

        const [clients, total] = await Promise.all([
            prisma.user.findMany({
            where,
    
            select: {
                userId: true,
                username: true,
                firstName: true,
                lastName: true,
                userEmail: true,
                accountStatus: true,
                clientProfile: true,
                userStatus: {
                    select: {
                        statusId: true,
                        status: true
                    }
                },
                dateCreated: true
            },
    
            skip: (safePage - 1) * safeLimit,
            take: safeLimit,
    
            orderBy: {
                [sortBy]: sortOrder,
            },
            }),
    
            prisma.user.count({
                where,
            }),
        ]);


        return Response.json({
            data: clients,
            meta: {
                total,
                page: safePage,
                limit: safeLimit,
                totalPages: Math.ceil(total / safeLimit),
            },
        });


    }catch(err){
        return NextResponse.json(
            {error: "Failed to fetch client accounts"},
            {status: 500}
        )
    }
}