"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Volume2,
  Eye,
  Users,
  Presentation,
  Play,
  Lock,
  CheckCircle,
} from "lucide-react"

interface Level {
  id: number
  title: string
  type: "roleplay" | "quiz" | "story" | "video" | "interactive"
  duration: number
  xpReward: number
  coinReward: number
  isCompleted: boolean
  isUnlocked: boolean
}

interface CourseListProps {
  levels: Level[]
  userData: any
  onBack: () => void
  onStartLevel: (levelId: number) => void
}

export default function CourseList({ levels, userData, onBack, onStartLevel }: CourseListProps) {
  const getLevelIcon = (type: string) => {
    switch (type) {
      case "roleplay":
        return <MessageCircle className="w-6 h-6 text-blue-500" />
      case "interactive":
        return <Volume2 className="w-6 h-6 text-green-500" />
      case "video":
        return <Eye className="w-6 h-6 text-purple-500" />
      case "story":
        return <Users className="w-6 h-6 text-orange-500" />
      case "quiz":
        return <Presentation className="w-6 h-6 text-red-500" />
      default:
        return <Play className="w-6 h-6" />
    }
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/jungle-adventure-background.jpg')`, // cambia por el fondo que quieras
      }}
    >
      {/* Degradado encima del fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-yellow-900/30"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            ← Volver
          </Button>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">
            Comunicación Efectiva
          </h1>
          <div className="text-3xl animate-bounce">🦫</div>
        </div>

        {/* Grid de niveles */}
        <div className="grid gap-8">
          {levels.map((level) => {
            const isCompleted = userData.completedLevels.includes(level.id)

            return (
              <Card
                key={level.id}
                className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300
                ${level.isUnlocked ? "cursor-pointer hover:scale-[1.02]" : "opacity-50"}
                ${isCompleted ? "border-green-500 bg-green-50" : "border-amber-200 bg-white/90 backdrop-blur-md"}`}
              >
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: `url('/assets/worlds/selva.png')`, // 👈 aquí puedes cambiar por mundo específico
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>

                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {isCompleted ? (
                          <div className="relative">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                            <div className="absolute -top-1 -right-1 text-xl">✨</div>
                          </div>
                        ) : level.isUnlocked ? (
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            {level.id}
                          </div>
                        ) : (
                          <Lock className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getLevelIcon(level.type)}
                          <h3 className="text-lg font-bold text-amber-800">{level.title}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-amber-600">
                          <span>⏱️ {level.duration} min</span>
                          <span>⭐ {level.xpReward} XP</span>
                          <span>🪙 {level.coinReward} monedas</span>
                          <Badge variant="secondary" className="lowercase">
                            {level.type}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {level.isUnlocked && (
                      <Button
                        onClick={() => onStartLevel(level.id)}
                        disabled={!level.isUnlocked}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg"
                      >
                        {isCompleted ? "Repetir" : "Jugar"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}