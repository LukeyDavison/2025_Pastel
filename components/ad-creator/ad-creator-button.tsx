"use client"

import dynamic from "next/dynamic"

// Dynamically import the AffiliateAdCreatorModal with SSR disabled
const AffiliateAdCreatorModal = dynamic(
  () => import("./affiliate-ad-creator-modal").then((mod) => mod.AffiliateAdCreatorModal),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-white">
          <div className="flex items-center space-x-3">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            <p>Loading editor...</p>
          </div>
        </div>
      </div>
    ),
  },
)

interface AdCreatorButtonProps {
  onClose: () => void
}

export function AdCreatorButton({ onClose }: AdCreatorButtonProps) {
  return <AffiliateAdCreatorModal onClose={onClose} />
}

// Add default export for dynamic import
export default { AdCreatorButton }
