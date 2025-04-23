"use client"

import { useEffect } from "react"

import { useState, useRef, useCallback } from "react"

export function useCanvas() {
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    contextRef.current = canvas.getContext("2d")
  }, [])

  const startDrawing = useCallback(() => {
    setIsDrawing(true)
  }, [])

  const endDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const draw = useCallback(
    (x: number, y: number) => {
      if (!isDrawing || !contextRef.current) return

      const ctx = contextRef.current
      ctx.lineTo(x, y)
      ctx.stroke()
    },
    [isDrawing],
  )

  return {
    canvasRef,
    startDrawing,
    endDrawing,
    draw,
    isDrawing,
    setIsDrawing,
  }
}
