"use client"

interface LogoSelectorProps {
  selectedLogo: "black" | "white"
  onSelectLogo: (logo: "black" | "white") => void
}

export function LogoSelector({ selectedLogo, onSelectLogo }: LogoSelectorProps) {
  return (
    <div>
      <h3 className="text-white font-medium mb-2">Logo</h3>
      <div className="flex space-x-2">
        <button
          className={`flex-1 p-2 rounded-lg ${
            selectedLogo === "white" ? "bg-white/30" : "bg-white/10 hover:bg-white/20"
          } text-white`}
          onClick={() => onSelectLogo("white")}
        >
          White
        </button>
        <button
          className={`flex-1 p-2 rounded-lg ${
            selectedLogo === "black" ? "bg-white/30" : "bg-white/10 hover:bg-white/20"
          } text-white`}
          onClick={() => onSelectLogo("black")}
        >
          Black
        </button>
      </div>
    </div>
  )
}
