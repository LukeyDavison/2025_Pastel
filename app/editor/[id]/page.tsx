"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useEmailBuilder } from "@/contexts/email-builder-context"
import {
  ArrowLeft,
  ComputerIcon as Desktop,
  SmartphoneIcon as Mobile,
  Save,
  Settings,
  LayoutGrid,
  Download,
  Copy,
  ShoppingBag,
  Edit,
  Check,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmailCanvas } from "@/components/email-builder/email-canvas"
import { ContentPanel } from "@/components/email-builder/content-panel"
import { SettingsPanel } from "@/components/email-builder/settings-panel"
import { BlockEditor } from "@/components/email-builder/block-editor"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ProductCatalog } from "@/components/email-builder/product-catalog"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function EditorPage() {
  const params = useParams()
  const { id } = params
  const router = useRouter()

  const {
    templates,
    currentTemplate,
    setCurrentTemplate,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    selectedBlockId,
    exportHTML,
    getZipPackage,
    emailProducts,
    removeEmailProduct,
    updateTemplateName,
    updateTemplateSubject,
    updateTemplatePreheader,
    saveTemplate,
  } = useEmailBuilder()

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [productCatalogOpen, setProductCatalogOpen] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [editingSubject, setEditingSubject] = useState(false)
  const [editingPreheader, setEditingPreheader] = useState(false)
  const [tempName, setTempName] = useState("")
  const [tempSubject, setTempSubject] = useState("")
  const [tempPreheader, setTempPreheader] = useState("")

  useEffect(() => {
    if (id && typeof id === "string") {
      const template = templates.find((t) => t.id === id)
      if (template) {
        setCurrentTemplate(id)
      } else {
        // Template not found, redirect to dashboard
        router.push("/")
      }
    }
  }, [id, templates, setCurrentTemplate, router])

  useEffect(() => {
    if (currentTemplate) {
      setTempName(currentTemplate.name)
      setTempSubject(currentTemplate.subject || "")
      setTempPreheader(currentTemplate.preheader || "")
    }
  }, [currentTemplate])

  const handleSave = () => {
    setIsSaving(true)
    saveTemplate()

    // Show success message
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)

      // Show toast notification
      toast({
        title: "Email saved",
        description: "Your email has been saved successfully",
        duration: 3000,
      })

      // Reset success icon after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 2000)
    }, 1000)
  }

  const handleExportHTML = async () => {
    const html = exportHTML()
    await navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadZip = async () => {
    try {
      const zipBlob = await getZipPackage()
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `email-template-${currentTemplate?.id}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Download started",
        description: "Your email template package is downloading",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error downloading ZIP:", error)
      toast({
        title: "Download failed",
        description: "There was an error creating the ZIP file. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handleNameSave = () => {
    updateTemplateName(tempName)
    setEditingName(false)
  }

  const handleSubjectSave = () => {
    updateTemplateSubject(tempSubject)
    setEditingSubject(false)
  }

  const handlePreheaderSave = () => {
    updateTemplatePreheader(tempPreheader)
    setEditingPreheader(false)
  }

  if (!currentTemplate) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="flex flex-col h-screen">
      <Toaster />
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>

            {editingName ? (
              <div className="ml-4 flex items-center">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-64 mr-2"
                  placeholder="Email name"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                />
                <Button size="sm" variant="ghost" onClick={handleNameSave}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="ml-4 flex items-center">
                <h1 className="text-lg font-medium">{currentTemplate.name}</h1>
                <Button size="sm" variant="ghost" onClick={() => setEditingName(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
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

            <Button size="sm" onClick={() => setExportDialogOpen(true)}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-2 border-t">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <span className="w-24 text-sm font-medium">Subject:</span>
              {editingSubject ? (
                <div className="flex-1 flex items-center">
                  <Input
                    value={tempSubject}
                    onChange={(e) => setTempSubject(e.target.value)}
                    className="flex-1 mr-2"
                    placeholder="Email subject line"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSubjectSave()}
                  />
                  <Button size="sm" variant="ghost" onClick={handleSubjectSave}>
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex items-center">
                  <span className="text-sm">{currentTemplate.subject || "No subject"}</span>
                  <Button size="sm" variant="ghost" onClick={() => setEditingSubject(true)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <span className="w-24 text-sm font-medium">Pre-header:</span>
              {editingPreheader ? (
                <div className="flex-1 flex items-center">
                  <Input
                    value={tempPreheader}
                    onChange={(e) => setTempPreheader(e.target.value)}
                    className="flex-1 mr-2"
                    placeholder="Email pre-header text"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handlePreheaderSave()}
                  />
                  <Button size="sm" variant="ghost" onClick={handlePreheaderSave}>
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex items-center">
                  <span className="text-sm">{currentTemplate.preheader || "No pre-header"}</span>
                  <Button size="sm" variant="ghost" onClick={() => setEditingPreheader(true)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r bg-white">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="w-full">
              <TabsTrigger value="content" className="flex-1">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="p-0 border-0">
              <ContentPanel />
            </TabsContent>

            <TabsContent value="settings" className="p-0 border-0">
              <SettingsPanel />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100">
          <EmailCanvas />
        </div>

        <div className="w-80 border-l bg-white overflow-auto">
          {selectedBlockId && <BlockEditor />}
          {!selectedBlockId && (
            <div className="p-4 text-center text-gray-500">
              <p>Select a block to edit its properties</p>
            </div>
          )}
        </div>
      </div>

      <ProductCatalog
        open={productCatalogOpen}
        onOpenChange={setProductCatalogOpen}
        products={emailProducts}
        onRemoveProduct={(productId) => removeEmailProduct(productId)}
      />

      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select an export option</DialogTitle>
            <DialogDescription>Choose how you want to export your email template</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Button variant="outline" className="justify-start h-auto py-4 px-4" onClick={handleDownloadZip}>
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-md mr-4">
                  <Download className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Get HTML & Images</h3>
                  <p className="text-sm text-gray-500">Download a zip file that includes both HTML and images.</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto py-4 px-4" onClick={handleExportHTML}>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-md mr-4">
                  <Copy className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Copy the HTML</h3>
                  <p className="text-sm text-gray-500">Get the code and leave the images online.</p>
                  {copied && <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>}
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
