"use client"
export const dynamic = "force-dynamic"

import { useRouter, useParams } from "next/navigation"
import LevelComponent from "@/components/LevelComponent"
import { useState } from "react"
import { UserData } from "@/lib/userTypes"
import { levelsMap } from "@/lib/levels/index"

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
  currentPet: "baby-capybara",   // 👈 usa el nombre correcto del tipo
  unlockedPets: ["baby-capybara"],
}

export default function LevelPage() {
  const router = useRouter()
  const params = useParams()
  const levelId = Number(params?.id)

  const levelData = levelsMap[levelId]
  const [userData, setUserData] = useState<UserData>(initialUserData)

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

  const handleComplete = (xp: number, coins: number, badges: string[]) => {
    setUserData((prev) => ({
      ...prev,
      xp: prev.xp + xp,
      coins: prev.coins + coins,
      completedLevels: [...prev.completedLevels, levelId],
      badges: [...prev.badges, ...badges],
    }))
    // 👇 si prefieres que se quede en el mapa de niveles en lugar de ir al inicio, cambia a "/dashboard"
    
  }

  const handleBack = () => {
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
      onComplete={handleComplete}
      onBack={handleBack}
      onLoseLife={handleLoseLife}
    />
  )
}
