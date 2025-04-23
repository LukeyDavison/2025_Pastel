import { ErrorBoundary } from "@/components/error-boundary"
import { GraphicEditorWrapper } from "@/components/graphic-editor/graphic-editor-wrapper"

export default function EditorPage() {
  return (
    <ErrorBoundary>
      <GraphicEditorWrapper />
    </ErrorBoundary>
  )
}
