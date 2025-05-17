import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./styles.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LK Bennett Product Search",
  description: "Search and browse LK Bennett products",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">{children}</main>
      </body>
    </html>
  )
}
