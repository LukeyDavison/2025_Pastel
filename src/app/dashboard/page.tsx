"use client"

import { useState } from "react"
import { Plus, Settings, Layout, ImageIcon, Mail, Paintbrush } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { ErrorBoundary } from "@/components/error-boundary"
import dynamic from "next/dynamic"

// Dynamically import the AdCreatorButton with SSR disabled
const AdCreatorButton = dynamic(
  () => import("@/components/ad-creator/ad-creator-button").then((mod) => mod.AdCreatorButton),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-white">
          <div className="flex items-center space-x-3">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            <p>Loading editor...</p>
          </div>
        </div>
      </div>
    ),
  },
)

export default function DashboardPage() {
  const [showAdCreator, setShowAdCreator] = useState(false)

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-[#001022] via-[#3f93ff] to-[#0047ff]">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Pastel</h1>
              <p className="text-[#e1e1e1]">Creative Tools Dashboard</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                onClick={() => setShowAdCreator(true)}
                className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30"
              >
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
                  <CardTitle>Your Creative Tools</CardTitle>
                  <CardDescription className="text-[#bac0cf]">
                    Access all your creative tools in one place
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        name: "Ad Creator",
                        icon: <Layout className="h-6 w-6" />,
                        description: "Create affiliate ads",
                        action: () => setShowAdCreator(true),
                      },
                      {
                        name: "Email Builder",
                        icon: <Mail className="h-6 w-6" />,
                        description: "Design email templates",
                        href: "/editor",
                      },
                      {
                        name: "Graphic Editor",
                        icon: <Paintbrush className="h-6 w-6" />,
                        description: "Create custom graphics",
                        href: "/graphic-editor",
                      },
                    ].map((tool, i) => (
                      <div
                        key={i}
                        className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition cursor-pointer"
                        onClick={tool.action ? tool.action : undefined}
                      >
                        {tool.href ? (
                          <Link href={tool.href} className="flex flex-col items-center text-center">
                            <div className="mb-4 bg-white/10 p-4 rounded-full">{tool.icon}</div>
                            <h3 className="font-medium text-lg mb-1">{tool.name}</h3>
                            <p className="text-sm text-[#bbbbca]">{tool.description}</p>
                          </Link>
                        ) : (
                          <div className="flex flex-col items-center text-center">
                            <div className="mb-4 bg-white/10 p-4 rounded-full">{tool.icon}</div>
                            <h3 className="font-medium text-lg mb-1">{tool.name}</h3>
                            <p className="text-sm text-[#bbbbca]">{tool.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription className="text-[#bac0cf]">Continue working on your recent projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition cursor-pointer"
                        onClick={() => setShowAdCreator(true)}
                      >
                        <div className="aspect-video bg-black/20 rounded-md mb-3 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-[#bbbbca]" />
                        </div>
                        <h3 className="font-medium">Project {item}</h3>
                        <p className="text-sm text-[#bbbbca]">Last edited 2 days ago</p>
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
                  <Button
                    onClick={() => setShowAdCreator(true)}
                    className="w-full justify-start bg-white/10 hover:bg-white/20 text-white"
                  >
                    <Layout className="mr-2 h-4 w-4" />
                    Create New Ad
                  </Button>
                  <Link href="/editor" passHref>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-white/20 text-white hover:bg-white/10"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Build Email Template
                    </Button>
                  </Link>
                  <Link href="/graphic-editor" passHref>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-white/20 text-white hover:bg-white/10"
                    >
                      <Paintbrush className="mr-2 h-4 w-4" />
                      Open Graphic Editor
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { name: "Sale Banner", description: "Affiliate Ad" },
                      { name: "Newsletter", description: "Email Template" },
                      { name: "Social Media Post", description: "Graphic" },
                      { name: "Product Showcase", description: "Email Template" },
                    ].map((template, i) => (
                      <div
                        key={i}
                        className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition cursor-pointer"
                      >
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-xs text-[#bbbbca]">{template.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Ad Creator Modal */}
        {showAdCreator && <AdCreatorButton onClose={() => setShowAdCreator(false)} />}
      </div>
    </ErrorBoundary>
  )
}
