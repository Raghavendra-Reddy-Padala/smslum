"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ImageIcon, FileIcon, XIcon, UploadIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type FileUploadProps = {
  onFilesSelected: (files: File[]) => void
  onFileRemoved?: (index: number) => void
  maxFiles?: number
  maxSizeMB?: number
  acceptedFileTypes?: string
  className?: string
  selectedFiles?: File[]
}

export function FileUpload({
  onFilesSelected,
  onFileRemoved,
  maxFiles = 5,
  maxSizeMB = 10,
  acceptedFileTypes = "image/*,application/pdf",
  className,
  selectedFiles = [],
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>(selectedFiles)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const validFiles = validateFiles(newFiles)

      if (validFiles.length > 0) {
        const updatedFiles = [...files, ...validFiles].slice(0, maxFiles)
        setFiles(updatedFiles)
        onFilesSelected(updatedFiles)
        simulateUpload(validFiles)
      }
    }
  }

  const validateFiles = (filesToValidate: File[]): File[] => {
    return filesToValidate.filter((file) => {
      const isValidSize = file.size <= maxSizeMB * 1024 * 1024
      const isValidType =
        acceptedFileTypes.includes("*") ||
        acceptedFileTypes.split(",").some((type) => file.type.match(type.trim().replace("*", ".*")))

      if (!isValidSize) {
        alert(`File ${file.name} exceeds the maximum size of ${maxSizeMB}MB`)
      }

      if (!isValidType) {
        alert(`File ${file.name} is not an accepted file type`)
      }

      return isValidSize && isValidType
    })
  }

  const simulateUpload = (newFiles: File[]) => {
    // Simulate upload progress for demonstration
    newFiles.forEach((file) => {
      const fileId = `${file.name}-${Date.now()}`
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }))

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const currentProgress = prev[fileId] || 0
          const newProgress = Math.min(currentProgress + 10, 100)

          if (newProgress === 100) {
            clearInterval(interval)
          }

          return { ...prev, [fileId]: newProgress }
        })
      }, 300)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files)
      const validFiles = validateFiles(newFiles)

      if (validFiles.length > 0) {
        const updatedFiles = [...files, ...validFiles].slice(0, maxFiles)
        setFiles(updatedFiles)
        onFilesSelected(updatedFiles)
        simulateUpload(validFiles)
      }
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = [...files]
    updatedFiles.splice(index, 1)
    setFiles(updatedFiles)

    if (onFileRemoved) {
      onFileRemoved(index)
    }

    onFilesSelected(updatedFiles)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5" />
    }
    return <FileIcon className="h-5 w-5" />
  }

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file)
    }
    return null
  }

  return (
    <div className={className}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          files.length >= maxFiles ? "opacity-50 pointer-events-none" : "",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium">
          {files.length >= maxFiles
            ? `Maximum ${maxFiles} files reached`
            : `Drag & drop or click to upload (${files.length}/${maxFiles})`}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Max file size: {maxSizeMB}MB</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept={acceptedFileTypes}
          className="hidden"
          disabled={files.length >= maxFiles}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => {
            const fileId = `${file.name}-${index}`
            const progress = uploadProgress[fileId] || 100
            const preview = getFilePreview(file)

            return (
              <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <div className="flex-shrink-0 h-10 w-10 rounded bg-background flex items-center justify-center">
                  {preview ? (
                    <img
                      src={preview || "/placeholder.svg"}
                      alt={file.name}
                      className="h-full w-full object-cover rounded"
                    />
                  ) : (
                    getFileIcon(file)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  {progress < 100 && <Progress value={progress} className="h-1 mt-1" />}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

