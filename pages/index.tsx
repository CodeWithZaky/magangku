"use client"

import { useRouter } from "next/router"
import { useEffect } from "react"
import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-pulse text-2xl font-semibold">Loading...</div>
    </div>
  )
}
