import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function GET(req) {
  const token = req.cookies.get("auth_token")?.value
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 })

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    return NextResponse.json({ authenticated: true })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}