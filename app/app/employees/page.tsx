"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search } from "lucide-react"

interface Employee {
  id: string
  employeeId: string
  fullName: string
  email: string
  phone: string
  department: string
  jobTitle: string
  dateOfJoining: string
}

export default function EmployeesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token")

        // Try to fetch from backend
        try {
          const response = await fetch("http://localhost:5000/api/employees", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            setEmployees(data)
          } else {
            throw new Error("Backend unavailable")
          }
        } catch (error) {
          console.log("Using mock employee data")
          // Fallback data for demo
          setEmployees([
            {
              id: "1",
              employeeId: "EMP001",
              fullName: "John Doe",
              email: "john.doe@example.com",
              phone: "123-456-7890",
              department: "Engineering",
              jobTitle: "Senior Developer",
              dateOfJoining: "2022-01-15",
            },
            {
              id: "2",
              employeeId: "EMP002",
              fullName: "Jane Smith",
              email: "jane.smith@example.com",
              phone: "123-456-7891",
              department: "Marketing",
              jobTitle: "Marketing Manager",
              dateOfJoining: "2022-02-20",
            },
            {
              id: "3",
              employeeId: "EMP003",
              fullName: "Robert Johnson",
              email: "robert.johnson@example.com",
              phone: "123-456-7892",
              department: "HR",
              jobTitle: "HR Specialist",
              dateOfJoining: "2022-03-10",
            },
            {
              id: "4",
              employeeId: "EMP004",
              fullName: "Emily Davis",
              email: "emily.davis@example.com",
              phone: "123-456-7893",
              department: "Finance",
              jobTitle: "Financial Analyst",
              dateOfJoining: "2022-04-05",
            },
            {
              id: "5",
              employeeId: "EMP005",
              fullName: "Michael Wilson",
              email: "michael.wilson@example.com",
              phone: "123-456-7894",
              department: "Sales",
              jobTitle: "Sales Representative",
              dateOfJoining: "2022-05-12",
            },
            {
              id: "6",
              employeeId: "EMP006",
              fullName: "Sarah Thompson",
              email: "sarah.thompson@example.com",
              phone: "123-456-7895",
              department: "Engineering",
              jobTitle: "UX Designer",
              dateOfJoining: "2022-06-18",
            },
            {
              id: "7",
              employeeId: "EMP007",
              fullName: "David Martinez",
              email: "david.martinez@example.com",
              phone: "123-456-7896",
              department: "Product",
              jobTitle: "Product Manager",
              dateOfJoining: "2022-07-22",
            },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error)
        // Use the fallback data
        setEmployees([
          {
            id: "1",
            employeeId: "EMP001",
            fullName: "John Doe",
            email: "john.doe@example.com",
            phone: "123-456-7890",
            department: "Engineering",
            jobTitle: "Senior Developer",
            dateOfJoining: "2022-01-15",
          },
          {
            id: "2",
            employeeId: "EMP002",
            fullName: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "123-456-7891",
            department: "Marketing",
            jobTitle: "Marketing Manager",
            dateOfJoining: "2022-02-20",
          },
          {
            id: "3",
            employeeId: "EMP003",
            fullName: "Robert Johnson",
            email: "robert.johnson@example.com",
            phone: "123-456-7892",
            department: "HR",
            jobTitle: "HR Specialist",
            dateOfJoining: "2022-03-10",
          },
          {
            id: "4",
            employeeId: "EMP004",
            fullName: "Emily Davis",
            email: "emily.davis@example.com",
            phone: "123-456-7893",
            department: "Finance",
            jobTitle: "Financial Analyst",
            dateOfJoining: "2022-04-05",
          },
          {
            id: "5",
            employeeId: "EMP005",
            fullName: "Michael Wilson",
            email: "michael.wilson@example.com",
            phone: "123-456-7894",
            department: "Sales",
            jobTitle: "Sales Representative",
            dateOfJoining: "2022-05-12",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [toast])

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setEmployees(employees.filter((emp) => emp.id !== id))
        toast({
          title: "Employee deleted",
          description: "The employee has been removed successfully.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: "Could not delete the employee. Please try again.",
        })
      }
    } catch (error) {
      console.error("Delete error:", error)
      // For demo, just remove from local state
      setEmployees(employees.filter((emp) => emp.id !== id))
      toast({
        title: "Employee deleted",
        description: "The employee has been removed successfully.",
      })
    }
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Employees"
        description="Manage your organization's employees"
        actions={
          <Button onClick={() => router.push("/employees/add")}>
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        }
      />

      <div className="mt-6 flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden lg:table-cell">Job Title</TableHead>
              <TableHead className="hidden lg:table-cell">Join Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee, index) => (
                <motion.tr
                  key={employee.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="border-b"
                >
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell className="font-medium">{employee.fullName}</TableCell>
                  <TableCell className="hidden md:table-cell">{employee.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                  <TableCell className="hidden lg:table-cell">{employee.jobTitle}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {new Date(employee.dateOfJoining).toLocaleDateString()}
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
