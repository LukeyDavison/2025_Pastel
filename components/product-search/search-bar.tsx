"use client"

import type React from "react"
import { useState } from "react"
import { Search, Loader2 } from "lucide-react"

interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSearch: (term: string) => void
  isLoading?: boolean
  initialValue?: string
}

export function SearchBar({ value, onChange, onSearch, isLoading = false, initialValue = "" }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue || value || "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    if (onChange) onChange(newValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-container">
      <Search className="search-icon" size={18} />
      <input
        type="text"
        value={value !== undefined ? value : searchTerm}
        onChange={handleChange}
        placeholder="Search for products..."
        className="search-input"
        disabled={isLoading}
      />
      {isLoading && (
        <Loader2 className="absolute right-16 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white animate-spin" />
      )}
      <button type="submit" className="search-button" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  )
}
