"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSidebar } from "@/components/sidebar-provider"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useSidebar()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  return null
}
