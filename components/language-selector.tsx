"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Globe } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "hi", label: "हिन्दी" },
  { value: "ar", label: "العربية" },
]

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [language, setLanguage] = useState("en")
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    const storedLanguage = localStorage.getItem("sms_language")
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }
  }, [])

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    localStorage.setItem("sms_language", value)
    setOpen(false)

    // In a real app, this would trigger language change in your i18n system
    // For example: i18n.changeLanguage(value);
  }

  if (!mounted) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="flex items-center gap-1 px-2"
          aria-label="Select language"
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:inline-block">
            {languages.find((l) => l.value === language)?.label || "English"}
          </span>
          <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((lang) => (
                <CommandItem key={lang.value} value={lang.value} onSelect={handleLanguageChange}>
                  <Check className={cn("mr-2 h-4 w-4", language === lang.value ? "opacity-100" : "opacity-0")} />
                  {lang.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

