"use client"

import { useState } from "react"
import { useEmailBuilder } from "@/contexts/email-builder-context"
import { FramerEmailCanvas } from "@/components/email-builder/framer-email-canvas"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FramerDemo() {
  const router = useRouter()
  const { currentTemplate, updateTemplate } = useEmailBuilder()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = async () => {
    if (!currentTemplate) return

    setIsSaving(true)
    setSaveSuccess(false)

    try {
      // Update the template's updatedAt timestamp
      updateTemplate({
        ...currentTemplate,
        updatedAt: new Date().toISOString(),
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSaveSuccess(true)

      // Reset success state after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Error saving template:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!currentTemplate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading template...</h2>
          <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-white z-10">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="ml-4">
            <h1 className="text-lg font-medium">{currentTemplate.name || "Untitled Email"}</h1>
            <p className="text-sm text-gray-500">Last saved: {new Date(currentTemplate.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="min-w-[100px]">
            {isSaving ? (
              <>Saving...</>
            ) : saveSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Saved!
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-100">
        <FramerEmailCanvas />
      </div>
    </div>
  )
}
