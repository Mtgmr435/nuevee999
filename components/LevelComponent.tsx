"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Lightbulb } from "lucide-react"
import { launchConfetti } from "@/lib/confetti"
import { UserData, pets } from "@/lib/userTypes"
import useSound from "@/hooks/useSound"
import { roleplayLevel1 } from "@/lib/levels/roleplayLevel1"
import { quizLevel1 } from "../lib/levels/quizLevel1"

interface LevelComponentProps {
  levelId: number
  type: "roleplay" | "quiz" | "story" | "video" | "interactive"
  userData: UserData
  onBack: () => void
  onLoseLife: () => void
  onComplete: (xp: number, coins: number, badges: string[]) => void
}

export default function LevelComponent({
  levelId,
  type,
  userData,
  onBack,
  onLoseLife,
  onComplete,
}: LevelComponentProps) {
  // 🔹 sonidos globales
  const playClick = useSound("/sounds/click.mp3")
  const playSuccess = useSound("/sounds/success.mp3")
  const playSuccess2 = useSound("/sounds/success2.mp3")
  const playFail = useSound("/sounds/fail.mp3")

  // 🔹 estado global del nivel
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [hintUsed, setHintUsed] = useState(false)
  const [retryQueue, setRetryQueue] = useState<number[]>([])
  const [retryPos, setRetryPos] = useState(0)
  const [pass, setPass] = useState<"first" | "retry">("first")

  // 🔹 mascota activa
  const currentPet = pets.find((p) => p.id === userData.currentPet)

  // 🔹 obtener contenido del nivel (ejemplo con roleplayLevel1)
 const levelsMap: Record<number, any> = {
  1: roleplayLevel1,
  2: quizLevel1,
  // 👆 aquí vas metiendo más niveles a medida que los crees
}

// escoger nivel según levelId
const levelData = levelsMap[levelId]

if (!levelData) {
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold mb-2">Nivel en construcción</h2>
      <Button onClick={onBack}>← Volver</Button>
    </div>
  )
}

  // --- helpers ---
  const stepIndex = pass === "first" ? currentIndex : retryQueue[retryPos]
  const currentStep = levelData.steps[stepIndex]

  const pushWrongOnce = (idx: number) => {
    setRetryQueue((prev) => (prev.includes(idx) ? prev : [...prev, idx]))
  }

  const resetForNext = () => {
    setSelectedOption(null)
    setShowFeedback(false)
    setIsCorrect(null)
  }

  const handleOption = (i: number) => {
    setSelectedOption(i)
    const option = currentStep.options[i]

    if (type === "roleplay") {
      // retry inmediato
      if (option.correct) {
        playSuccess2()
        setScore((s) => s + option.points)
        setIsCorrect(true)
      } else {
        playFail()
        setIsCorrect(false)
        onLoseLife()
      }
      setShowFeedback(true)
      return
    }

    // quiz: agenda para retry
    if (option.correct) {
      playSuccess2()
      setScore((s) => s + option.points)
      setIsCorrect(true)
    } else {
      playFail()
      pushWrongOnce(stepIndex)
      setIsCorrect(false)
      onLoseLife()
    }
    setShowFeedback(true)
  }

  const completeLevel = () => {
    playSuccess()
    launchConfetti()
    const badges: string[] = []
    if (score >= 80) badges.push("Experto")
    if (!hintUsed) badges.push("Sin Pistas")
    onComplete(levelData.xpReward, levelData.coinReward, badges)
  }

  const handleNext = () => {
    if (type === "roleplay") {
      if (isCorrect) {
        if (currentIndex < levelData.steps.length - 1) {
          setCurrentIndex((i) => i + 1)
          resetForNext()
        } else {
          completeLevel()
        }
      } else {
        resetForNext()
      }
      return
    }

    // quiz
    if (pass === "first") {
      if (currentIndex < levelData.steps.length - 1) {
        setCurrentIndex((i) => i + 1)
        resetForNext()
      } else {
        if (retryQueue.length > 0) {
          setPass("retry")
          setRetryPos(0)
          resetForNext()
        } else {
          completeLevel()
        }
      }
    } else {
      if (isCorrect) {
        if (retryPos < retryQueue.length - 1) {
          setRetryPos((p) => p + 1)
          resetForNext()
        } else {
          completeLevel()
        }
      } else {
        resetForNext()
      }
    }
  }

  const showHint = () => {
    if (!hintUsed) setHintUsed(true)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          ← Volver
        </Button>
        <h1 className="text-2xl font-bold text-amber-800">{levelData.title}</h1>
        <div className="text-3xl animate-bounce">{currentPet?.icon}</div>
        <div className="flex items-center gap-2 ml-auto">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="font-bold text-red-600">
            {userData.lives}/{userData.maxLives}
          </span>
        </div>
      </div>

      {/* Card principal */}
      <Card className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/${levelData.background}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <CardContent className="p-8 relative z-10">
          {/* Progreso */}
          <div className="mb-4 flex justify-between text-sm text-amber-700">
            <span>Progreso</span>
            <span>
              {pass === "retry"
                ? "Corrigiendo errores"
                : `${stepIndex + 1} de ${levelData.steps.length}`}
            </span>
          </div>
          <Progress
            value={
              pass === "retry" && type === "quiz"
                ? 100
                : ((stepIndex + 1) / levelData.steps.length) * 100
            }
          />

          {/* Story al inicio */}
          {stepIndex === 0 && (
            <div className="my-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              {levelData.story}
            </div>
          )}

          {/* Pista de mascota */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{currentPet?.icon}</div>
              <p className="text-sm text-amber-600">
                {currentPet?.name} está aquí para ayudarte
              </p>
            </div>
            {!hintUsed && (
              <Button
                variant="outline"
                size="sm"
                onClick={showHint}
                className="border-amber-300 text-amber-700"
              >
                <Lightbulb className="w-4 h-4 mr-1" /> Pedir pista
              </Button>
            )}
          </div>
          {hintUsed && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">💡 {levelData.hint}</p>
            </div>
          )}

          {/* Situación */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-amber-800">Situación:</h3>
            <p className="bg-white/80 p-4 rounded-lg">{currentStep.situation}</p>
          </div>

          {/* Opciones o Feedback */}
          {!showFeedback ? (
            <div className="space-y-3">
              {currentStep.options.map((opt: any, i: number) => (
  <Button
    key={i}
    onClick={() => handleOption(i)}
    className="w-full text-left justify-start p-4 h-auto bg-amber-700 text-white"
    disableClickSound
  >
    {opt.text}
  </Button>
))}
            </div>
          ) : (
            <div className="mt-4">
              <div
                className={`p-4 rounded-lg border-2 ${
                  isCorrect
                    ? "bg-green-100 border-green-300"
                    : "bg-red-100 border-red-300"
                }`}
              >
                {isCorrect
                  ? currentStep.feedback.correct
                  : currentStep.feedback.incorrect}
              </div>
              <Button
                onClick={handleNext}
                className={`mt-4 ${
                  isCorrect ? "bg-green-500" : "bg-red-500"
                } text-white`}
              >
                {isCorrect
                  ? stepIndex < levelData.steps.length - 1
                    ? "Siguiente"
                    : "Completar nivel"
                  : "Reintentar"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
