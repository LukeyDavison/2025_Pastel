"use client"

import { useEmailBuilder } from "@/contexts/email-builder-context"
import { Button } from "@/components/ui/button"
import { Trash, Copy, ChevronUp, ChevronDown } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function RowEditor() {
  const { currentTemplate, selectedRowId, deleteRow, duplicateRow, moveRow, updateTemplate } = useEmailBuilder()

  if (!currentTemplate || !selectedRowId) return null

  // Find the selected row
  const selectedRow = currentTemplate.rows.find((row) => row.id === selectedRowId)

  if (!selectedRow) return null

  const handleStyleChange = (styles: Record<string, any>) => {
    const updatedRows = currentTemplate.rows.map((row) => {
      if (row.id === selectedRowId) {
        return {
          ...row,
          styles: { ...row.styles, ...styles },
        }
      }
      return row
    })

    updateTemplate({
      ...currentTemplate,
      rows: updatedRows,
    })
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Edit Row</h3>

        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => moveRow(selectedRowId, "up")}>
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => moveRow(selectedRowId, "down")}>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => duplicateRow(selectedRowId)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteRow(selectedRowId)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">Background Color</Label>
          <div className="flex">
            <Input
              type="color"
              value={selectedRow.styles.backgroundColor || "#ffffff"}
              onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
              className="w-12 h-10 p-1 mr-2"
            />
            <Input
              type="text"
              value={selectedRow.styles.backgroundColor || "#ffffff"}
              onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Padding</Label>
          <Input
            type="text"
            value={selectedRow.styles.padding || "0px"}
            onChange={(e) => handleStyleChange({ padding: e.target.value })}
          />
        </div>

        <div>
          <Label className="mb-2 block">Border</Label>
          <Input
            type="text"
            value={selectedRow.styles.border || "none"}
            onChange={(e) => handleStyleChange({ border: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
