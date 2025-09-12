import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import dynamic from "next/dynamic"

const AuthProvider = dynamic<{ children: React.ReactNode }>(
  () =>
    import("@/components/AuthProvider").then((mod) => mod.AuthProvider), // 👈 importante
  { ssr: false }
)

export const metadata: Metadata = {
  title: "Nu9ve Academy - Habilidades Blandas Gamificadas",
  description: "Aprende habilidades blandas de forma divertida con capibaras",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
