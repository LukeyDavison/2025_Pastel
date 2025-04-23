"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEmailBuilder } from "@/contexts/email-builder-context"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, ChevronRight } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface PreBuildBriefingProps {
  onComplete: (templateId: string) => void
}

export function PreBuildBriefing({ onComplete }: PreBuildBriefingProps) {
  const { templates, createTemplate } = useEmailBuilder()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [campaignName, setCampaignName] = useState("")
  const [purpose, setPurpose] = useState("")
  const [sendDate, setSendDate] = useState<Date>(new Date())
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = () => {
    let templateId: string

    if (selectedTemplateId) {
      // Clone the selected template
      const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)
      if (selectedTemplate) {
        templateId = createTemplate(sendDate)
        // Here you would copy the blocks and settings from the selected template
      } else {
        templateId = createTemplate(sendDate)
      }
    } else {
      templateId = createTemplate(sendDate)
    }

    // Update the template with the briefing information
    onComplete(templateId)
  }

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create New Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  1
                </div>
                <div className={`h-1 w-12 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  2
                </div>
                <div className={`h-1 w-12 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  3
                </div>
              </div>
              <div className="text-sm text-gray-500">Step {step} of 3</div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Summer Sale 2023"
                  />
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose of Email</Label>
                  <Textarea
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Describe the purpose of this email campaign..."
                    rows={4}
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <Label>Send Date</Label>
                  <div className="flex items-center mt-2">
                    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {sendDate ? format(sendDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={sendDate}
                          onSelect={(date) => {
                            if (date) {
                              setSendDate(date)
                              setIsDatePickerOpen(false)
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <Label>Choose a Template</Label>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${selectedTemplateId === null ? "ring-2 ring-blue-500" : ""}`}
                      onClick={() => setSelectedTemplateId(null)}
                    >
                      <CardContent className="p-4 flex flex-col items-center justify-center h-40">
                        <div className="text-4xl mb-2">✨</div>
                        <div className="font-medium">Start from Scratch</div>
                      </CardContent>
                    </Card>

                    {templates
                      .filter((t) => t.blocks.length > 0)
                      .slice(0, 3)
                      .map((template) => (
                        <Card
                          key={template.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${selectedTemplateId === template.id ? "ring-2 ring-blue-500" : ""}`}
                          onClick={() => handleSelectTemplate(template.id)}
                        >
                          <CardContent className="p-4 h-40 overflow-hidden">
                            <div className="font-medium mb-2">{template.name}</div>
                            <div className="text-sm text-gray-500 mb-2">
                              Last updated: {format(new Date(template.updatedAt), "MMM d, yyyy")}
                            </div>
                            <div className="text-xs text-gray-400">{template.blocks.length} blocks</div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            Back
          </Button>
          <Button onClick={handleNext}>
            {step < 3 ? (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Create Email"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
