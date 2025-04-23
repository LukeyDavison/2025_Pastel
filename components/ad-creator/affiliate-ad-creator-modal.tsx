"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AffiliateAdCreatorModalProps {
  onClose: () => void
}

export function AffiliateAdCreatorModal({ onClose }: AffiliateAdCreatorModalProps) {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simplified image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target?.result) {
          setBackgroundImage(event.target.result as string)
        }
      }

      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold text-white">Affiliate Ad Creator</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 h-[calc(90vh-80px)]">
          {/* Left panel - Controls */}
          <div className="p-6 border-r border-white/20 overflow-y-auto">
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Background Image</h3>
                <div
                  className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {backgroundImage ? (
                    <div className="relative">
                      <img
                        src={backgroundImage || "/placeholder.svg"}
                        alt="Background"
                        className="max-h-[100px] mx-auto"
                      />
                      <button
                        className="absolute top-0 right-0 bg-black/50 rounded-full p-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          setBackgroundImage(null)
                        }}
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="h-8 w-8 text-white/70 mb-2" />
                      <p className="text-white text-sm mb-1">Upload image</p>
                      <p className="text-white/50 text-xs">Supports JPG, PNG</p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Export Buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full p-3 bg-white text-black font-medium rounded-lg flex items-center justify-center"
                  onClick={onClose}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Right panel - Preview */}
          <div className="col-span-3 p-6 overflow-auto bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg overflow-hidden" style={{ width: 300, height: 250 }}>
              {backgroundImage ? (
                <img src={backgroundImage || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/50">
                  Upload an image to preview
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
