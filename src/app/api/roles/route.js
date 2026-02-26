import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      select: {
        roleId: true,
        role: true,
      },
    })

    return NextResponse.json(roles)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    )
  }
}