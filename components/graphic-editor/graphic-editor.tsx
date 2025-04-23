"use client"

import { useState, useRef, useEffect } from "react"
import { TemplateSidebar } from "./template-sidebar"
import { LayerPanel } from "./layer-panel"
import { Toolbar } from "./toolbar"
import { Canvas } from "./canvas"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"

export function GraphicEditor() {
  const [elements, setElements] = useState<any[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState<any[][]>([[]]) // Initialize with an empty state
  const [historyIndex, setHistoryIndex] = useState(0)
  const { toast } = useToast()

  // Autosave effect
  useEffect(() => {
    const saveState = () => {
      try {
        localStorage.setItem("editorState", JSON.stringify(elements))
        toast({
          title: "Autosaved",
          description: "Your design has been automatically saved.",
        })
      } catch (error) {
        console.error("Failed to autosave:", error)
      }
    }

    const autosaveInterval = setInterval(saveState, 30000) // Autosave every 30 seconds

    return () => clearInterval(autosaveInterval) // Clean up on unmount
  }, [elements, toast])

  // Load saved state on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("editorState")
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        setElements(parsedState)
        setHistory([parsedState]) // Also set initial history
        setHistoryIndex(0)
      }
    } catch (error) {
      console.error("Failed to load saved state:", error)
    }
  }, [])

  const addElement = (type: string, props: any = {}) => {
    const id = uuidv4()
    let newElement

    switch (type) {
      case "text":
        newElement = { id, type, content: "New Text", fontSize: 24, fontFamily: "Arial", color: "#000" }
        break
      case "shape":
        newElement = { id, type, shapeType: "circle", width: 50, height: 50, fill: "red" }
        break
      case "image":
        newElement = { id, type, src: "/placeholder.svg?height=200&width=400", alt: "New Image" }
        break
      case "drawing":
        newElement = { id, type, points: [], strokeColor: "black", strokeWidth: 2 }
        break
      default:
        return
    }

    setElements([...elements, newElement])
    setHistory([...history.slice(0, historyIndex + 1), [...elements, newElement]])
    setHistoryIndex(historyIndex + 1)
  }

  const updateElement = (id: string, updatedProps: any) => {
    const newElements = elements.map((element) => (element.id === id ? { ...element, ...updatedProps } : element))
    setElements(newElements)
    setHistory([...history.slice(0, historyIndex + 1), newElements])
    setHistoryIndex(historyIndex + 1)
  }

  const deleteElement = (id: string) => {
    const newElements = elements.filter((element) => element.id !== id)
    setElements(newElements)
    setHistory([...history.slice(0, historyIndex + 1), newElements])
    setHistoryIndex(historyIndex + 1)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active && over && active.id !== over.id) {
      setElements((prevElements) => {
        const activeIndex = prevElements.findIndex((el) => el.id === active.id)
        const overIndex = prevElements.findIndex((el) => el.id === over.id)

        if (activeIndex === -1 || overIndex === -1) {
          return prevElements
        }

        const newElements = [...prevElements]
        // Remove active element and insert it at the 'over' index
        const [movedElement] = newElements.splice(activeIndex, 1)
        newElements.splice(overIndex, 0, movedElement)

        return newElements
      })
    }
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements(history[historyIndex + 1])
    }
  }

  return (
    <div className="flex h-screen">
      {/* Template Sidebar */}
      <TemplateSidebar addElement={addElement} />

      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <Toolbar
          onAddText={() => addElement("text")}
          onAddShape={() => addElement("shape")}
          onAddImage={() => addElement("image")}
          onToggleDrawing={() => addElement("drawing")}
          onUndo={undo}
          onRedo={redo}
        />

        {/* Canvas */}
        <div className="flex-1 relative">
          <Canvas
            elements={elements}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            canvasRef={canvasRef}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
            updateElement={updateElement}
          />
        </div>
      </div>

      {/* Layer Panel */}
      <LayerPanel
        elements={elements}
        selectedElement={selectedElement}
        onSelectElement={setSelectedElement}
        onDeleteElement={deleteElement}
      />
    </div>
  )
}
