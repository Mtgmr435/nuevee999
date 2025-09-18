"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Lightbulb, Star } from "lucide-react"
import { levelsMap } from "@/lib/levels/index"
import { UserData, pets } from "@/lib/userTypes"
import useSound from "@/hooks/useSound"

interface LevelComponentProps {
  levelId: number
  userData: UserData
  onBack: () => void
  onLoseLife: () => void
  onComplete: (
    levelId: number,
    xp: number,
    coins: number,
    medal: string
  ) => void
}

export default function LevelComponent({
  levelId,
  userData,
  onBack,
  onLoseLife,
  onComplete,
}: LevelComponentProps) {
  const levelData = levelsMap[levelId]

  // --- sonidos ---
  const playClick = useSound("/sounds/click.mp3")
  const playSuccess = useSound("/sounds/success.mp3")
  const playFail = useSound("/sounds/fail.mp3")

  // --- estados ---
  const [closingMsg, setClosingMsg] = useState<string | null>(null)
  const [phase, setPhase] = useState<
    "intro" | "roleplay" | "quiz" | "end"
  >("intro")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [hintUsed, setHintUsed] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [finalMedal, setFinalMedal] = useState<string | null>(null)

  // --- mascota equipada ---
  const currentPet = pets.find((p) => p.id === userData.currentPet)

  // --- finalización con reglas exactas ---
  const completeLevel = () => {
    let medal: "diamante" | "oro" | "plata" | "bronce" = "bronce"
    if (score === 260) medal = "diamante" // perfecto
    else if (score >= 200) medal = "oro" // 259–200
    else if (score >= 100) medal = "plata" // 199–100
    else medal = "bronce" // 99–0

    setFinalMedal(medal)

    onComplete(levelId, levelData.xpReward, levelData.coinReward, medal)

    let closingMessage = null
    if (levelData.roleplay?.closing) {
      closingMessage =
        score >= 80
          ? levelData.roleplay.closing.success
          : levelData.roleplay.closing.fail
    }
    setPhase("end")
    setClosingMsg(closingMessage)
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/${levelData.background}')` }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* --- HEADER --- */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-amber-300 text-amber-800 bg-white/90 hover:bg-white"
          >
            ← Volver
          </Button>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">
            {levelData.title}
          </h1>
          {currentPet && (
            <div className="text-3xl animate-bounce">{currentPet.icon}</div>
          )}
          <div className="flex items-center gap-4 ml-auto">
            {/* vidas */}
            <div className="flex items-center gap-1">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-bold text-red-600">
                {userData.lives}/{userData.maxLives}
              </span>
            </div>
            {/* puntaje */}
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-yellow-300">
                {score} pts
              </span>
            </div>
          </div>
        </div>

        {/* --- INTRO --- */}
        {phase === "intro" && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 rounded-xl shadow-lg max-w-2xl w-full p-8 animate-fadeIn">
              <h2 className="text-2xl font-bold text-amber-800">
                {levelData.intro.title}
              </h2>
              <p className="mt-3 text-gray-800 leading-relaxed">
                {levelData.intro.scenario}
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={onBack}>
                  Volver
                </Button>
                <Button
                  className="bg-amber-600 text-white hover:bg-amber-700"
                  onClick={() => {
                    playClick()
                    setPhase("roleplay")
                  }}
                >
                  Comenzar misión
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* --- PISTA DE MASCOTA SOLO EN ROLEPLAY --- */}
        {phase === "roleplay" && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentPet && (
                <div className="text-3xl">{currentPet.icon}</div>
              )}
              <p className="text-sm text-white">
                {currentPet?.name} tiene una pista para ti
              </p>
            </div>
            {!hintUsed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHintUsed(true)}
                className="border-amber/40 text-amber-800 hover:bg-white/10"
              >
                <Lightbulb className="w-4 h-4 mr-1" /> Pedir pista
              </Button>
            )}
          </div>
        )}
        {hintUsed && phase === "roleplay" && currentPet && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-white/80 border border-blue-300 rounded-lg shadow-md">
            <div className="text-3xl">{currentPet.icon}</div>
            <div>
              <p className="font-bold text-amber-800">
                {currentPet.name} te ayuda:
              </p>
              <p className="text-blue-800 text-sm">💡 {levelData.hint}</p>
            </div>
          </div>
        )}

        {/* --- ROLEPLAY --- */}
        {phase === "roleplay" && (
          <Card className="bg-white/20 backdrop-blur-md border border-amber-200 shadow-lg rounded-2xl">
            <CardContent className="p-8">
              <h3 className="font-semibold mb-2 text-white">Situación:</h3>
              <p className="bg-white/70 p-4 rounded-lg">
                {levelData.roleplay.steps[currentIndex].situation}
              </p>

              <div className="space-y-3 mt-4">
                {levelData.roleplay.steps[currentIndex].options.map(
                  (opt: any, i: number) => (
                    <Button
                      key={i}
                      onClick={() => {
                        setScore((s) => s + opt.points)
                        if (opt.points >= 90 || opt.correct) {
                          playSuccess()
                        } else {
                          playFail()
                        }

                        if (
                          currentIndex <
                          levelData.roleplay.steps.length - 1
                        ) {
                          setCurrentIndex((i) => i + 1)
                        } else {
                          setPhase("quiz")
                          setCurrentIndex(0)
                        }
                      }}
                      className="w-full text-left justify-start p-4 h-auto bg-amber-700 text-white"
                    >
                      {opt.text}
                    </Button>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* --- QUIZ --- */}
        {phase === "quiz" && (
          <Card className="bg-white/20 backdrop-blur-md border border-amber-200 shadow-lg rounded-2xl">
            <CardContent className="p-8">
              <h3 className="font-semibold mb-2 text-white">Pregunta:</h3>
              <p className="bg-white/70 p-4 rounded-lg">
                {levelData.quiz.questions[currentIndex].question}
              </p>

              {!showFeedback ? (
                <div className="space-y-3 mt-4">
                  {levelData.quiz.questions[currentIndex].options.map(
                    (opt: any, i: number) => (
                      <Button
                        key={i}
                        onClick={() => {
                          setIsCorrect(opt.correct)
                          setShowFeedback(true)
                          if (opt.correct) {
                            playSuccess()
                            setScore((s) => s + 20)
                          } else {
                            playFail()
                            onLoseLife()
                          }
                        }}
                        className="w-full text-left justify-start p-4 h-auto bg-amber-700 text-white"
                      >
                        {opt.text}
                      </Button>
                    )
                  )}
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
                      ? levelData.quiz.questions[currentIndex].feedback
                          .correct
                      : levelData.quiz.questions[currentIndex].feedback
                          .incorrect}
                  </div>
                  <Button
                    onClick={() => {
                      if (
                        currentIndex <
                        levelData.quiz.questions.length - 1
                      ) {
                        setCurrentIndex((i) => i + 1)
                        setShowFeedback(false)
                      } else {
                        completeLevel()
                      }
                    }}
                    className={`mt-4 ${
                      isCorrect ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {currentIndex <
                    levelData.quiz.questions.length - 1
                      ? "Siguiente"
                      : "Completar nivel"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

       {/* --- FIN DEL NIVEL --- */}
{phase === "end" && (
  <Card className="bg-white/90 border border-amber-200 p-8 text-center shadow-2xl animate-fadeIn">
    <CardContent>
      <h2 className="text-3xl font-bold text-amber-800 mb-4">
        ¡Misión completada!
      </h2>

      <p className="text-amber-700 mb-4 text-lg">
        Tu puntaje final fue <span className="font-bold">{score}</span> puntos.
      </p>

      {closingMsg && (
        <p className="mb-6 text-amber-900 font-medium">{closingMsg}</p>
      )}

      {/* Mostrar medalla final calculada */}
      {finalMedal && (
        <div className="mb-6">
          {finalMedal === "diamante" && (
            <p className="text-cyan-600 text-xl font-bold">
              💎 Medalla Diamante
            </p>
          )}
          {finalMedal === "oro" && (
            <p className="text-yellow-600 text-xl font-bold">
              🥇 Medalla Oro
            </p>
          )}
          {finalMedal === "plata" && (
            <p className="text-gray-600 text-xl font-bold">
              🥈 Medalla Plata
            </p>
          )}
          {finalMedal === "bronce" && (
            <p className="text-orange-700 text-xl font-bold">
              🥉 Medalla Bronce
            </p>
          )}
        </div>
      )}

      <Button
        onClick={onBack}
        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 text-lg rounded-xl shadow-lg"
      >
        Volver al mapa
      </Button>
    </CardContent>
  </Card>
)}

        
      </div>
    </div>
  )
}
