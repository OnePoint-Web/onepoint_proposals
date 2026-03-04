import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import {jwtVerify} from 'jose'
import useAuthRedirect from '@/hooks/auth/authRedirect.js'

export default async function Home() {

  await useAuthRedirect()

}
