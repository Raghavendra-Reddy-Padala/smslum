"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileText, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type ExportButtonProps = {
  data: any[]
  filename?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ExportButton({
  data,
  filename = "export",
  variant = "outline",
  size = "default",
  className,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = () => {
    setIsExporting(true)

    try {
      // Get headers from the first object
      const headers = Object.keys(data[0] || {})

      // Convert data to CSV format
      const csvRows = []

      // Add headers
      csvRows.push(headers.join(","))

      // Add rows
      for (const row of data) {
        const values = headers.map((header) => {
          const value = row[header]
          // Handle special characters and quotes
          const escaped = ("" + (value ?? "")).replace(/"/g, '""')
          return `"${escaped}"`
        })
        csvRows.push(values.join(","))
      }

      // Create blob and download
      const csvString = csvRows.join("\n")
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}.csv`)
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting to CSV:", error)
      alert("Failed to export data. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const exportToPDF = () => {
    setIsExporting(true)

    // Simulate PDF generation
    setTimeout(() => {
      alert("PDF export functionality would be implemented here with a library like jsPDF or pdfmake")
      setIsExporting(false)
    }, 1000)
  }

  const exportToExcel = () => {
    setIsExporting(true)

    // Simulate Excel generation
    setTimeout(() => {
      alert("Excel export functionality would be implemented here with a library like xlsx")
      setIsExporting(false)
    }, 1000)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileText className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          <FileText className="h-4 w-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

