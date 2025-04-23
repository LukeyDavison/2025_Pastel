"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Trash2, ChevronDown, ChevronUp } from "lucide-react"

interface TextEditorProps {
  text: {
    id: string
    text: string
  }
  onUpdate: (updates: Partial<{ text: string }>) => void
  onRemove: () => void
}

export function TextEditor({ text, onUpdate, onRemove }: TextEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white/10 rounded-lg p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-white mr-2 p-1 hover:bg-white/10 rounded">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <Input
            value={text.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            className="bg-transparent border-none text-white h-8 px-1 focus-visible:ring-0"
          />
        </div>
        <button onClick={onRemove} className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
