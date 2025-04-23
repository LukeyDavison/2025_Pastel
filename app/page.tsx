"use client"

import { useState } from "react"
import { useEmailBuilder } from "@/contexts/email-builder-context"
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays, isSameDay } from "date-fns"
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const {
    templates,
    scheduledEmails,
    currentWeek,
    setCurrentWeek,
    selectedDate,
    setSelectedDate,
    createTemplate,
    setCurrentTemplate,
  } = useEmailBuilder()

  const [calendarOpen, setCalendarOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"day" | "week">("day")
  const router = useRouter()

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekNumber = Math.ceil((currentWeek.getDate() + 6 - currentWeek.getDay()) / 7)

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getEmailsForDate = (date: Date) => {
    return scheduledEmails.filter((email) => isSameDay(new Date(email.date), date))
  }

  const getTemplatesForDate = (date: Date) => {
    return templates.filter((template) => template.scheduledFor && isSameDay(new Date(template.scheduledFor), date))
  }

  const handlePrevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setCalendarOpen(false)
  }

  const handleCreateEmail = (date?: Date) => {
    const templateId = createTemplate(date)
    router.push(`/editor/${templateId}`)
  }

  const handleEditEmail = (templateId: string) => {
    setCurrentTemplate(templateId)
    router.push(`/editor/${templateId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Email Builder</h1>
          <Button onClick={() => handleCreateEmail()}>
            <Plus className="mr-2 h-4 w-4" />
            New Email
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="outline" size="icon" onClick={handlePrevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button variant="ghost" className="mx-2 font-medium" onClick={() => setCalendarOpen(true)}>
              <span className="mr-2">
                Week {weekNumber} - {format(weekEnd, "do MMMM yyyy")}
              </span>
              <Calendar className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon" onClick={handleNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center ml-4">
            <Button
              variant={viewMode === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("day")}
              className="rounded-r-none"
            >
              Day
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("week")}
              className="rounded-l-none"
            >
              Week
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            {weekDays.map((day) => (
              <Button
                key={day.toString()}
                variant="ghost"
                className={`w-full justify-start mb-2 ${
                  isSameDay(day, selectedDate || new Date()) ? "bg-gray-100" : ""
                }`}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center mr-3">
                    {format(day, "d")}
                  </div>
                  <span>{format(day, "EEEE")}</span>
                </div>
                {getEmailsForDate(day).length > 0 && <Badge className="ml-auto">{getEmailsForDate(day).length}</Badge>}
              </Button>
            ))}
          </div>

          <div className="space-y-6">
            {viewMode === "day" && selectedDate && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-rose-500">{format(selectedDate, "EEEE | do MMMM yyyy")}</h2>
                  <Button onClick={() => handleCreateEmail(selectedDate)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Email
                  </Button>
                </div>

                {getEmailsForDate(selectedDate).length > 0 || getTemplatesForDate(selectedDate).length > 0 ? (
                  <div className="space-y-4">
                    {getEmailsForDate(selectedDate).map((email) => {
                      const template = templates.find((t) => t.id === email.templateId)
                      if (!template) return null

                      return (
                        <Card key={email.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-6">
                              <div className="mb-4">
                                <h3 className="text-lg font-medium">Subject Line: {email.subject}</h3>
                                <p className="text-sm text-gray-500">Pre-header: {email.preheader}</p>
                              </div>

                              <div className="flex space-x-2">
                                <Button variant="outline" onClick={() => handleEditEmail(template.id)}>
                                  Edit
                                </Button>
                                <Button variant="outline">Preview</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}

                    {getTemplatesForDate(selectedDate).map((template) => {
                      // Only show templates that aren't already in scheduledEmails
                      const isScheduled = scheduledEmails.some((e) => e.templateId === template.id)
                      if (isScheduled) return null

                      return (
                        <Card key={template.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-6">
                              <div className="mb-4">
                                <h3 className="text-lg font-medium">{template.name}</h3>
                                <p className="text-sm text-gray-500">Subject: {template.subject || "No subject"}</p>
                                <p className="text-sm text-gray-500">
                                  Pre-header: {template.preheader || "No pre-header"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Last updated: {format(new Date(template.updatedAt), "MMM d, yyyy h:mm a")}
                                </p>
                              </div>

                              <div className="flex space-x-2">
                                <Button variant="outline" onClick={() => handleEditEmail(template.id)}>
                                  Edit
                                </Button>
                                <Button variant="outline">Preview</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No emails scheduled for this day</p>
                    <Button onClick={() => handleCreateEmail(selectedDate)}>Create New Email</Button>
                  </div>
                )}
              </div>
            )}

            {viewMode === "week" && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Week {weekNumber} Overview</h2>
                  <Button onClick={() => handleCreateEmail()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Email
                  </Button>
                </div>

                <div className="space-y-6">
                  {weekDays.map((day) => {
                    const dayEmails = getEmailsForDate(day)
                    const dayTemplates = getTemplatesForDate(day)
                    const hasContent = dayEmails.length > 0 || dayTemplates.length > 0

                    return (
                      <div key={day.toString()} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{format(day, "EEEE, MMMM do")}</h3>
                          <Button size="sm" variant="outline" onClick={() => handleDateClick(day)}>
                            View Day
                          </Button>
                        </div>

                        {hasContent ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dayEmails.map((email) => {
                              const template = templates.find((t) => t.id === email.templateId)
                              if (!template) return null

                              return (
                                <Card key={email.id} className="overflow-hidden">
                                  <CardContent className="p-4">
                                    <h4 className="font-medium mb-1">{email.subject}</h4>
                                    <p className="text-sm text-gray-500 mb-2">{email.preheader}</p>
                                    <Button size="sm" variant="outline" onClick={() => handleEditEmail(template.id)}>
                                      Edit
                                    </Button>
                                  </CardContent>
                                </Card>
                              )
                            })}

                            {dayTemplates.map((template) => {
                              // Only show templates that aren't already in scheduledEmails
                              const isScheduled = scheduledEmails.some((e) => e.templateId === template.id)
                              if (isScheduled) return null

                              return (
                                <Card key={template.id} className="overflow-hidden">
                                  <CardContent className="p-4">
                                    <h4 className="font-medium mb-1">{template.name}</h4>
                                    <p className="text-sm text-gray-500 mb-2">{template.subject || "No subject"}</p>
                                    <Button size="sm" variant="outline" onClick={() => handleEditEmail(template.id)}>
                                      Edit
                                    </Button>
                                  </CardContent>
                                </Card>
                              )
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No emails scheduled</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {viewMode === "day" && !selectedDate && (
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <p className="text-gray-500 mb-4">Select a day to view or create emails</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select a date</DialogTitle>
            <DialogDescription>Choose a date to view or create emails</DialogDescription>
          </DialogHeader>
          <div className="p-4">
            {/* Calendar would go here - simplified for this example */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <Button
                  key={day.toString()}
                  variant="outline"
                  className={`h-12 ${
                    getEmailsForDate(day).length > 0 || getTemplatesForDate(day).length > 0 ? "border-rose-500" : ""
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  {format(day, "d")}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
