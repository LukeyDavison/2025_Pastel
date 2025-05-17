"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"
import type { ProductBundle, BundleStore } from "@/types/bundle"
import {
  initBundleStore,
  saveBundleStore,
  createBundle,
  updateBundle,
  addBundle,
  removeBundle,
  updateBundleInStore,
  formatBundleDate,
} from "@/utils/bundle-utils"
import { Trash2, Edit, Save, Plus, X, Package, Calendar } from "lucide-react"

interface BundleManagerProps {
  isOpen: boolean
  onClose: () => void
  selectedProducts: Array<Product & { imageUrl?: string }>
  onLoadBundle: (products: Array<Product & { imageUrl?: string }>) => void
}

export function BundleManager({ isOpen, onClose, selectedProducts, onLoadBundle }: BundleManagerProps) {
  const [bundleStore, setBundleStore] = useState<BundleStore>({ bundles: [], selectedBundleId: null })
  const [newBundleName, setNewBundleName] = useState("")
  const [newBundleDescription, setNewBundleDescription] = useState("")
  const [editingBundle, setEditingBundle] = useState<ProductBundle | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [activeTab, setActiveTab] = useState<"save" | "load">("load")

  // Load bundles from localStorage on mount
  useEffect(() => {
    setBundleStore(initBundleStore())
  }, [])

  // Save bundles to localStorage when they change
  useEffect(() => {
    if (bundleStore.bundles.length > 0) {
      saveBundleStore(bundleStore)
    }
  }, [bundleStore])

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setNewBundleName("")
      setNewBundleDescription("")
      setEditingBundle(null)
    }
  }, [isOpen])

  // Handle saving a new bundle
  const handleSaveBundle = () => {
    if (!newBundleName.trim() || selectedProducts.length === 0) return

    const newBundle = createBundle(newBundleName.trim(), selectedProducts, newBundleDescription.trim() || undefined)
    setBundleStore((prev) => addBundle(prev, newBundle))
    setNewBundleName("")
    setNewBundleDescription("")
    setActiveTab("load")
  }

  // Handle updating a bundle
  const handleUpdateBundle = () => {
    if (!editingBundle || !editName.trim()) return

    const updatedBundle = updateBundle(editingBundle, {
      name: editName.trim(),
      description: editDescription.trim() || undefined,
    })

    setBundleStore((prev) => updateBundleInStore(prev, updatedBundle))
    setEditingBundle(null)
  }

  // Handle deleting a bundle
  const handleDeleteBundle = (bundleId: string) => {
    if (confirm("Are you sure you want to delete this bundle?")) {
      setBundleStore((prev) => removeBundle(prev, bundleId))
    }
  }

  // Handle loading a bundle
  const handleLoadBundle = (bundle: ProductBundle) => {
    onLoadBundle(bundle.products)
    onClose()
  }

  // Start editing a bundle
  const startEditing = (bundle: ProductBundle) => {
    setEditingBundle(bundle)
    setEditName(bundle.name)
    setEditDescription(bundle.description || "")
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingBundle(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Product Bundles</DialogTitle>
        </DialogHeader>

        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "load" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("load")}
          >
            Load Bundle
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "save" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("save")}
          >
            Save Current Selection
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "save" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="bundle-name" className="block text-sm font-medium">
                  Bundle Name*
                </label>
                <input
                  id="bundle-name"
                  type="text"
                  value={newBundleName}
                  onChange={(e) => setNewBundleName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter a name for this bundle"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="bundle-description" className="block text-sm font-medium">
                  Description (Optional)
                </label>
                <textarea
                  id="bundle-description"
                  value={newBundleDescription}
                  onChange={(e) => setNewBundleDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter a description"
                  rows={3}
                />
              </div>

              <div className="bg-muted/20 p-3 rounded-md">
                <h3 className="font-medium mb-2">Selected Products ({selectedProducts.length})</h3>
                {selectedProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No products selected</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {selectedProducts.slice(0, 8).map((product) => (
                      <div key={product.id} className="bg-background rounded overflow-hidden border">
                        <div className="aspect-square relative">
                          <img
                            src={product.imageUrl || "/placeholder.svg?height=100&width=100&query=product"}
                            alt={product.titles?.default || product.name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-1 text-xs truncate">
                          {product.titles?.default || product.name || "Product"}
                        </div>
                      </div>
                    ))}
                    {selectedProducts.length > 8 && (
                      <div className="bg-background rounded overflow-hidden border flex items-center justify-center aspect-square">
                        <span className="text-sm">+{selectedProducts.length - 8} more</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button
                onClick={handleSaveBundle}
                disabled={!newBundleName.trim() || selectedProducts.length === 0}
                className="w-full"
                variant="cta"
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Bundle
              </Button>
            </div>
          )}

          {activeTab === "load" && (
            <div>
              {bundleStore.bundles.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg">No bundles saved yet</h3>
                  <p className="text-muted-foreground">
                    Select products and save them as a bundle to access them later
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab("save")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Bundle
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bundleStore.bundles.map((bundle) => (
                    <div
                      key={bundle.id}
                      className={`border rounded-md overflow-hidden ${
                        editingBundle?.id === bundle.id ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      {editingBundle?.id === bundle.id ? (
                        <div className="p-4 space-y-3">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Bundle name"
                          />
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Description (optional)"
                            rows={2}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={cancelEditing}>
                              Cancel
                            </Button>
                            <Button variant="cta" size="sm" onClick={handleUpdateBundle}>
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{bundle.name}</h3>
                                {bundle.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{bundle.description}</p>
                                )}
                                <div className="flex items-center text-xs text-muted-foreground mt-2">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {formatBundleDate(bundle.updatedAt)}
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditing(bundle)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteBundle(bundle.id)}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="px-4 pb-2">
                            <div className="flex items-center gap-1 overflow-x-auto pb-2">
                              {bundle.products.slice(0, 6).map((product) => (
                                <div key={product.id} className="flex-shrink-0 w-12 h-12 relative">
                                  <img
                                    src={product.imageUrl || "/placeholder.svg?height=50&width=50&query=product"}
                                    alt={product.titles?.default || product.name || "Product"}
                                    className="w-full h-full object-cover rounded border"
                                  />
                                </div>
                              ))}
                              {bundle.products.length > 6 && (
                                <div className="flex-shrink-0 w-12 h-12 bg-muted/20 rounded border flex items-center justify-center">
                                  <span className="text-xs">+{bundle.products.length - 6}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="px-4 pb-4">
                            <Button variant="cta" size="sm" className="w-full" onClick={() => handleLoadBundle(bundle)}>
                              Load {bundle.products.length} Products
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
