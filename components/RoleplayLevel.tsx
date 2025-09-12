"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, ArrowLeft, Heart } from "lucide-react"
import { levelBackgrounds } from "@/lib/levelBackgrounds"
import { UserData } from "@/lib/userTypes"
import { launchConfetti } from "@/lib/confetti"
import useSound from "@/hooks/useSound"

// 🔹 Tipos de datos
interface Choice {
  text: string
  points: number
  principle: string
  nextScene: number
  feedback: string
}

interface Scene {
  id: number
  title: string
  description: string
  capibaraExpression: string
  situation: string
  choices: Choice[]
}

interface RoleplayLevelProps {
  levelId: number
  world: "selva" | "montana" | "rio" | "mercado" | "ciudad"
  userData: UserData
  onComplete: (xp: number, coins: number, badges: string[]) => void
  onExit: () => void
  onLoseLife: () => void
}

// 🔹 Escenas de ejemplo
const communicationScenes: Scene[] = [
  {
    id: 1,
    title: "🌿 Primer Encuentro",
    description: "Llegas a un campamento de capibaras exploradoras...",
    capibaraExpression: "🙂",
    situation: "Situación: Es tu primer día y necesitas presentarte al grupo.",
    choices: [
      {
        text: "Con una sonrisa cálida y contacto visual directo",
        points: 20,
        principle: "Empatía",
        nextScene: 2,
        feedback: "¡Excelente! Mostraste apertura y calidez.",
      },
      {
        text: "Con un saludo rápido sin mirar mucho",
        points: 5,
        principle: "Pasividad",
        nextScene: 2,
        feedback: "Podría ser mejor, faltó conexión.",
      },
      {
        text: "Esperando a que ella hable primero",
        points: 0,
        principle: "Inseguridad",
        nextScene: 2,
        feedback: "Oportunidad perdida, deberías tomar la iniciativa.",
      },
    ],
  },
  {
    id: 2,
    title: "🎯 Fin del nivel",
    description: "Has terminado este roleplay de prueba.",
    capibaraExpression: "🤗",
    situation: "¡Felicidades! Completaste el nivel.",
    choices: [],
  },
]

// 🔹 Insignias
const badges = [
  { name: "Empático", threshold: 15 },
  { name: "Comunicador", threshold: 25 },
]

export default function RoleplayLevel({
  levelId,
  world,
  userData,
  onComplete,
  onExit,
  onLoseLife,
}: RoleplayLevelProps) {
  const [currentScene, setCurrentScene] = useState(1)
  const [score, setScore] = useState(0)
  const [earnedBadges, setEarnedBadges] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastChoice, setLastChoice] = useState<Choice | null>(null)

  const scene = communicationScenes.find((s) => s.id === currentScene)
  const backgroundImage = levelBackgrounds[world] || levelBackgrounds["selva"]

  // 🎵 sonidos
  const playClick = useSound("/sounds/click.mp3")
  const playSuccess = useSound("/sounds/success.mp3") // al completar nivel
  const playSuccess2 = useSound("/sounds/success2.mp3") // al responder bien
  const playFail = useSound("/sounds/fail.mp3")

  const makeChoice = (choiceIndex: number) => {
    if (!scene) return
    const choice = scene.choices[choiceIndex]
    setLastChoice(choice)
    setShowFeedback(true)

    if (choice.points > 0) {
      setScore((prev) => prev + choice.points)
      playSuccess2()
    } else {
      playFail()
      onLoseLife()
    }

    // badges dinámicos
    const newBadges = badges
      .filter((b) => score + choice.points >= b.threshold && !earnedBadges.includes(b.name))
      .map((b) => b.name)

    if (newBadges.length > 0) {
      setEarnedBadges([...earnedBadges, ...newBadges])
    }

    setTimeout(() => {
      setShowFeedback(false)
      if (choice.nextScene === 2) {
        playSuccess()
        launchConfetti()
        onComplete(score + choice.points, 0, [...earnedBadges, ...newBadges]) 
      } else {
        setCurrentScene(choice.nextScene)
      }
    }, 2000)
  }

  if (!scene) return null

  // 🎨 Vista feedback
  if (showFeedback && lastChoice) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <Card className="max-w-lg w-full relative z-10 animate-bounce-in">
          <CardContent className="p-6 text-center">
            <div className="text-5xl mb-4">{lastChoice.points > 0 ? "✅" : "❌"}</div>
            <h3 className="text-xl font-bold mb-2">
              {lastChoice.points > 0 ? "¡Correcto!" : "Incorrecto"}
            </h3>
            <p className="mb-2">+{lastChoice.points} puntos</p>
            <Badge>{lastChoice.principle}</Badge>
            <p className="text-sm mt-2">{lastChoice.feedback}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 🎨 Vista normal
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 max-w-4xl mx-auto py-8 space-y-6">
        {/* Header */}
        <Card className="bg-white/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={onExit}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Salir
              </Button>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold">{score} pts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-red-600">
                    {userData.lives}/{userData.maxLives}
                  </span>
                </div>
              </div>
            </div>
            <Progress value={(currentScene / communicationScenes.length) * 100} />
          </CardHeader>
        </Card>

        {/* Escena */}
        <Card>
          <CardHeader>
            <CardTitle>{scene.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{scene.description}</p>
            <div className="text-6xl mb-4">{scene.capibaraExpression}</div>
            <p className="italic mb-6">{scene.situation}</p>

            {/* Opciones */}
            {scene.choices.map((choice, index) => (
              <Button
                key={index}
                onClick={() => {
                  playClick()
                  makeChoice(index)
                }}
                className="w-full mb-3"
              >
                {choice.text}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
