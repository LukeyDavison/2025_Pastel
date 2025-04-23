"use client"

import { useEmailBuilder } from "@/contexts/email-builder-context"
import type { RowType } from "@/contexts/email-builder-context"

export function RowsPanel() {
  const { addRow } = useEmailBuilder()

  const rowTypes: { type: RowType; label: string; icon: string }[] = [
    {
      type: "single",
      label: "Single Column",
      icon: "■",
    },
    {
      type: "double-equal",
      label: "Two Columns",
      icon: "■ ■",
    },
    {
      type: "double-left",
      label: "Two Columns (Left)",
      icon: "■■ ■",
    },
    {
      type: "double-right",
      label: "Two Columns (Right)",
      icon: "■ ■■",
    },
    {
      type: "triple",
      label: "Three Columns",
      icon: "■ ■ ■",
    },
    {
      type: "quad",
      label: "Four Columns",
      icon: "■ ■ ■ ■",
    },
  ]

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Row Layouts</h3>

      <div className="space-y-4">
        {rowTypes.map((row) => (
          <div
            key={row.type}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => addRow(row.type)}
          >
            <div className="flex items-center">
              <div className="w-16 text-center font-mono text-sm">{row.icon}</div>
              <span>{row.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
