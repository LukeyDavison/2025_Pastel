"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Product } from "@/types/product"

// Define types
export type BlockType =
  | "title"
  | "paragraph"
  | "image"
  | "button"
  | "divider"
  | "spacer"
  | "social"
  | "html"
  | "product"
export type RowType = "single" | "double-equal" | "double-left" | "double-right" | "triple" | "quad"

export interface BlockContent {
  id: string
  type: BlockType
  content: any
  styles: Record<string, any>
}

export interface Row {
  id: string
  type: RowType
  styles: Record<string, any>
}

export interface EmailTemplate {
  id: string
  name: string
  subject?: string
  preheader?: string
  blocks: BlockContent[]
  rows: Row[]
  settings: {
    width: number
    alignment: "left" | "center"
    backgroundColor: string
    contentBackgroundColor: string
    defaultFont: string
    linkColor: string
    language: string
  }
  updatedAt: string
  scheduledFor?: string
}

interface EmailBuilderContextType {
  templates: EmailTemplate[]
  currentTemplate: EmailTemplate | null
  scheduledEmails: { id: string; templateId: string; date: string; subject: string; preheader: string }[]
  emailProducts: Product[]
  selectedBlockId: string | null
  selectedRowId: string | null
  currentWeek: Date
  selectedDate: Date | null
  viewMode: "desktop" | "mobile"
  setCurrentWeek: (date: Date) => void
  setSelectedDate: (date: Date) => void
  setTemplates: (templates: EmailTemplate[]) => void
  setCurrentTemplate: (templateId: string) => void
  addBlock: (type: BlockType) => void
  addRow: (type: RowType) => void
  updateBlock: (id: string, content: any, styles?: Record<string, any>) => void
  updateTemplate: (template: EmailTemplate) => void
  updateTemplateSettings: (settings: Partial<EmailTemplate["settings"]>) => void
  deleteBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  moveBlock: (id: string, direction: "up" | "down") => void
  deleteRow: (id: string) => void
  duplicateRow: (id: string) => void
  moveRow: (id: string, direction: "up" | "down") => void
  selectBlock: (id: string | null) => void
  selectRow: (id: string | null) => void
  createTemplate: (date?: Date) => string
  addEmailProduct: (product: Product) => void
  removeEmailProduct: (productId: string) => void
}

const EmailBuilderContext = createContext<EmailBuilderContextType | undefined>(undefined)

