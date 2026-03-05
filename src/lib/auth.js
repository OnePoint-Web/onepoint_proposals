import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import {jwtVerify} from 'jose'


export default async function requireAuth(){
    const cookieStore = await cookies()

    const token = cookieStore.get("auth_token")?.value
    if (!token) redirect("/login")

    try{
        const {payload} = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        )
        return payload
    }catch{
        redirect('/login')
    }
    
}