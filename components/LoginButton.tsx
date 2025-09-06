"use client"

import { signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut } from "lucide-react"
import { useState } from "react"
import { useAuth } from "./AuthProvider"

export default function LoginButton() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        try {
            setLoading(true)
            await signInWithPopup(auth, googleProvider)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            setLoading(true)
            await signOut(auth)
        } finally {
            setLoading(false)
        }
    }

    if (user) {
        return (
            <Button onClick={handleLogout} disabled={loading} variant="outline" className="border-amber-300 text-amber-700">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
            </Button>
        )
    }

    return (
        <Button onClick={handleLogin} disabled={loading} variant="outline" className="border-amber-300 text-amber-700">
            <LogIn className="w-4 h-4 mr-2" />
            Iniciar Sesión con Google
        </Button>
    )
}