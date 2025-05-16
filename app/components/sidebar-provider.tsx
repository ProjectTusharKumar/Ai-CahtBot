"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { LoadingScreen } from "@/components/loading-screen"

type SidebarContextType = {
  isOpen: boolean
  toggleSidebar: () => void
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  isLoading: boolean
  setIsLoading: (value: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          // Accept any token that starts with our mock prefix
          if (token.startsWith("mock-jwt-token-")) {
            setIsAuthenticated(true)
          } else {
            // Try to verify with backend
            try {
              const response = await fetch("http://localhost:5000/api/auth/verify", {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })

              if (response.ok) {
                setIsAuthenticated(true)
              } else {
                localStorage.removeItem("token")
                if (!pathname.includes("/auth")) {
                  router.push("/auth/login")
                }
              }
            } catch (error) {
              // If backend verification fails but we have a token, still authenticate
              // This allows the app to work without a backend
              setIsAuthenticated(true)
            }
          }
        } else if (!pathname.includes("/auth")) {
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        // Simulate loading for better UX
        setTimeout(() => setIsLoading(false), 1000)
      }
    }

    checkAuth()
  }, [pathname, router])

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggleSidebar,
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        setIsLoading,
      }}
    >
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          {isAuthenticated && pathname !== "/auth/login" && pathname !== "/auth/register" ? (
            <div className="flex h-screen">
              <Sidebar isOpen={isOpen} />
              <main className="flex-1 overflow-auto transition-all duration-300">{children}</main>
            </div>
          ) : (
            children
          )}
        </>
      )}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
