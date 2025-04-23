"use client"

import { useEmailBuilder } from "@/contexts/email-builder-context"
import { EmailBlock } from "./email-block"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatePresence, Reorder } from "framer-motion"

export function FramerEmailCanvas() {
  const { currentTemplate, viewMode, addBlock, selectBlock, updateTemplate } = useEmailBuilder()

  if (!currentTemplate) return null

  const handleReorderBlocks = (newOrder: typeof currentTemplate.blocks) => {
    updateTemplate({
      ...currentTemplate,
      blocks: newOrder,
    })
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
        <div className="min-h-[200px] relative">
          {currentTemplate.blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 border-2 border-dashed rounded-md m-4">
              <p className="mb-4">Start by adding a block</p>
              <Button onClick={() => addBlock("title")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Block
              </Button>
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={currentTemplate.blocks}
              onReorder={handleReorderBlocks}
              className="space-y-1"
            >
              <AnimatePresence>
                {currentTemplate.blocks.map((block) => (
                  <Reorder.Item
                    key={block.id}
                    value={block}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { type: "spring", stiffness: 300, damping: 25 },
                    }}
                    exit={{ opacity: 0, y: 20 }}
                    whileDrag={{
                      scale: 1.03,
                      boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
                      zIndex: 1,
                    }}
                    className="relative group border-2 border-transparent hover:border-gray-300 cursor-move transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      selectBlock(block.id)
                    }}
                  >
                    <EmailBlock block={block} />
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
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
      </div>
    </div>
  )
}
