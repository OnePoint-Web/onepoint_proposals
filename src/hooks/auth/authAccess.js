"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"

export default function useAuthAccess(access) {

  const [isAccessible, setIsAccessible] = useState(false)
  const [loading, setLoading] = useState(true)

  const {user} = useAuth()

  useEffect(() => {
    const checkAccess = async () => {

      try {

        if (!user){
           setIsAccessible(false)
           return
        }
        
        if (user && user.accountRole === Number(access)){
            setIsAccessible(true)
        } 
        else setIsAccessible(false)
      } catch {
        setIsAccessible(false)
      } finally {
        setLoading(false)
      }
    }
    
    checkAccess()
  }, [user, access])

  return { isAccessible, loading }

}