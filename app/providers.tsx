"use client"

import type React from "react"

import { EmailBuilderProvider } from "@/contexts/email-builder-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return <EmailBuilderProvider>{children}</EmailBuilderProvider>
}
