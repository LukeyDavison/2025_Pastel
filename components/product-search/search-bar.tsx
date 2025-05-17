"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { debounce } from "@/utils/performance-utils"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: (value: string) => void
  isLoading?: boolean
  placeholder?: string
  autoFocus?: boolean
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  isLoading = false,
  placeholder = "Search for products...",
  autoFocus = false,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  // Create a debounced search function
  const debouncedSearch = useRef(
    debounce((searchTerm: string) => {
      onSearch(searchTerm)
    }, 500),
  ).current

  // Update local state when prop value changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Auto-focus the input if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)

    // Trigger debounced search if there's a value
    if (newValue.trim()) {
      debouncedSearch(newValue)
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSearch(inputValue)
    }
  }

  // Clear the search input
  const handleClear = () => {
    setInputValue("")
    onChange("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-white/70">
          <Search className="h-5 w-5" />
        </div>

        <input
          ref={inputRef}
          type="search"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-white/10 border border-white/20 rounded-md py-2 pl-10 pr-10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
          disabled={isLoading}
        />

        {inputValue && !isLoading && (
          <button type="button" onClick={handleClear} className="absolute right-3 text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        )}

        {isLoading && (
          <div className="absolute right-3 text-white/70">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
      </div>
    </form>
  )
}
