"use client"

import type React from "react"

import { useEmailBuilder } from "@/contexts/email-builder-context"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SettingsPanel() {
  const { currentTemplate, updateTemplateSettings } = useEmailBuilder()

  if (!currentTemplate) return null

  const handleWidthChange = (value: number[]) => {
    updateTemplateSettings({ width: value[0] })
  }

  const handleAlignmentChange = (value: string) => {
    updateTemplateSettings({ alignment: value as "left" | "center" })
  }

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTemplateSettings({ backgroundColor: e.target.value })
  }

  const handleContentBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTemplateSettings({ contentBackgroundColor: e.target.value })
  }

  const handleFontChange = (value: string) => {
    updateTemplateSettings({ defaultFont: value })
  }

  const handleLinkColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTemplateSettings({ linkColor: e.target.value })
  }

  const handleLanguageChange = (value: string) => {
    updateTemplateSettings({ language: value })
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="font-medium mb-4">General Options</h3>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Content area width</Label>
            <div className="flex items-center">
              <Slider
                defaultValue={[currentTemplate.settings.width]}
                min={320}
                max={800}
                step={10}
                onValueChange={handleWidthChange}
                className="flex-1 mr-4"
              />
              <span className="text-sm">{currentTemplate.settings.width}px</span>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Content area alignment</Label>
            <RadioGroup
              defaultValue={currentTemplate.settings.alignment}
              onValueChange={handleAlignmentChange}
              className="flex"
            >
              <div className="flex items-center space-x-2 mr-4">
                <RadioGroupItem value="left" id="left" />
                <Label htmlFor="left">Left</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="center" id="center" />
                <Label htmlFor="center">Center</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-2 block">Background color</Label>
            <div className="flex">
              <Input
                type="color"
                value={currentTemplate.settings.backgroundColor}
                onChange={handleBackgroundColorChange}
                className="w-12 h-10 p-1 mr-2"
              />
              <Input
                type="text"
                value={currentTemplate.settings.backgroundColor}
                onChange={handleBackgroundColorChange}
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Content area background color</Label>
            <div className="flex">
              <Input
                type="color"
                value={
                  currentTemplate.settings.contentBackgroundColor === "transparent"
                    ? "#ffffff"
                    : currentTemplate.settings.contentBackgroundColor
                }
                onChange={handleContentBackgroundColorChange}
                className="w-12 h-10 p-1 mr-2"
              />
              <Input
                type="text"
                value={currentTemplate.settings.contentBackgroundColor}
                onChange={handleContentBackgroundColorChange}
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Default font</Label>
            <Select defaultValue={currentTemplate.settings.defaultFont} onValueChange={handleFontChange}>
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
            <Label className="mb-2 block">Link color</Label>
            <div className="flex">
              <Input
                type="color"
                value={currentTemplate.settings.linkColor}
                onChange={handleLinkColorChange}
                className="w-12 h-10 p-1 mr-2"
              />
              <Input type="text" value={currentTemplate.settings.linkColor} onChange={handleLinkColorChange} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Optional Properties</h3>

        <div>
          <Label className="mb-2 block">Language</Label>
          <Select defaultValue={currentTemplate.settings.language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="it">Italian</SelectItem>
              <SelectItem value="pt">Portuguese</SelectItem>
              <SelectItem value="ru">Russian</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
