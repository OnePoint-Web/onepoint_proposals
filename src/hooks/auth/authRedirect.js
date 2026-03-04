import {redirect} from 'next/navigation'
import {jwtVerify} from 'jose'
import {cookies} from 'next/headers'

export default async function useAuthRedirect(){

    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if(!token){
        console.log('no token')
        redirect('/login')
    }

    try{
        await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        )
    }catch(err){
        console.error("JWT ERROR:", err.code)
        console.log('catch return to login')
        redirect("/login")
    }

    redirect('/dashboard')
    
}