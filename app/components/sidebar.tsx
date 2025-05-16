"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-provider"
import { ChevronLeft, LayoutDashboard, Users, Upload, MessageSquare, UserPlus, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname()
  const { toggleSidebar, setIsAuthenticated } = useSidebar()

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Upload", href: "/upload", icon: Upload },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Add Employee", href: "/employees/add", icon: UserPlus },
  ]

  return (
    <motion.div
      initial={{ width: isOpen ? 240 : 80 }}
      animate={{ width: isOpen ? 240 : 80 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-card border-r border-border relative"
    >
      <div className="p-4 flex items-center justify-between">
        <h1 className={`font-bold text-xl transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
          {isOpen ? "AI Platform" : ""}
        </h1>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="rounded-full">
          <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`} />
        </Button>
      </div>

      <nav className="mt-8">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${isOpen ? "" : "justify-center"}`}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    <span
                      className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 h-0 overflow-hidden"}`}
                    >
                      {item.name}
                    </span>
                  </Button>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="absolute bottom-4 w-full px-2 space-y-2">
        <div className={`flex ${isOpen ? "justify-between" : "justify-center"} items-center px-2`}>
          {isOpen && <span className="text-sm text-muted-foreground">Theme</span>}
          <ThemeToggle />
        </div>
        <Button
          variant="outline"
          className={`w-full justify-start ${isOpen ? "" : "justify-center"}`}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span
            className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 h-0 overflow-hidden"}`}
          >
            Logout
          </span>
        </Button>
      </div>
    </motion.div>
  )
}
