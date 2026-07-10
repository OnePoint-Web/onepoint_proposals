import { cookies } from "next/headers"
import { jwtVerify } from "jose"

export async function requireUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    throw new Error("Unauthorized")
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

    return payload
  } catch {
    throw new Error("Unauthorized")
  }
}