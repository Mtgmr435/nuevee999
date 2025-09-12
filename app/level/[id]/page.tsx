"use client"
export const dynamic = "force-dynamic"
import { useRouter } from "next/navigation"
import LevelComponent from "@/components/LevelComponent"
import { Level, UserData } from "@/lib/userTypes"
import { useState } from "react"

// 🔹 Definición de niveles de ejemplo (puedes moverlo a un lib si quieres)
const communicationLevels: Level[] = [
  {
    id: 1,
    title: "Primeros Encuentros",
    type: "roleplay",
    duration: 8,
    xpReward: 50,
    coinReward: 20,
    isCompleted: false,
    isUnlocked: true,
    world: "selva",
  },
  {
    id: 2,
    title: "Escucha Activa",
    type: "quiz",
    duration: 6,
    xpReward: 40,
    coinReward: 15,
    isCompleted: false,
    isUnlocked: true,
    world: "montana",
  },
]

// 🔹 Datos iniciales del usuario (puedes reemplazar con Firestore si ya tienes auth)
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

interface LevelPageProps {
  params: {
    id: string
  }
}

export default function LevelPage({ params }: LevelPageProps) {
  const router = useRouter()
  const levelId = Number.parseInt(params.id)
  const level = communicationLevels.find((lvl) => lvl.id === levelId)

  const [userData, setUserData] = useState<UserData>(initialUserData)

  if (!level) {
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
      completedLevels: [...prev.completedLevels, level.id],
      badges: [...prev.badges, ...badges],
    }))
    router.push("/") // 👈 al completar, regresa al inicio (puedes cambiarlo a dashboard)
  }

  const handleBack = () => {
    router.push("/") // 👈 salir sin completar
  }

  const handleLoseLife = () => {
    setUserData((prev) => ({
      ...prev,
      lives: Math.max(0, prev.lives - 1),
    }))
  }

  return (
    <LevelComponent
  levelId={level.id}             // antes tenías level={level}
  userData={userData}
  onComplete={handleComplete}
  onBack={handleBack}
  onLoseLife={handleLoseLife}
/>
  )
}
