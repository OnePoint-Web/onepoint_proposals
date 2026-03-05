"use client"
import {createContext, useContext, useEffect, useState} from 'react'

const AuthContext = createContext()


export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        })

        if (!res.ok) {
          setUser(null)
          return
        }

        const data = await res.json()
        setUser(data.user)
        
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const onLogout = async () => {
        await fetch('/api/auth/logout', {
            method: 'POST'
        })
        setUser(null)
        window.location.href = '/login'
    }

  return(
    <AuthContext.Provider
        value={{user, onLogout, loading}}
    >
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);