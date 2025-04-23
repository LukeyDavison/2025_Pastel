"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

// Dynamically import the GraphicEditor component with no SSR
const GraphicEditor = dynamic(() => import("./graphic-editor").then((mod) => mod.GraphicEditor), {
  ssr: false,
})

export function GraphicEditorWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading editor...</span>
        </div>
      }
    >
      <GraphicEditor />
    </Suspense>
  )
}
