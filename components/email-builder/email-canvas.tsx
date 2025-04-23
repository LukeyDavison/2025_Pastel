"use client"

import { useEmailBuilder } from "@/contexts/email-builder-context"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { EmailBlock } from "./email-block"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function EmailCanvas() {
  const { currentTemplate, viewMode, addBlock, selectBlock, updateTemplate } = useEmailBuilder()
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  if (!currentTemplate) return null

  const handleDragEnd = (result: any) => {
    setDragOverIndex(null)
    if (!result.destination) return

    const { source, destination } = result
    const blocks = [...currentTemplate.blocks]
    const [removed] = blocks.splice(source.index, 1)
    blocks.splice(destination.index, 0, removed)

    updateTemplate({
      ...currentTemplate,
      blocks,
    })
  }

  const handleDragOver = (index: number) => {
    setDragOverIndex(index)
  }

  return (
    <div
      className="min-h-full p-8 flex justify-center"
      style={{ backgroundColor: currentTemplate.settings.backgroundColor }}
    >
      <div
        className="bg-white shadow-md"
        style={{
          width: viewMode === "mobile" ? "375px" : `${currentTemplate.settings.width}px`,
          backgroundColor: currentTemplate.settings.contentBackgroundColor,
          margin: currentTemplate.settings.alignment === "center" ? "0 auto" : "0",
        }}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="email-canvas" type="block">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`min-h-[200px] relative ${snapshot.isDraggingOver ? "bg-blue-50" : ""}`}
              >
                {currentTemplate.blocks.map((block, index) => (
                  <>
                    {/* Drop zone above block */}
                    {index === 0 && (
                      <div
                        className={`h-4 w-full transition-all ${dragOverIndex === 0 ? "bg-blue-200 h-8" : ""}`}
                        onDragOver={() => handleDragOver(0)}
                      />
                    )}

                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`relative group border-2 ${
                            snapshot.isDragging ? "border-blue-500 bg-blue-50" : "border-transparent"
                          } hover:border-gray-300 cursor-pointer transition-all duration-200`}
                          onClick={(e) => {
                            e.stopPropagation()
                            selectBlock(block.id)
                          }}
                        >
                          <EmailBlock block={block} />
                        </div>
                      )}
                    </Draggable>

                    {/* Drop zone below block */}
                    <div
                      className={`h-4 w-full transition-all ${dragOverIndex === index + 1 ? "bg-blue-200 h-8" : ""}`}
                      onDragOver={() => handleDragOver(index + 1)}
                    />
                  </>
                ))}
                {provided.placeholder}

                {currentTemplate.blocks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400 border-2 border-dashed rounded-md m-4">
                    <p className="mb-4">Start by adding a block</p>
                    <Button onClick={() => addBlock("title")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Block
                    </Button>
                  </div>
                )}

                {/* Add block button between blocks */}
                {currentTemplate.blocks.length > 0 && (
                  <div className="my-4 flex justify-center">
                    <Button
                      onClick={() => addBlock("title")}
                      variant="outline"
                      className="border-dashed border-2 hover:border-blue-400 hover:bg-blue-50"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Block
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}
