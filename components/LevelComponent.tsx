"use client"


import QuizLevel from "@/components/QuizLevel"
import RoleplayLevel from "@/components/RoleplayLevel"
import { Level, UserData } from "@/lib/userTypes"

interface LevelComponentProps {
  level: Level
  userData: UserData
  onComplete: (xp: number, coins: number, badges: string[]) => void
  onBack: () => void
  onLoseLife: () => void
}

/**
 * LevelComponent se encarga de cargar el tipo de nivel correcto
 * (quiz o roleplay) y pasarle las props necesarias.
 */


export default function LevelComponent({
  level,
  onComplete,
  onBack,
  userData,
  onLoseLife,
}: {
  level: Level
  onComplete: (xp: number, coins: number, badges: string[]) => void   // ✅ bien
  onBack: () => void
  userData: UserData
  onLoseLife: () => void
}) {

  if (level.type === "roleplay") {
    return (
      <RoleplayLevel
        levelId={level.id}
        world={level.world}
        userData={userData}
        onComplete={onComplete}
        onExit={onBack}
        onLoseLife={onLoseLife}
      />
    )
  }

  // Placeholder para otros tipos (story, video, interactive)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center p-8 bg-white/80 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">Nivel {level.id}</h1>
        <p className="text-muted-foreground mb-4">Tipo: {level.type}</p>
        <p className="text-sm text-muted-foreground">
          Este tipo de nivel estará disponible pronto 🚧
        </p>
        <button
          onClick={onBack}
          className="mt-6 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg shadow-md"
        >
          ← Volver
        </button>
      </div>
    </div>
  )
}
