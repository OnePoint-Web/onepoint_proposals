import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(req) {
  const token = req.cookies.get("auth_token")?.value
  console.log('middleware is running')
  if (!token) {
    console.log('middleware: no token')
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/dashboard" ,"/dashboard/:path*", "/users/:path*", "/proposals/:path*", "/products/:path*", "/services/:path*"]
}
