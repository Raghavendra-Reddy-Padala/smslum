"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Accessibility, Moon, Sun, Type, ZoomIn, ZoomOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

export function AccessibilityMenu() {
  const { theme, setTheme } = useTheme()
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)

    // Load saved preferences
    const savedFontSize = localStorage.getItem("sms_fontSize")
    const savedHighContrast = localStorage.getItem("sms_highContrast")
    const savedReducedMotion = localStorage.getItem("sms_reducedMotion")

    if (savedFontSize) setFontSize(Number.parseInt(savedFontSize))
    if (savedHighContrast) setHighContrast(savedHighContrast === "true")
    if (savedReducedMotion) setReducedMotion(savedReducedMotion === "true")

    // Apply saved preferences
    applyAccessibilitySettings(
      savedFontSize ? Number.parseInt(savedFontSize) : 100,
      savedHighContrast === "true",
      savedReducedMotion === "true",
    )
  }, [])

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150)
    setFontSize(newSize)
    localStorage.setItem("sms_fontSize", newSize.toString())
    applyAccessibilitySettings(newSize, highContrast, reducedMotion)
  }

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80)
    setFontSize(newSize)
    localStorage.setItem("sms_fontSize", newSize.toString())
    applyAccessibilitySettings(newSize, highContrast, reducedMotion)
  }

  const toggleHighContrast = () => {
    const newValue = !highContrast
    setHighContrast(newValue)
    localStorage.setItem("sms_highContrast", newValue.toString())
    applyAccessibilitySettings(fontSize, newValue, reducedMotion)
  }

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion
    setReducedMotion(newValue)
    localStorage.setItem("sms_reducedMotion", newValue.toString())
    applyAccessibilitySettings(fontSize, highContrast, newValue)
  }

  const applyAccessibilitySettings = (size: number, contrast: boolean, motion: boolean) => {
    // Apply font size
    document.documentElement.style.fontSize = `${size}%`

    // Apply high contrast
    if (contrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Apply reduced motion
    if (motion) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Accessibility options">
          <Accessibility className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Accessibility</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4 mr-2" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 mr-2" />
              Dark Mode
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={increaseFontSize}>
          <ZoomIn className="h-4 w-4 mr-2" />
          Increase Font Size
        </DropdownMenuItem>

        <DropdownMenuItem onClick={decreaseFontSize}>
          <ZoomOut className="h-4 w-4 mr-2" />
          Decrease Font Size
        </DropdownMenuItem>

        <DropdownMenuItem onClick={toggleHighContrast}>
          <Type className="h-4 w-4 mr-2" />
          {highContrast ? "Disable High Contrast" : "Enable High Contrast"}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={toggleReducedMotion}>
          <span className="h-4 w-4 mr-2 flex items-center justify-center">
            <span className="block h-2 w-2 bg-current rounded-full" />
          </span>
          {reducedMotion ? "Disable Reduced Motion" : "Enable Reduced Motion"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

