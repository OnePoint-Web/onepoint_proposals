import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const status = await prisma.accountStatus.findMany({
      select: {
        statusId: true,
        status: true,
      },
    })

    return NextResponse.json(status)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to fetch acccount status" },
      { status: 500 }
    )
  }
}