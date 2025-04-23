"use client"

interface ImageEditorProps {
  backgroundImage: string | null
  size: { width: number; height: number; name: string }
  fitMode: "fill" | "fit" | "crop"
}

export function ImageEditor({ backgroundImage, size, fitMode }: ImageEditorProps) {
  // Calculate background image style based on fit mode
  const getBackgroundStyle = () => {
    if (!backgroundImage) return {}

    switch (fitMode) {
      case "fill":
        return { objectFit: "cover" as const }
      case "fit":
        return { objectFit: "contain" as const }
      case "crop":
        return { objectFit: "cover" as const }
      default:
        return { objectFit: "cover" as const }
    }
  }

  return (
    <div
      className="relative overflow-hidden bg-gray-800"
      style={{
        width: size.width,
        height: size.height,
      }}
    >
      {/* Background */}
      {backgroundImage ? (
        <img
          src={backgroundImage || "/placeholder.svg"}
          alt="Background"
          className="absolute top-0 left-0 w-full h-full"
          style={getBackgroundStyle()}
        />
      ) : (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-700 flex items-center justify-center">
          <p className="text-white/50 text-sm">No background image</p>
        </div>
      )}

      {/* Size indicator */}
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {size.width} × {size.height}
      </div>
    </div>
  )
}
