"use client"

import { ReactNode } from "react"
import { AuthProvider } from "./AuthProvider"

export default function ClientAuthProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
