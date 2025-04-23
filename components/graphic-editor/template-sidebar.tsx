"use client"

import { Type, Square, ImageIcon, Pencil, Circle, Triangle, Star, Layout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TemplateSidebarProps {
  addElement: (type: string) => void
}

export function TemplateSidebar({ addElement }: TemplateSidebarProps) {
  const templates = [
    { name: "Facebook Ad", width: 1200, height: 628 },
    { name: "Instagram Post", width: 1080, height: 1080 },
    { name: "Twitter Post", width: 1200, height: 675 },
    { name: "LinkedIn Banner", width: 1584, height: 396 },
    { name: "YouTube Thumbnail", width: 1280, height: 720 },
  ]

  return (
    <div className="w-64 bg-white border-r h-full">
      <Tabs defaultValue="elements">
        <TabsList className="w-full">
          <TabsTrigger value="elements" className="flex-1">
            Elements
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex-1">
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="elements" className="p-0">
          <ScrollArea className="h-[calc(100vh-48px)] p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Text</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start" onClick={() => addElement("text")}>
                    <Type className="h-4 w-4 mr-2" />
                    Heading
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => addElement("text")}>
                    <Type className="h-4 w-4 mr-2" />
                    Paragraph
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Shapes</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start" onClick={() => addElement("shape")}>
                    <Square className="h-4 w-4 mr-2" />
                    Rectangle
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => addElement("shape")}>
                    <Circle className="h-4 w-4 mr-2" />
                    Circle
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => addElement("shape")}>
                    <Triangle className="h-4 w-4 mr-2" />
                    Triangle
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => addElement("shape")}>
                    <Star className="h-4 w-4 mr-2" />
                    Star
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Media</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start" onClick={() => addElement("image")}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Image
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => addElement("drawing")}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Drawing
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="templates" className="p-0">
          <ScrollArea className="h-[calc(100vh-48px)] p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-2">Social Media</h3>
              <div className="grid gap-3">
                {templates.map((template, index) => (
                  <Button key={index} variant="outline" className="h-auto p-3 justify-start items-start">
                    <div className="flex items-center w-full">
                      <Layout className="h-8 w-8 mr-3 text-gray-400" />
                      <div className="text-left">
                        <p className="font-medium">{template.name}</p>
                        <p className="text-xs text-gray-500">
                          {template.width} × {template.height}px
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
