import type { Metadata } from "next"
import "./globals.css"
import ClientAuthProvider from "@/components/ClientAuthProvider"

export const metadata: Metadata = {
  title: "Nu9ve Academy - Habilidades Blandas Gamificadas",
  description: "Aprende habilidades blandas de forma divertida con capibaras",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ClientAuthProvider>{children}</ClientAuthProvider>
      </body>
    </html>
  )
}