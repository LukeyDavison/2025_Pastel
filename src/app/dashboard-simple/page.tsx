"use client"
import { Plus, Settings, Layout, ImageIcon, Type, Grid, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function SimpleDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001022] via-[#3f93ff] to-[#0047ff]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Pastel</h1>
            <p className="text-[#e1e1e1]">Ad Creator Dashboard</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30">
              <Plus className="mr-2 h-4 w-4" />
              New Ad
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription className="text-[#bac0cf]">
                  Continue working on your recent ad projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition cursor-pointer"
                    >
                      <div className="aspect-video bg-black/20 rounded-md mb-3 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-[#bbbbca]" />
                      </div>
                      <h3 className="font-medium">Summer Sale Ad {item}</h3>
                      <p className="text-sm text-[#bbbbca]">Last edited 2 days ago</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle>Templates</CardTitle>
                <CardDescription className="text-[#bac0cf]">Start with a pre-designed template</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: "Sale Banner", icon: <Layout className="h-6 w-6" /> },
                    { name: "Product Showcase", icon: <Grid className="h-6 w-6" /> },
                    { name: "Text Overlay", icon: <Type className="h-6 w-6" /> },
                  ].map((template, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition cursor-pointer flex items-center"
                    >
                      <div className="mr-3 bg-white/10 p-2 rounded-md">{template.icon}</div>
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-xs text-[#bbbbca]">Start with this template</p>
                      </div>
                      <ChevronRight className="ml-auto h-5 w-5 text-[#bbbbca]" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Ad
                </Button>
                <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                  <Layout className="mr-2 h-4 w-4" />
                  Browse Templates
                </Button>
                <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                  <Settings className="mr-2 h-4 w-4" />
                  Ad Size Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle>Priority Ad Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: "468x60", description: "Banner" },
                    { name: "320x50", description: "Mobile Banner" },
                    { name: "336x280", description: "Large Rectangle" },
                    { name: "970x250", description: "Billboard" },
                  ].map((size, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition cursor-pointer"
                    >
                      <h3 className="font-medium">{size.name}</h3>
                      <p className="text-xs text-[#bbbbca]">{size.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
