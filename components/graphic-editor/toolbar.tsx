"use client"

import {
  Type,
  Square,
  ImageIcon,
  Pencil,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface ToolbarProps {
  onAddText: () => void
  onAddShape: () => void
  onAddImage: () => void
  onToggleDrawing: () => void
  onUndo: () => void
  onRedo: () => void
}

export function Toolbar({ onAddText, onAddShape, onAddImage, onToggleDrawing, onUndo, onRedo }: ToolbarProps) {
  return (
    <div className="bg-white border-b p-2 flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={onAddText} title="Add Text">
        <Type className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onAddShape} title="Add Shape">
        <Square className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onAddImage} title="Add Image">
        <ImageIcon className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onToggleDrawing} title="Drawing Tool">
        <Pencil className="h-5 w-5" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="icon" onClick={onUndo} title="Undo">
        <Undo2 className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onRedo} title="Redo">
        <Redo2 className="h-5 w-5" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="icon" title="Bold">
        <Bold className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" title="Italic">
        <Italic className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" title="Underline">
        <Underline className="h-5 w-5" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="icon" title="Align Left">
        <AlignLeft className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" title="Align Center">
        <AlignCenter className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" title="Align Right">
        <AlignRight className="h-5 w-5" />
      </Button>

      <div className="flex-1"></div>

      <Button variant="outline" size="sm" className="ml-auto" title="Export">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  )
}
