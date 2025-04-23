"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  ComputerIcon as Desktop,
  SmartphoneIcon as Mobile,
  Save,
  Settings,
  Download,
  ShoppingBag,
  CheckCircle,
  Layers,
  PanelLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useEmailBuilder } from "@/contexts/email-builder-context"
import { EmailCanvasImproved } from "@/components/email-builder/email-canvas-improved"
import { BlockEditor } from "@/components/email-builder/block-editor"
import { ContentPanel } from "@/components/email-builder/content-panel"
import { SettingsPanel } from "@/components/email-builder/settings-panel"
import { ProductCatalog } from "@/components/email-builder/product-catalog"
import { PreBuildBriefing } from "@/components/email-builder/pre-build-briefing"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EditorPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const {
    templates,
    currentTemplate,
    setCurrentTemplate,
    selectedBlockId,
    emailProducts,
    removeEmailProduct,
    updateTemplate,
  } = useEmailBuilder()

  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [productCatalogOpen, setProductCatalogOpen] = useState(false)
  const [showBriefing, setShowBriefing] = useState(false)
  const [leftPanelTab, setLeftPanelTab] = useState<"blocks" | "settings">("blocks")
  const [rightPanelOpen, setRightPanelOpen] = useState(true)

  useEffect(() => {
    if (id && typeof id === "string") {
      // Find the template in the templates array
      const template = templates.find((t) => t.id === id)

      if (template) {
        setCurrentTemplate(id)
      } else {
        // If template doesn't exist, show briefing
        setShowBriefing(true)
      }
    }
  }, [id, templates, setCurrentTemplate])

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

  const handleBriefingComplete = (templateId: string) => {
    setShowBriefing(false)
    setCurrentTemplate(templateId)
  }

  if (showBriefing) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <PreBuildBriefing onComplete={handleBriefingComplete} />
      </div>
    )
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
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 border-r bg-white overflow-y-auto">
          <Tabs defaultValue="blocks" onValueChange={(value) => setLeftPanelTab(value as any)}>
            <TabsList className="w-full">
              <TabsTrigger value="blocks" className="flex-1">
                <Layers className="mr-2 h-4 w-4" />
                Blocks
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="blocks">
              <ContentPanel />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsPanel />
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <EmailCanvasImproved />
        </div>

        {/* Right Sidebar */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-10 top-4 z-10 bg-white border rounded-full shadow-sm"
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
          >
            <PanelLeft className={`h-4 w-4 transition-transform ${rightPanelOpen ? "" : "rotate-180"}`} />
          </Button>

          <div
            className={`w-80 border-l bg-white overflow-y-auto transition-all duration-300 ease-in-out ${
              rightPanelOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ height: "calc(100vh - 73px)" }}
          >
            {selectedBlockId ? (
              <BlockEditor />
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>Select a block to edit its properties</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Catalog Dialog */}
      <ProductCatalog
        open={productCatalogOpen}
        onOpenChange={setProductCatalogOpen}
        products={emailProducts}
        onRemoveProduct={removeEmailProduct}
      />
    </div>
  )
}
