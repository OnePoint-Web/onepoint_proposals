"use client"
import { useState, useEffect } from "react"

export default function useAuthAccess() {
  const [isAccessible, setIsAccessible] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch("/api/auth/check")
        if (res.ok) setIsAccessible(true)
        else setIsAccessible(false)
      } catch {
        setIsAccessible(false)
      } finally {
        setLoading(false)
      }
    }
    checkAccess()
  }, [])

  return { isAccessible, loading }
}