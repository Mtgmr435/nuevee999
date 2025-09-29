// components/LoginButton.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/AuthProvider"
import { supabase } from "@/lib/supabase"

export default function LoginButton() {
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)

  const login = async () => {
    if (busy) return
    setBusy(true)
    try {
      const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      })
      if (error) throw error
      // redirige a Supabase y vuelve logueado
    } catch (e) {
      alert("No se pudo iniciar sesión.")
    } finally {
      setBusy(false)
    }
  }

  const logout = async () => {
    if (busy) return
    setBusy(true)
    try {
      await supabase.auth.signOut()
    } finally {
      setBusy(false)
    }
  }

  if (user) return <Button variant="secondary" onClick={logout} disabled={busy}>Cerrar sesión</Button>
  return <Button onClick={login} disabled={busy}>{busy ? "Conectando…" : "Iniciar sesión con Google"}</Button>
}

