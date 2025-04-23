"use client"

import { useEmailBuilder } from "@/contexts/email-builder-context"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Trash, Copy, ChevronUp, ChevronDown, Plus, Minus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { ProductSearchDialog } from "./product-search-dialog"
import type { Product } from "@/types/product"

export function BlockEditor() {
  const { currentTemplate, selectedBlockId, updateBlock, deleteBlock, duplicateBlock, moveBlock } = useEmailBuilder()
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)

  if (!currentTemplate || !selectedBlockId) return null

  // Find the selected block
  const selectedBlock = currentTemplate.blocks.find((block) => block.id === selectedBlockId)

  if (!selectedBlock) return null

  const handleContentChange = (content: any) => {
    updateBlock(selectedBlockId, content)
  }

  const handleStyleChange = (styles: Record<string, any>) => {
    updateBlock(selectedBlockId, selectedBlock?.content, styles)
  }

  const handleAddProduct = (product: Product) => {
    if (selectedBlock.type === "product") {
      const updatedProducts = [...(selectedBlock.content.products || []), product]
      updateBlock(selectedBlockId, {
        ...selectedBlock.content,
        products: updatedProducts,
      })
    }
  }

  const handleRemoveProduct = (index: number) => {
    if (selectedBlock.type === "product") {
      const updatedProducts = [...selectedBlock.content.products]
      updatedProducts.splice(index, 1)
      updateBlock(selectedBlockId, {
        ...selectedBlock.content,
        products: updatedProducts,
      })
    }
  }

  const handleColumnsChange = (increment: number, type: "product" | "image") => {
    if (type === "product" && selectedBlock.type === "product") {
      const newColumns = Math.max(1, Math.min(3, selectedBlock.content.columns + increment))
      updateBlock(selectedBlockId, {
        ...selectedBlock.content,
        columns: newColumns,
      })
    } else if (type === "image" && selectedBlock.type === "image") {
      const newColumns = Math.max(1, Math.min(3, (selectedBlock.content.columns || 1) + increment))

      // Update images array if needed
      let images = selectedBlock.content.images || [{ src: selectedBlock.content.src, alt: selectedBlock.content.alt }]

      if (newColumns > images.length) {
        // Add placeholder images if needed
        while (images.length < newColumns) {
          images.push({ src: "/placeholder.svg?height=200&width=400", alt: "Image description" })
        }
      } else if (newColumns < images.length) {
        // Remove excess images
        images = images.slice(0, newColumns)
      }

      updateBlock(selectedBlockId, {
        ...selectedBlock.content,
        columns: newColumns,
        images,
      })
    }
  }

  const handleToggleSetting = (setting: "showName" | "showPrice" | "showSwatch") => {
    if (selectedBlock.type === "product") {
      updateBlock(selectedBlockId, {
        ...selectedBlock.content,
        [setting]: !selectedBlock.content[setting],
      })
    }
  }

  const handleMoveProductImage = (index: number, direction: "up" | "down") => {
    if (selectedBlock.type === "product") {
      const products = [...selectedBlock.content.products]
      if (direction === "up" && index > 0) {
        ;[products[index], products[index - 1]] = [products[index - 1], products[index]]
      } else if (direction === "down" && index < products.length - 1) {
        ;[products[index], products[index + 1]] = [products[index + 1], products[index]]
      }

      updateBlock(selectedBlockId, {
        ...selectedBlock.content,
        products,
      })
    } else if (selectedBlock.type === "image" && selectedBlock.content.images) {
      const images = [...selectedBlock.content.images]
      if (direction === "up" && index > 0) {
        ;[images[index], images[index - 1]] = [images[index - 1], images[index]]
      } else if (direction === "down" && index < images.length - 1) {
        ;[images[index], images[index + 1]] = [images[index + 1], images[index]]
      }

      updateBlock(selectedBlockId, {
        ...selectedBlock.content,
        images,
      })
    }
  }

  const handleUpdateImage = (index: number, field: "src" | "alt", value: string) => {
    if (selectedBlock.type === "image" && selectedBlock.content.images) {
      const images = [...selectedBlock.content.images]
      images[index] = { ...images[index], [field]: value }

      updateBlock(selectedBlockId, {
        ...selectedBlock.content,
        images,
      })
    }
  }

  // Function to handle font size increment/decrement
  const handleFontSizeChange = (increment: number) => {
    if (!selectedBlock.styles.fontSize) return

    // Extract the numeric part and unit
    const match = selectedBlock.styles.fontSize.match(/^(\d+)(.*)$/)
    if (!match) return

    const currentSize = Number.parseInt(match[1], 10)
    const unit = match[2] || "px"

    // Calculate new size (min 8, max 72)
    const newSize = Math.max(8, Math.min(72, currentSize + increment))

    handleStyleChange({ fontSize: `${newSize}${unit}` })
  }

  const renderBlockEditor = () => {
    switch (selectedBlock?.type) {
      case "title":
        return (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Title Text</Label>
              <Textarea value={selectedBlock.content} onChange={(e) => handleContentChange(e.target.value)} rows={3} />
            </div>

            <div>
              <Label className="mb-2 block">Font Family</Label>
              <Select
                value={selectedBlock.styles.fontFamily}
                onValueChange={(value) => handleStyleChange({ fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                  <SelectItem value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</SelectItem>
                  <SelectItem value="'Times New Roman', Times, serif">Times New Roman</SelectItem>
                  <SelectItem value="Georgia, serif">Georgia</SelectItem>
                  <SelectItem value="'Courier New', Courier, monospace">Courier New</SelectItem>
                  <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Font Weight</Label>
              <Select
                value={selectedBlock.styles.fontWeight}
                onValueChange={(value) => handleStyleChange({ fontWeight: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="bolder">Bolder</SelectItem>
                  <SelectItem value="lighter">Lighter</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                  <SelectItem value="300">300</SelectItem>
                  <SelectItem value="400">400</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                  <SelectItem value="600">600</SelectItem>
                  <SelectItem value="700">700</SelectItem>
                  <SelectItem value="800">800</SelectItem>
                  <SelectItem value="900">900</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Font Size</Label>
              <div className="flex items-center">
                <Button variant="outline" size="icon" onClick={() => handleFontSizeChange(-1)} className="mr-2">
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center font-mono">{selectedBlock.styles.fontSize}</div>
                <Button variant="outline" size="icon" onClick={() => handleFontSizeChange(1)} className="ml-2">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Text Color</Label>
              <div className="flex">
                <Input
                  type="color"
                  value={selectedBlock.styles.color}
                  onChange={(e) => handleStyleChange({ color: e.target.value })}
                  className="w-12 h-10 p-1 mr-2"
                />
                <Input
                  type="text"
                  value={selectedBlock.styles.color}
                  onChange={(e) => handleStyleChange({ color: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Text Align</Label>
              <Select
                value={selectedBlock.styles.textAlign}
                onValueChange={(value) => handleStyleChange({ textAlign: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Padding</Label>
              <Input
                type="text"
                value={selectedBlock.styles.padding}
                onChange={(e) => handleStyleChange({ padding: e.target.value })}
              />
            </div>
          </div>
        )

      case "paragraph":
        return (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Paragraph Text</Label>
              <Textarea value={selectedBlock.content} onChange={(e) => handleContentChange(e.target.value)} rows={6} />
            </div>

            <div>
              <Label className="mb-2 block">Font Family</Label>
              <Select
                value={selectedBlock.styles.fontFamily}
                onValueChange={(value) => handleStyleChange({ fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                  <SelectItem value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</SelectItem>
                  <SelectItem value="'Times New Roman', Times, serif">Times New Roman</SelectItem>
                  <SelectItem value="Georgia, serif">Georgia</SelectItem>
                  <SelectItem value="'Courier New', Courier, monospace">Courier New</SelectItem>
                  <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Font Size</Label>
              <div className="flex items-center">
                <Button variant="outline" size="icon" onClick={() => handleFontSizeChange(-1)} className="mr-2">
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center font-mono">{selectedBlock.styles.fontSize}</div>
                <Button variant="outline" size="icon" onClick={() => handleFontSizeChange(1)} className="ml-2">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Text Color</Label>
              <div className="flex">
                <Input
                  type="color"
                  value={selectedBlock.styles.color}
                  onChange={(e) => handleStyleChange({ color: e.target.value })}
                  className="w-12 h-10 p-1 mr-2"
                />
                <Input
                  type="text"
                  value={selectedBlock.styles.color}
                  onChange={(e) => handleStyleChange({ color: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Text Align</Label>
              <Select
                value={selectedBlock.styles.textAlign}
                onValueChange={(value) => handleStyleChange({ textAlign: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Line Height</Label>
              <Input
                type="text"
                value={selectedBlock.styles.lineHeight}
                onChange={(e) => handleStyleChange({ lineHeight: e.target.value })}
              />
            </div>

            <div>
              <Label className="mb-2 block">Padding</Label>
              <Input
                type="text"
                value={selectedBlock.styles.padding}
                onChange={(e) => handleStyleChange({ padding: e.target.value })}
              />
            </div>
          </div>
        )

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Image Columns</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleColumnsChange(-1, "image")}
                  disabled={selectedBlock.content.columns <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{selectedBlock.content.columns || 1}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleColumnsChange(1, "image")}
                  disabled={(selectedBlock.content.columns || 1) >= 3}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {selectedBlock.content.columns > 1 && selectedBlock.content.images ? (
              <div className="space-y-4">
                {selectedBlock.content.images.map((image, index) => (
                  <div key={index} className="border p-3 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Image {index + 1}</h4>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveProductImage(index, "up")}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveProductImage(index, "down")}
                          disabled={index === selectedBlock.content.images.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <Label className="mb-1 block text-sm">Image URL</Label>
                        <Input
                          type="text"
                          value={image.src}
                          onChange={(e) => handleUpdateImage(index, "src", e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="mb-1 block text-sm">Alt Text</Label>
                        <Input
                          type="text"
                          value={image.alt}
                          onChange={(e) => handleUpdateImage(index, "alt", e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div>
                  <Label className="mb-2 block">Image URL</Label>
                  <Input
                    type="text"
                    value={selectedBlock.content.src}
                    onChange={(e) => handleContentChange({ ...selectedBlock.content, src: e.target.value })}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Alt Text</Label>
                  <Input
                    type="text"
                    value={selectedBlock.content.alt}
                    onChange={(e) => handleContentChange({ ...selectedBlock.content, alt: e.target.value })}
                  />
                </div>
              </>
            )}

            <div>
              <Label className="mb-2 block">Width</Label>
              <Input
                type="text"
                value={selectedBlock.styles.width}
                onChange={(e) => handleStyleChange({ width: e.target.value })}
              />
            </div>

            <div>
              <Label className="mb-2 block">Alignment</Label>
              <Select value={selectedBlock.styles.align} onValueChange={(value) => handleStyleChange({ align: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Border Radius</Label>
              <Input
                type="text"
                value={selectedBlock.styles.borderRadius}
                onChange={(e) => handleStyleChange({ borderRadius: e.target.value })}
              />
            </div>
          </div>
        )

      case "button":
        return (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Button Text</Label>
              <Input
                type="text"
                value={selectedBlock.content.text}
                onChange={(e) => handleContentChange({ ...selectedBlock.content, text: e.target.value })}
              />
            </div>

            <div>
              <Label className="mb-2 block">URL</Label>
              <Input
                type="text"
                value={selectedBlock.content.url}
                onChange={(e) => handleContentChange({ ...selectedBlock.content, url: e.target.value })}
              />
            </div>

            <div>
              <Label className="mb-2 block">Background Color</Label>
              <div className="flex">
                <Input
                  type="color"
                  value={selectedBlock.styles.backgroundColor}
                  onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
                  className="w-12 h-10 p-1 mr-2"
                />
                <Input
                  type="text"
                  value={selectedBlock.styles.backgroundColor}
                  onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Text Color</Label>
              <div className="flex">
                <Input
                  type="color"
                  value={selectedBlock.styles.color}
                  onChange={(e) => handleStyleChange({ color: e.target.value })}
                  className="w-12 h-10 p-1 mr-2"
                />
                <Input
                  type="text"
                  value={selectedBlock.styles.color}
                  onChange={(e) => handleStyleChange({ color: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Border Radius</Label>
              <Input
                type="text"
                value={selectedBlock.styles.borderRadius}
                onChange={(e) => handleStyleChange({ borderRadius: e.target.value })}
              />
            </div>

            <div>
              <Label className="mb-2 block">Padding</Label>
              <Input
                type="text"
                value={selectedBlock.styles.padding}
                onChange={(e) => handleStyleChange({ padding: e.target.value })}
              />
            </div>

            <div>
              <Label className="mb-2 block">Text Align</Label>
              <Select
                value={selectedBlock.styles.textAlign || "center"}
                onValueChange={(value) => handleStyleChange({ textAlign: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "divider":
        return (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Color</Label>
              <div className="flex">
                <Input
                  type="color"
                  value={selectedBlock.styles.color}
                  onChange={(e) => handleStyleChange({ color: e.target.value })}
                  className="w-12 h-10 p-1 mr-2"
                />
                <Input
                  type="text"
                  value={selectedBlock.styles.color}
                  onChange={(e) => handleStyleChange({ color: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Height</Label>
              <div className="flex items-center">
                <Input
                  type="text"
                  value={selectedBlock.styles.height}
                  onChange={(e) => handleStyleChange({ height: e.target.value })}
                  className="flex-1 mr-2"
                />
                <span className="text-sm">px</span>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Padding</Label>
              <Input
                type="text"
                value={selectedBlock.styles.padding}
                onChange={(e) => handleStyleChange({ padding: e.target.value })}
              />
            </div>
          </div>
        )

      case "spacer":
        return (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Height</Label>
              <div className="flex items-center">
                <Slider
                  defaultValue={[Number.parseInt(selectedBlock.styles.height)]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleStyleChange({ height: `${value[0]}px` })}
                  className="flex-1 mr-4"
                />
                <span className="text-sm">{selectedBlock.styles.height}</span>
              </div>
            </div>
          </div>
        )

      case "social":
        return (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Networks</Label>
              {selectedBlock.content.networks.map((network: any, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    type="text"
                    value={network.name}
                    onChange={(e) => {
                      const networks = [...selectedBlock.content.networks]
                      networks[index].name = e.target.value
                      handleContentChange({ ...selectedBlock.content, networks })
                    }}
                    className="flex-1 mr-2"
                    placeholder="Network name"
                  />
                  <Input
                    type="text"
                    value={network.url}
                    onChange={(e) => {
                      const networks = [...selectedBlock.content.networks]
                      networks[index].url = e.target.value
                      handleContentChange({ ...selectedBlock.content, networks })
                    }}
                    className="flex-1"
                    placeholder="URL"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const networks = [...selectedBlock.content.networks]
                      networks.splice(index, 1)
                      handleContentChange({ ...selectedBlock.content, networks })
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const networks = [...selectedBlock.content.networks, { name: "", url: "" }]
                  handleContentChange({ ...selectedBlock.content, networks })
                }}
              >
                Add Network
              </Button>
            </div>

            <div>
              <Label className="mb-2 block">Icon Size</Label>
              <Input
                type="text"
                value={selectedBlock.styles.iconSize}
                onChange={(e) => handleStyleChange({ iconSize: e.target.value })}
              />
            </div>

            <div>
              <Label className="mb-2 block">Icon Spacing</Label>
              <Input
                type="text"
                value={selectedBlock.styles.iconSpacing}
                onChange={(e) => handleStyleChange({ iconSpacing: e.target.value })}
              />
            </div>

            <div>
              <Label className="mb-2 block">Alignment</Label>
              <Select value={selectedBlock.styles.align} onValueChange={(value) => handleStyleChange({ align: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "html":
        return (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">HTML Code</Label>
              <Textarea
                value={selectedBlock.content.code}
                onChange={(e) => handleContentChange({ code: e.target.value })}
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <div>
              <Label className="mb-2 block">Padding</Label>
              <Input
                type="text"
                value={selectedBlock.styles.padding}
                onChange={(e) => handleStyleChange({ padding: e.target.value })}
              />
            </div>
          </div>
        )

      case "product":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Product Columns</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleColumnsChange(-1, "product")}
                  disabled={selectedBlock.content.columns <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{selectedBlock.content.columns}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleColumnsChange(1, "product")}
                  disabled={selectedBlock.content.columns >= 3}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showName"
                  checked={selectedBlock.content.showName}
                  onChange={() => handleToggleSetting("showName")}
                  className="mr-2"
                />
                <label htmlFor="showName">Show product name</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showPrice"
                  checked={selectedBlock.content.showPrice}
                  onChange={() => handleToggleSetting("showPrice")}
                  className="mr-2"
                />
                <label htmlFor="showPrice">Show product price</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showSwatch"
                  checked={selectedBlock.content.showSwatch}
                  onChange={() => handleToggleSetting("showSwatch")}
                  className="mr-2"
                />
                <label htmlFor="showSwatch">Show color swatches</label>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Products</h3>
              {selectedBlock.content.products.length === 0 ? (
                <p className="text-gray-500 text-sm mb-2">No products added yet</p>
              ) : (
                <div className="space-y-2 mb-4">
                  {selectedBlock.content.products.map((product: Product, index: number) => (
                    <div key={index} className="flex items-center border rounded-md p-2">
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveProductImage(index, "up")}
                          disabled={index === 0}
                          className="h-6 w-6 mr-1"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveProductImage(index, "down")}
                          disabled={index === selectedBlock.content.products.length - 1}
                          className="h-6 w-6"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                      <img
                        src={
                          product.selectedImage || product.media?.default?.src || product.imageUrl || "/placeholder.svg"
                        }
                        alt={product.titles?.default || product.name || "Product"}
                        className="w-12 h-12 object-cover mr-2"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {product.titles?.default || product.name || "Untitled Product"}
                        </p>
                        <p className="text-xs text-gray-500">£{product.pricing.price.toFixed(2)}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveProduct(index)} className="ml-2">
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={() => setSearchDialogOpen(true)} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Edit {selectedBlock.type}</h3>

        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => moveBlock(selectedBlockId, "up")}>
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => moveBlock(selectedBlockId, "down")}>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => duplicateBlock(selectedBlockId)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteBlock(selectedBlockId)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="w-full">
          <TabsTrigger value="content" className="flex-1">
            Content
          </TabsTrigger>
          <TabsTrigger value="style" className="flex-1">
            Style
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {renderBlockEditor()}
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          {/* Style options would go here */}
        </TabsContent>
      </Tabs>

      <ProductSearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} onAddProduct={handleAddProduct} />
    </div>
  )
}
