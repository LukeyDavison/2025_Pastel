"use client"

import { useState, useEffect } from "react"
import { X, Save, Trash2, Edit, Check, Package, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

// Types
interface Bundle {
  id: string
  name: string
  description?: string
  products: any[]
  createdAt: number
  updatedAt: number
}

interface BundleManagerProps {
  isOpen: boolean
  onClose: () => void
  selectedProducts: any[]
  onLoadBundle: (products: any[]) => void
}

// Local storage key
const BUNDLES_STORAGE_KEY = "lkb_product_bundles"

export function BundleManager({ isOpen, onClose, selectedProducts, onLoadBundle }: BundleManagerProps) {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [newBundleName, setNewBundleName] = useState("")
  const [newBundleDescription, setNewBundleDescription] = useState("")
  const [editingBundle, setEditingBundle] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [saveError, setSaveError] = useState<string | null>(null)

  // Load bundles from local storage
  useEffect(() => {
    try {
      const storedBundles = localStorage.getItem(BUNDLES_STORAGE_KEY)
      if (storedBundles) {
        setBundles(JSON.parse(storedBundles))
      }
    } catch (error) {
      console.error("Failed to load bundles:", error)
    }
  }, [isOpen]) // Reload when dialog opens

  // Save bundles to local storage
  const saveBundles = (updatedBundles: Bundle[]) => {
    try {
      localStorage.setItem(BUNDLES_STORAGE_KEY, JSON.stringify(updatedBundles))
      setBundles(updatedBundles)
      return true
    } catch (error) {
      console.error("Failed to save bundles:", error)
      setSaveError("Failed to save bundles. Storage might be full.")
      return false
    }
  }

  // Create a new bundle
  const handleCreateBundle = () => {
    if (!newBundleName.trim()) {
      setSaveError("Bundle name is required")
      return
    }

    if (selectedProducts.length === 0) {
      setSaveError("No products selected to save")
      return
    }

    const newBundle: Bundle = {
      id: `bundle_${Date.now()}`,
      name: newBundleName.trim(),
      description: newBundleDescription.trim() || undefined,
      products: selectedProducts,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const success = saveBundles([...bundles, newBundle])
    if (success) {
      setNewBundleName("")
      setNewBundleDescription("")
      setSaveError(null)
    }
  }

  // Delete a bundle
  const handleDeleteBundle = (id: string) => {
    if (confirm("Are you sure you want to delete this bundle?")) {
      const updatedBundles = bundles.filter((bundle) => bundle.id !== id)
      saveBundles(updatedBundles)
    }
  }

  // Start editing a bundle
  const handleStartEdit = (bundle: Bundle) => {
    setEditingBundle(bundle.id)
    setEditName(bundle.name)
    setEditDescription(bundle.description || "")
  }

  // Save bundle edits
  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) {
      setSaveError("Bundle name is required")
      return
    }

    const updatedBundles = bundles.map((bundle) =>
      bundle.id === id
        ? {
            ...bundle,
            name: editName.trim(),
            description: editDescription.trim() || undefined,
            updatedAt: Date.now(),
          }
        : bundle,
    )

    const success = saveBundles(updatedBundles)
    if (success) {
      setEditingBundle(null)
      setSaveError(null)
    }
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingBundle(null)
    setSaveError(null)
  }

  // Load a bundle
  const handleLoadBundle = (bundle: Bundle) => {
    onLoadBundle(bundle.products)
    onClose()
  }

  // Update a bundle with current products
  const handleUpdateBundle = (id: string) => {
    if (selectedProducts.length === 0) {
      setSaveError("No products selected to save")
      return
    }

    const updatedBundles = bundles.map((bundle) =>
      bundle.id === id
        ? {
            ...bundle,
            products: selectedProducts,
            updatedAt: Date.now(),
          }
        : bundle,
    )

    const success = saveBundles(updatedBundles)
    if (success) {
      setSaveError(null)
      alert(`Bundle "${bundles.find((b) => b.id === id)?.name}" updated with ${selectedProducts.length} products`)
    }
  }

  // If the dialog is not open, don't render anything
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/80 border border-white/20 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Product Bundles
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Create new bundle form */}
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <h3 className="text-white font-medium mb-2">Create New Bundle</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="bundleName" className="block text-white/70 text-sm mb-1">
                  Bundle Name
                </label>
                <input
                  id="bundleName"
                  type="text"
                  value={newBundleName}
                  onChange={(e) => setNewBundleName(e.target.value)}
                  placeholder="Enter bundle name"
                  className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <label htmlFor="bundleDescription" className="block text-white/70 text-sm mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="bundleDescription"
                  value={newBundleDescription}
                  onChange={(e) => setNewBundleDescription(e.target.value)}
                  placeholder="Enter description"
                  rows={2}
                  className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white placeholder:text-white/50"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-white/70 text-sm">{selectedProducts.length} products selected</div>
                <Button
                  onClick={handleCreateBundle}
                  disabled={!newBundleName.trim() || selectedProducts.length === 0}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Bundle
                </Button>
              </div>
            </div>
          </div>

          {/* Error message */}
          {saveError && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-2 rounded-md mb-4 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>{saveError}</div>
            </div>
          )}

          {/* Existing bundles */}
          <h3 className="text-white font-medium mb-3">Your Bundles</h3>
          {bundles.length === 0 ? (
            <div className="text-white/70 text-center py-8">No bundles saved yet. Create your first bundle above.</div>
          ) : (
            <div className="space-y-3">
              {bundles.map((bundle) => (
                <div key={bundle.id} className="bg-white/10 rounded-lg p-4">
                  {editingBundle === bundle.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div>
                        <label className="block text-white/70 text-sm mb-1">Bundle Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-1">Description</label>
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={2}
                          className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                        <Button
                          variant="cta"
                          size="sm"
                          onClick={() => handleSaveEdit(bundle.id)}
                          disabled={!editName.trim()}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">{bundle.name}</h4>
                          {bundle.description && <p className="text-white/70 text-sm mt-1">{bundle.description}</p>}
                          <div className="text-white/50 text-xs mt-2">
                            {bundle.products.length} products • Last updated{" "}
                            {new Date(bundle.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleStartEdit(bundle)}
                            className="p-1 text-white/70 hover:text-white"
                            title="Edit bundle"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBundle(bundle.id)}
                            className="p-1 text-white/70 hover:text-red-400"
                            title="Delete bundle"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {bundle.products.slice(0, 5).map((product, index) => (
                          <div
                            key={`${product.id}-${index}`}
                            className="w-10 h-10 rounded overflow-hidden border border-white/20"
                          >
                            <img
                              src={product.imageUrl || "/placeholder.svg?height=40&width=40&query=product"}
                              alt={product.name || "Product"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {bundle.products.length > 5 && (
                          <div className="w-10 h-10 rounded overflow-hidden border border-white/20 bg-black/50 flex items-center justify-center text-white text-xs">
                            +{bundle.products.length - 5}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleLoadBundle(bundle)}>
                          Load Bundle
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateBundle(bundle.id)}
                          disabled={selectedProducts.length === 0}
                        >
                          Update with Selected
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
