"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  isLoading?: boolean
}

export function SearchBar({ value, onChange, onSearch, isLoading = false }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close focus state when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative w-full">
      <div className={`relative mb-4 transition-transform duration-300 ${isFocused ? "scale-105" : ""}`}>
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for a product..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            onFocus={() => setIsFocused(true)}
            className="w-full pl-10 pr-10 border rounded-md"
          />
          <button
            onClick={onSearch}
            disabled={isLoading}
            className="absolute right-2 flex items-center justify-center p-1 text-white rounded-full bg-gray-500 hover:bg-gray-600"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
