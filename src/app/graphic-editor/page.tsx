"use client"

import { ErrorBoundary } from "@/components/error-boundary"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Dynamically import the GraphicEditorWrapper with SSR disabled
const GraphicEditorWrapper = dynamic(
  () => import("@/components/graphic-editor/graphic-editor-wrapper").then((mod) => mod.GraphicEditorWrapper),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-2 text-lg">Loading editor...</span>
      </div>
    ),
  },
)

export default function GraphicEditorPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-[#001022] via-[#3f93ff] to-[#0047ff]">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" passHref>
            <Button variant="ghost" className="text-white mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <GraphicEditorWrapper />
        </div>
      </div>
    </ErrorBoundary>
  )
}
