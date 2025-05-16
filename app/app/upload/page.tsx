"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { useToast } from "@/hooks/use-toast"
import { Upload, File, X, Check } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  status: "uploading" | "success" | "error"
  progress: number
}

export default function UploadPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      status: "uploading",
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate file upload
    newFiles.forEach((file) => {
      simulateUpload(file.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5

      if (progress >= 100) {
        clearInterval(interval)
        progress = 100

        setFiles((prev) =>
          prev.map((file) => (file.id === fileId ? { ...file, status: "success", progress: 100 } : file)),
        )

        toast({
          title: "File uploaded",
          description: "Your file has been uploaded successfully.",
        })
      } else {
        setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, progress } : file)))
      }
    }, 500)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="p-6">
      <PageHeader title="Upload Files" description="Upload and manage your files" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6"
      >
        <Card>
          <CardContent className="pt-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                multiple
              />
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Drag and drop files here</h3>
              <p className="text-muted-foreground mb-4">or click the button below to select files</p>
              <Button onClick={() => fileInputRef.current?.click()}>Select Files</Button>
            </div>

            {files.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Uploaded Files</h3>
                <div className="space-y-4">
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center p-3 border rounded-lg"
                    >
                      <File className="h-6 w-6 mr-3 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span className="mx-2">•</span>
                          <span>
                            {file.status === "uploading"
                              ? "Uploading..."
                              : file.status === "success"
                                ? "Uploaded"
                                : "Error"}
                          </span>
                        </div>
                        {file.status === "uploading" && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${file.progress}%` }} />
                          </div>
                        )}
                      </div>
                      {file.status === "success" ? (
                        <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-2">
                          <Check className="h-4 w-4" />
                        </div>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
