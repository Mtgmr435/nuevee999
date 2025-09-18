"use client"
export const dynamic = "force-dynamic"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import LevelComponent from "@/components/LevelComponent"
import { UserData } from "@/lib/userTypes"
import { levelsMap } from "@/lib/levels/index"

// 🔑 usa las mismas keys que page.tsx
const LS_USER_KEY = "nu9ve_userData_v1"
const LS_VIEW_KEY = "nu9ve_view_v1"

const initialUserData: UserData = {
  level: 1,
  xp: 0,
  coins: 100,
  gems: 5,
  lives: 5,
  maxLives: 5,
  lastDailyChest: null,
  completedLevels: [],
  badges: [],
  currentPet: "baby-capybara",
  unlockedPets: ["baby-capybara"],
}

export default function LevelPage() {
  const router = useRouter()
  const params = useParams()
  const levelId = Number(params?.id)
  const levelData = levelsMap[levelId]

  const [userData, setUserData] = useState<UserData>(initialUserData)

  // 💾 hidrata desde localStorage al entrar a la página de nivel
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_USER_KEY)
      if (raw) {
        const fromLs = JSON.parse(raw) as Partial<UserData>
        setUserData((prev) => ({ ...prev, ...fromLs }))
      }
    } catch {}
  }, [])

  if (!levelData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Nivel no encontrado</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg shadow-md"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  // ✅ guarda progreso + medalla en localStorage (fuente de verdad del mapa)
  const handleCompleteLevel = (
    levelId: number,
    xp: number,
    coins: number,
    medal: string
  ) => {
    setUserData((prev) => {
      const next: UserData = {
        ...prev,
        coins: prev.coins + coins,
        xp: prev.xp + xp,
        completedLevels: Array.from(new Set([...prev.completedLevels, levelId])),
        badges: [
          ...prev.badges.filter((b) => b.levelId !== levelId),
          { levelId, medal },
        ],
      }
      try {
        localStorage.setItem(LS_USER_KEY, JSON.stringify(next))
        localStorage.setItem(LS_VIEW_KEY, "course") // que el home abra el mapa/curso
      } catch {}
      return next
    })
    // 👇 NO hagas router.push aquí; deja que el botón "Volver al mapa" lo haga.
  }

  const handleBack = () => {
    // por si el usuario vuelve sin completar, persistimos igualmente lo último
    try {
      localStorage.setItem(LS_USER_KEY, JSON.stringify(userData))
      localStorage.setItem(LS_VIEW_KEY, "course")
    } catch {}
    router.push("/")
  }

  const handleLoseLife = () => {
    setUserData((prev) => ({
      ...prev,
      lives: Math.max(0, prev.lives - 1),
    }))
  }

  return (
    <LevelComponent
      levelId={levelId}
      userData={userData}
      onComplete={handleCompleteLevel}
      onBack={handleBack}
      onLoseLife={handleLoseLife}
    />
  )
}
