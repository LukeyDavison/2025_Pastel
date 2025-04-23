"use client"

import { ErrorBoundary } from "@/components/error-boundary"
import Link from "next/link"

export default function Dashboard() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-[#001022] via-[#3f93ff] to-[#0047ff] p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Pastel</h1>
              <p className="text-[#e1e1e1]">Ad Creator Dashboard</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-md hover:bg-white/30 transition-colors"
            >
              Back to Home
            </Link>
          </header>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h2>
            <p>Your dashboard has been reset to a simple version to resolve server errors.</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
