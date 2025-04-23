"use client"

import { useEmailBuilder } from "@/contexts/email-builder-context"
import { Type, AlignLeft, ImageIcon, Square, Minus, ArrowUp, Share2, Code, ShoppingBag } from "lucide-react"

export function ContentPanel() {
  const { addBlock } = useEmailBuilder()

  const contentBlocks = [
    {
      type: "title",
      icon: <Type className="h-6 w-6" />,
      label: "Title",
    },
    {
      type: "paragraph",
      icon: <AlignLeft className="h-6 w-6" />,
      label: "Paragraph",
    },
    {
      type: "image",
      icon: <ImageIcon className="h-6 w-6" />,
      label: "Image",
    },
    {
      type: "button",
      icon: <Square className="h-6 w-6" />,
      label: "Button",
    },
    {
      type: "divider",
      icon: <Minus className="h-6 w-6" />,
      label: "Divider",
    },
    {
      type: "spacer",
      icon: <ArrowUp className="h-6 w-6" />,
      label: "Spacer",
    },
    {
      type: "social",
      icon: <Share2 className="h-6 w-6" />,
      label: "Social",
    },
    {
      type: "html",
      icon: <Code className="h-6 w-6" />,
      label: "HTML",
    },
    {
      type: "product",
      icon: <ShoppingBag className="h-6 w-6" />,
      label: "Products",
    },
  ]

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Content Blocks</h3>

      <div className="grid grid-cols-2 gap-4">
        {contentBlocks.map((block) => (
          <div
            key={block.type}
            className="flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all duration-200"
            onClick={() => addBlock(block.type as any)}
          >
            <div className="mb-2">{block.icon}</div>
            <span className="text-sm">{block.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
