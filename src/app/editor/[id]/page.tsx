"use client"

import {
  ArrowLeft,
  ComputerIcon as Desktop,
  SmartphoneIcon as Mobile,
  Save,
  Settings,
  Download,
  ShoppingBag,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function EditorPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [productCatalogOpen, setProductCatalogOpen] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSaving(false)
    setSaveSuccess(true)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center space-x-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("desktop")}
            >
              <Desktop className="mr-2 h-4 w-4" />
              Desktop
            </Button>
            <Button
              variant={viewMode === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("mobile")}
            >
              <Mobile className="mr-2 h-4 w-4" />
              Mobile
            </Button>
          </div>

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

          <Button size="sm" onClick={() => setProductCatalogOpen(true)}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Products
          </Button>

          <Link href="/settings">
            <Button size="sm" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>

          <Button size="sm" onClick={() => setExportDialogOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-4">{viewMode === "desktop" ? <div>Desktop View</div> : <div>Mobile View</div>}</div>
    </div>
  )
}
