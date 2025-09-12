"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, ArrowLeft, Brain, Target, Heart } from "lucide-react"
import { levelBackgrounds } from "@/lib/levelBackgrounds"
import { UserData } from "@/lib/userTypes"
import { launchConfetti } from "@/lib/confetti"
import useSound from "@/hooks/useSound"

// 🔹 Tipos
interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  points: number
  category: string
}

interface QuizLevelProps {
  levelId: number
  world: "selva" | "montana" | "rio" | "mercado" | "ciudad"
  xpReward: number
  coinReward: number
  userData: UserData
  onComplete: (xp: number, coins: number, badges: string[]) => void

  onBack: () => void
  onLoseLife: () => void
}

// 🔹 Preguntas de ejemplo
const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "¿Cuál es el principio más importante para establecer rapport en una primera conversación?",
    options: [
      "Hablar sobre tus logros profesionales",
      "Encontrar puntos en común y mostrar interés genuino",
      "Hacer preguntas directas sobre el trabajo",
      "Mantener una postura dominante",
    ],
    correctAnswer: 1,
    explanation: "El rapport se construye encontrando conexiones genuinas y mostrando interés real en la otra persona.",
    points: 20,
    category: "Construcción de Rapport",
  },
  {
    id: 2,
    question: "Cuando alguien comparte un problema contigo, ¿cuál es la mejor respuesta inicial?",
    options: [
      "Ofrecer una solución inmediata",
      "Cambiar de tema para aliviar la tensión",
      "Validar sus sentimientos y hacer preguntas para entender mejor",
      "Contar una experiencia similar tuya",
    ],
    correctAnswer: 2,
    explanation: "La escucha activa requiere primero validar los sentimientos de la persona y buscar entender completamente.",
    points: 25,
    category: "Escucha Activa",
  },
]

// 🔹 Insignias de ejemplo
const badgeRules = [
  { name: "Perfeccionista", condition: (correct: number, total: number) => correct === total },
  { name: "Experto en Comunicación", condition: (_: number, __: number, score: number) => score >= 40 },
]

export default function QuizLevel({
  levelId,
  world,
  xpReward,
  coinReward,
  userData,
  onComplete,
  onBack,
  onLoseLife,
}: QuizLevelProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongQueue, setWrongQueue] = useState<number[]>([])
  const [mode, setMode] = useState<"first" | "review">("first")
  const [reviewPos, setReviewPos] = useState(0)

  const backgroundImage = levelBackgrounds[world] || levelBackgrounds["selva"]

  // 🎵 sonidos
  const playClick = useSound("/sounds/click.mp3")
  const playSuccess = useSound("/sounds/success.mp3")
  const playSuccess2 = useSound("/sounds/success2.mp3")
  const playFail = useSound("/sounds/fail.mp3")

  const getIndex = () => (mode === "first" ? currentQuestion : wrongQueue[reviewPos])
  const question = quizQuestions[getIndex()]

  const handleAnswerSelect = (answerIndex: number) => {
    playClick()
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return
    const isCorrect = selectedAnswer === question.correctAnswer

    if (isCorrect) {
      playSuccess2()
      setScore((s) => s + question.points)
      setCorrectAnswers((c) => c + 1)
    } else {
      playFail()
      onLoseLife()
      if (mode === "first") {
        setWrongQueue((prev) => (prev.includes(getIndex()) ? prev : [...prev, getIndex()]))
      }
    }

    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswer(null)

      if (mode === "first") {
        if (currentQuestion < quizQuestions.length - 1) {
          setCurrentQuestion((q) => q + 1)
        } else if (wrongQueue.length > 0 || !isCorrect) {
          setMode("review")
          setReviewPos(0)
          if (!isCorrect) setWrongQueue((prev) => [...prev, getIndex()])
        } else {
          finishQuiz()
        }
      } else {
        if (isCorrect) {
          if (reviewPos < wrongQueue.length - 1) {
            setReviewPos((p) => p + 1)
          } else {
            finishQuiz()
          }
        }
      }
    }, 1500)
  }

  const finishQuiz = () => {
    playSuccess()
    launchConfetti()

    const badges: string[] = []
    badgeRules.forEach((rule) => {
      if (rule.condition(correctAnswers, quizQuestions.length, score)) {
        badges.push(rule.name)
      }
    })

    onComplete(xpReward, coinReward, badges)
  }

  const progressValue =
    mode === "first"
      ? ((currentQuestion + 1) / quizQuestions.length) * 100
      : ((reviewPos + 1) / wrongQueue.length) * 100

  // 🎨 Vista feedback
  if (showFeedback) {
    const isCorrect = selectedAnswer === question.correctAnswer
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 w-full max-w-2xl p-4">
          <Card className="w-full animate-bounce-in">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">{isCorrect ? "✅" : "❌"}</div>
              <h3 className="text-2xl font-bold mb-4">{isCorrect ? "¡Correcto!" : "Incorrecto"}</h3>

              {isCorrect && (
                <div className="bg-green-100 rounded-lg p-4 mb-4">
                  <p className="text-lg font-semibold text-green-700 mb-2">+{question.points} puntos</p>
                  <Badge className="bg-green-500">{question.category}</Badge>
                </div>
              )}

              {!isCorrect && (
                <div className="bg-red-100 rounded-lg p-4 mb-4">
                  <p className="text-red-700 font-medium">(-1 vida)</p>
                  <p className="text-sm text-red-600 mt-1">Respuesta correcta: {question.options[question.correctAnswer]}</p>
                </div>
              )}

              <div className="text-sm text-gray-700">{question.explanation}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // 🎨 Vista normal
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 max-w-4xl mx-auto py-8 space-y-6">
        {/* Header */}
        <Card className="bg-white/90">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Salir
              </Button>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  <span className="font-bold">Quiz</span>
                </div>
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
            <Progress value={progressValue} />
            <p className="text-sm text-gray-600 mt-2">
              {mode === "first"
                ? `Pregunta ${currentQuestion + 1} de ${quizQuestions.length}`
                : `Corrigiendo errores (${reviewPos + 1}/${wrongQueue.length})`}
            </p>
          </CardHeader>
        </Card>

        {/* Pregunta */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-primary" />
              <Badge variant="outline">{question.category}</Badge>
              <Badge variant="secondary">{question.points} pts</Badge>
            </div>
            <CardTitle className="text-xl leading-relaxed">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3 mb-8">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`w-full p-4 h-auto text-left justify-start ${
                    selectedAnswer === index
                      ? "bg-indigo-500 text-white"
                      : "hover:bg-indigo-50 border-indigo-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                        selectedAnswer === index
                          ? "border-white text-white"
                          : "border-indigo-500 text-indigo-600"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </Button>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                {mode === "first" && currentQuestion === quizQuestions.length - 1
                  ? "Finalizar"
                  : mode === "review" && reviewPos === wrongQueue.length - 1
                  ? "Completar Quiz"
                  : "Siguiente"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
