"use client"

import { Type, Square, ImageIcon, Pencil, Trash2, Eye, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LayerPanelProps {
  elements: any[]
  selectedElement: string | null
  onSelectElement: (id: string) => void
  onDeleteElement: (id: string) => void
}

export function LayerPanel({ elements, selectedElement, onSelectElement, onDeleteElement }: LayerPanelProps) {
  const getElementIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type className="h-4 w-4" />
      case "shape":
        return <Square className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "drawing":
        return <Pencil className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="w-64 bg-white border-l h-full">
      <div className="p-3 border-b">
        <h2 className="font-medium">Layers</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-48px)]">
        <div className="p-2">
          {elements.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">No elements added yet</div>
          ) : (
            <div className="space-y-1">
              {elements.map((element, index) => (
                <div
                  key={element.id}
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    selectedElement === element.id ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                  onClick={() => onSelectElement(element.id)}
                >
                  <div className="mr-2 text-gray-500">{getElementIcon(element.type)}</div>
                  <div className="flex-1 truncate">{element.type === "text" ? element.content : element.type}</div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Lock className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteElement(element.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
