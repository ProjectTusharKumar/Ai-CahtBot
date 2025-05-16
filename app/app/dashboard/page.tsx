"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, MessageSquare, Upload, UserPlus } from "lucide-react"

interface DashboardStats {
  totalEmployees: number
  totalChats: number
  totalUploads: number
  recentEmployees: {
    id: string
    name: string
    department: string
    joinDate: string
  }[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token")

        // Try to fetch from backend
        try {
          const response = await fetch("http://localhost:5000/api/dashboard", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            setStats(data)
          } else {
            throw new Error("Backend unavailable")
          }
        } catch (error) {
          console.log("Using mock dashboard data")
          // Fallback data for demo
          setStats({
            totalEmployees: 42,
            totalChats: 156,
            totalUploads: 23,
            recentEmployees: [
              { id: "1", name: "John Doe", department: "Engineering", joinDate: "2023-05-15" },
              { id: "2", name: "Jane Smith", department: "Marketing", joinDate: "2023-06-20" },
              { id: "3", name: "Robert Johnson", department: "HR", joinDate: "2023-07-10" },
              { id: "4", name: "Emily Williams", department: "Finance", joinDate: "2023-08-05" },
              { id: "5", name: "Michael Brown", department: "Operations", joinDate: "2023-09-12" },
            ],
          })
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        // Fallback data for demo
        setStats({
          totalEmployees: 42,
          totalChats: 156,
          totalUploads: 23,
          recentEmployees: [
            { id: "1", name: "John Doe", department: "Engineering", joinDate: "2023-05-15" },
            { id: "2", name: "Jane Smith", department: "Marketing", joinDate: "2023-06-20" },
            { id: "3", name: "Robert Johnson", department: "HR", joinDate: "2023-07-10" },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    { title: "Total Employees", value: stats?.totalEmployees || 0, icon: Users, color: "bg-blue-500" },
    { title: "Total Chats", value: stats?.totalChats || 0, icon: MessageSquare, color: "bg-green-500" },
    { title: "Total Uploads", value: stats?.totalUploads || 0, icon: Upload, color: "bg-purple-500" },
    { title: "New This Month", value: stats?.recentEmployees?.length || 0, icon: UserPlus, color: "bg-orange-500" },
  ]

  return (
    <div className="p-6">
      <PageHeader title="Dashboard" description="Overview of your organization" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`${card.color} p-2 rounded-full`}>
                  <card.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{card.value}</div>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Employees</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {stats?.recentEmployees?.map((employee, index) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="py-3"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.department}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Joined: {new Date(employee.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
