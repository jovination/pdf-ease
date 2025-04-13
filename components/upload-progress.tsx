"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { FileText, CheckCircle, AlertCircle } from "lucide-react"

interface UploadProgressProps {
  fileName: string
  fileSize: number
  status: "uploading" | "processing" | "complete" | "error"
  progress: number
  error?: string
}

export function UploadProgress({ fileName, fileSize, status, progress, error }: UploadProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    // Animate progress for smoother visual
    const timer = setTimeout(() => {
      setDisplayProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg border p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md">
          <FileText className="h-6 w-6 text-purple-600 dark:text-purple-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm truncate">{fileName}</h3>
            <span className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</span>
          </div>
          <div className="mt-2">
            <Progress value={displayProgress} className="h-2" />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center">
              {status === "uploading" && (
                <span className="text-xs text-muted-foreground">Uploading... {progress}%</span>
              )}
              {status === "processing" && <span className="text-xs text-muted-foreground">Processing document...</span>}
              {status === "complete" && (
                <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" /> Complete
                </span>
              )}
              {status === "error" && (
                <span className="text-xs text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> {error || "Upload failed"}
                </span>
              )}
            </div>
            {status === "complete" && <span className="text-xs text-green-600 dark:text-green-400">Ready to edit</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
