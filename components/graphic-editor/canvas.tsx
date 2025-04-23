"use client"

import type React from "react"

import { useRef, useEffect } from "react"

interface CanvasProps {
  elements: any[]
  selectedElement: string | null
  onSelectElement: (id: string) => void
  canvasRef: React.RefObject<HTMLCanvasElement>
  isDrawing: boolean
  setIsDrawing: (drawing: boolean) => void
  updateElement: (id: string, updatedProps: any) => void
}

export function Canvas({
  elements,
  selectedElement,
  onSelectElement,
  canvasRef,
  isDrawing,
  setIsDrawing,
  updateElement,
}: CanvasProps) {
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null)

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    canvas.style.width = `${canvas.offsetWidth}px`
    canvas.style.height = `${canvas.offsetHeight}px`

    // Get context and set properties
    const context = canvas.getContext("2d")
    if (context) {
      context.scale(window.devicePixelRatio, window.devicePixelRatio)
      context.lineCap = "round"
      context.lineJoin = "round"
      context.strokeStyle = "black"
      context.lineWidth = 2
      contextRef.current = context
    }

    // Handle window resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio
        canvas.height = canvas.offsetHeight * window.devicePixelRatio
        canvas.style.width = `${canvas.offsetWidth}px`
        canvas.style.height = `${canvas.offsetHeight}px`

        if (contextRef.current) {
          contextRef.current.scale(window.devicePixelRatio, window.devicePixelRatio)
          contextRef.current.lineCap = "round"
          contextRef.current.lineJoin = "round"
        }
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [canvasRef])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!contextRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    contextRef.current.beginPath()
    contextRef.current.moveTo(x, y)
    lastPositionRef.current = { x, y }
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !lastPositionRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    contextRef.current.lineTo(x, y)
    contextRef.current.stroke()
    lastPositionRef.current = { x, y }
  }

  const stopDrawing = () => {
    if (!contextRef.current) return

    contextRef.current.closePath()
    setIsDrawing(false)
    lastPositionRef.current = null
  }

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full bg-white cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {elements.map((element) => (
          <div key={element.id} className="absolute" style={{ top: "50px", left: "50px" }}>
            {element.type === "text" && (
              <div
                className="p-2 border border-transparent hover:border-blue-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectElement(element.id)
                }}
              >
                {element.content}
              </div>
            )}
            {element.type === "shape" && (
              <div
                className="border border-transparent hover:border-blue-500 cursor-pointer"
                style={{
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  backgroundColor: element.fill,
                  borderRadius: element.shapeType === "circle" ? "50%" : "0",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectElement(element.id)
                }}
              />
            )}
            {element.type === "image" && (
              <img
                src={element.src || "/placeholder.svg"}
                alt={element.alt}
                className="border border-transparent hover:border-blue-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectElement(element.id)
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
