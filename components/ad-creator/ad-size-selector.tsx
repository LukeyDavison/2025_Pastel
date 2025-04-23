"use client"

interface AdSizeSelectorProps {
  selectedSize: { width: number; height: number; name: string }
  onSelectSize: (size: { width: number; height: number; name: string }) => void
}

export function AdSizeSelector({ selectedSize, onSelectSize }: AdSizeSelectorProps) {
  const commonSizes = [
    { width: 300, height: 250, name: "300x250", description: "Medium Rectangle" },
    { width: 728, height: 90, name: "728x90", description: "Leaderboard" },
    { width: 300, height: 600, name: "300x600", description: "Half Page" },
    { width: 320, height: 50, name: "320x50", description: "Mobile Banner" },
  ]

  return (
    <div>
      <h3 className="text-white font-medium mb-2">Ad Size</h3>
      <div className="space-y-2">
        {commonSizes.map((size) => (
          <button
            key={size.name}
            className={`w-full p-2 rounded-lg text-left ${
              selectedSize.name === size.name ? "bg-white/30" : "bg-white/10 hover:bg-white/20"
            } text-white`}
            onClick={() => onSelectSize(size)}
          >
            <div className="flex justify-between items-center">
              <span>{size.name}</span>
              <span className="text-xs text-white/70">{size.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