export const EmailBuilderProvider = ({ children }: { children: React.ReactNode }) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null)
  const [scheduledEmails, setScheduledEmails] = useState<
    { id: string; templateId: string; date: string; subject: string; preheader: string }[]
  >([])
  const [emailProducts, setEmailProducts] = useState<Product[]>([])
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop")

  const addBlock = (type: BlockType) => {
    if (!currentTemplate) return

    const newBlock: BlockContent = {
      id: uuidv4(),
      type,
      content:
        type === "title"
          ? "Your Title Here"
          : type === "paragraph"
            ? "Your paragraph here"
            : type === "image"
              ? { src: "/placeholder.svg", alt: "Image description" }
              : type === "button"
                ? { text: "Click Here", url: "#" }
                : type === "social"
                  ? { networks: [{ name: "Facebook", url: "#" }] }
                  : type === "html"
                    ? { code: "<p>Custom HTML</p>" }
                    : type === "product"
                      ? { products: [], columns: 1, showName: true, showPrice: true, showSwatch: true }
                      : "",
      styles:
        type === "title"
          ? {
              fontSize: "32px",
              fontWeight: "bold",
              color: "#000000",
              textAlign: "left",
              fontFamily: "Arial, sans-serif",
              padding: "10px",
            }
          : type === "paragraph"
            ? {
                fontSize: "16px",
                color: "#000000",
                textAlign: "left",
                fontFamily: "Arial, sans-serif",
                lineHeight: "1.5",
                padding: "10px",
              }
            : type === "image"
              ? { width: "100%", align: "center", borderRadius: "0" }
              : type === "button"
                ? {
                    backgroundColor: "#007bff",
                    color: "#ffffff",
                    borderRadius: "5px",
                    padding: "10px 20px",
                    textAlign: "center",
                  }
                : type === "divider"
                  ? { color: "#cccccc", height: "1px", padding: "10px" }
                  : type === "spacer"
                    ? { height: "50px" }
                    : type === "social"
                      ? { iconSize: "24px", iconSpacing: "5px", align: "center" }
                      : type === "html"
                        ? { padding: "10px" }
                        : type === "product"
                          ? { padding: "10px" }
                          : {},
    }

    updateTemplate({
      ...currentTemplate,
      blocks: [...currentTemplate.blocks, newBlock],
    })
  }

  const addRow = (type: RowType) => {
    if (!currentTemplate) return

    const newRow: Row = {
      id: uuidv4(),
      type,
      styles: {},
    }

    updateTemplate({
      ...currentTemplate,
      rows: [...currentTemplate.rows, newRow],
    })
  }

  const updateBlock = (id: string, content: any, styles?: Record<string, any>) => {
    if (!currentTemplate) return

    const updatedBlocks = currentTemplate.blocks.map((block) =>
      block.id === id ? { ...block, content, styles: { ...block.styles, ...styles } } : block,
    )

    updateTemplate({
      ...currentTemplate,
      blocks: updatedBlocks,
    })
  }

  const updateTemplateSettings = (settings: Partial<EmailTemplate["settings"]>) => {
    if (!currentTemplate) return

    updateTemplate({
      ...currentTemplate,
      settings: { ...currentTemplate.settings, ...settings },
    })
  }

  const updateTemplate = (template: EmailTemplate) => {
    setTemplates((prevTemplates) => prevTemplates.map((t) => (t.id === template.id ? template : t)))
    setCurrentTemplate(template)
  }

  const deleteBlock = (id: string) => {
    if (!currentTemplate) return

    const updatedBlocks = currentTemplate.blocks.filter((block) => block.id !== id)

    updateTemplate({
      ...currentTemplate,
      blocks: updatedBlocks,
    })

    setSelectedBlockId(null)
  }

  const duplicateBlock = (id: string) => {
    if (!currentTemplate) return

    const blockToDuplicate = currentTemplate.blocks.find((block) => block.id === id)
    if (!blockToDuplicate) return

    const duplicatedBlock: BlockContent = {
      ...blockToDuplicate,
      id: uuidv4(),
    }

    const blockIndex = currentTemplate.blocks.findIndex((block) => block.id === id)

    const updatedBlocks = [
      ...currentTemplate.blocks.slice(0, blockIndex + 1),
      duplicatedBlock,
      ...currentTemplate.blocks.slice(blockIndex + 1),
    ]

    updateTemplate({
      ...currentTemplate,
      blocks: updatedBlocks,
    })

    setSelectedBlockId(duplicatedBlock.id)
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    if (!currentTemplate) return

    const blockIndex = currentTemplate.blocks.findIndex((block) => block.id === id)
    if (blockIndex === -1) return

    const newIndex = direction === "up" ? blockIndex - 1 : blockIndex + 1

    if (newIndex < 0 || newIndex >= currentTemplate.blocks.length) return

    const updatedBlocks = [...currentTemplate.blocks]
    const [movedBlock] = updatedBlocks.splice(blockIndex, 1)
    updatedBlocks.splice(newIndex, 0, movedBlock)

    updateTemplate({
      ...currentTemplate,
      blocks: updatedBlocks,
    })

    setSelectedBlockId(movedBlock.id)
  }

  const deleteRow = (id: string) => {
    if (!currentTemplate) return

    const updatedRows = currentTemplate.rows.filter((row) => row.id !== id)

    updateTemplate({
      ...currentTemplate,
      rows: updatedRows,
    })

    setSelectedRowId(null)
  }

  const duplicateRow = (id: string) => {
    if (!currentTemplate) return

    const rowToDuplicate = currentTemplate.rows.find((row) => row.id === id)
    if (!rowToDuplicate) return

    const duplicatedRow: Row = {
      ...rowToDuplicate,
      id: uuidv4(),
    }

    const rowIndex = currentTemplate.rows.findIndex((row) => row.id === id)

    const updatedRows = [
      ...currentTemplate.rows.slice(0, rowIndex + 1),
      duplicatedRow,
      ...currentTemplate.rows.slice(rowIndex + 1),
    ]

    updateTemplate({
      ...currentTemplate,
      rows: updatedRows,
    })

    setSelectedRowId(duplicatedRow.id)
  }

  const moveRow = (id: string, direction: "up" | "down") => {
    if (!currentTemplate) return

    const rowIndex = currentTemplate.rows.findIndex((row) => row.id === id)
    if (rowIndex === -1) return

    const newIndex = direction === "up" ? rowIndex - 1 : rowIndex + 1

    if (newIndex < 0 || newIndex >= currentTemplate.rows.length) return

    const updatedRows = [...currentTemplate.rows]
    const [movedRow] = updatedRows.splice(rowIndex, 1)
    updatedRows.splice(newIndex, 0, movedRow)

    updateTemplate({
      ...currentTemplate,
      rows: updatedRows,
    })

    setSelectedRowId(movedRow.id)
  }

  const selectBlock = (id: string | null) => {
    setSelectedBlockId(id)
  }

  const selectRow = (id: string | null) => {
    setSelectedRowId(id)
  }

  const createTemplate = (date?: Date) => {
    const newTemplate: EmailTemplate = {
      id: uuidv4(),
      name: "New Email Template",
      blocks: [],
      rows: [],
      settings: {
        width: 600,
        alignment: "center",
        backgroundColor: "#f0f0f0",
        contentBackgroundColor: "#ffffff",
        defaultFont: "Arial, sans-serif",
        linkColor: "#007bff",
        language: "en",
      },
      updatedAt: new Date().toISOString(),
      scheduledFor: date?.toISOString(),
    }

    setTemplates((prevTemplates) => [...prevTemplates, newTemplate])
    setCurrentTemplate(newTemplate)
    return newTemplate.id
  }

  const addEmailProduct = (product: Product) => {
    setEmailProducts((prevProducts) => {
      const exists = prevProducts.some((p) => p.id === product.id)
      if (exists) {
        return prevProducts
      } else {
        return [...prevProducts, product]
      }
    })
  }

  const removeEmailProduct = (productId: string) => {
    setEmailProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId))
  }

  const value: EmailBuilderContextType = {
    templates,
    currentTemplate,
    scheduledEmails,
    emailProducts,
    selectedBlockId,
    selectedRowId,
    currentWeek,
    selectedDate,
    viewMode,
    setCurrentWeek,
    setSelectedDate,
    setTemplates,
    setCurrentTemplate: (templateId: string) => {
      const template = templates.find((t) => t.id === templateId)
      if (template) {
        setCurrentTemplate(template)
      }
    },
    addBlock,
    addRow,
    updateBlock,
    updateTemplate,
    updateTemplateSettings,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    deleteRow,
    duplicateRow,
    moveRow,
    selectBlock,
    selectRow,
    createTemplate,
    addEmailProduct,
    removeEmailProduct,
  }

  return <EmailBuilderContext.Provider value={value}>{children}</EmailBuilderContext.Provider>
}

export const useEmailBuilder = () => {
  const context = useContext(EmailBuilderContext)
  if (!context) {
    throw new Error("useEmailBuilder must be used within an EmailBuilderProvider")
  }
  return context
}
