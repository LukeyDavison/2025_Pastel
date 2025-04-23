"use client"

import { ImageEditor } from "./image-editor"

interface MultiSizeCanvasProps {
  backgroundImage: string | null
  fitMode: "fill" | "fit" | "crop"
  onSelectSize: (size: { width: number; height: number; name: string }) => void
}

export function MultiSizeCanvas({ backgroundImage, fitMode, onSelectSize }: MultiSizeCanvasProps) {
  const commonSizes = [
    { width: 300, height: 250, name: "300x250", description: "Medium Rectangle" },
    { width: 728, height: 90, name: "728x90", description: "Leaderboard" },
    { width: 300, height: 600, name: "300x600", description: "Half Page" },
    { width: 320, height: 50, name: "320x50", description: "Mobile Banner" },
  ]

  return (
    <div className="grid grid-cols-2 gap-6 p-4 max-w-4xl mx-auto">
      {commonSizes.map((size) => (
        <div key={size.name} className="flex flex-col items-center" onClick={() => onSelectSize(size)}>
          <div className="mb-2 text-white text-sm font-medium">
            {size.name} - {size.description}
          </div>
          <div className="border border-white/20 hover:border-white/50 cursor-pointer transition-colors rounded-lg overflow-hidden">
            <ImageEditor backgroundImage={backgroundImage} size={size} fitMode={fitMode} />
          </div>
        </div>
      ))}
    </div>
  )
}
