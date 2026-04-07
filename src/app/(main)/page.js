import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import {jwtVerify} from 'jose'

export default async function Home() {

  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    console.log('no token')
    redirect("/login")
  }

  try {
    
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

  } catch(err){
    console.error("JWT ERROR:", err.code)
    redirect("/login")
  }

  redirect("/dashboard")

}
