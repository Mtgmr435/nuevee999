"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Star, Coins } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CourseCard({ level }: { level: any }) {
  const [showIntro, setShowIntro] = useState(false)
  const router = useRouter()

  return (
    <>
      {/* --- Tarjeta clickeable --- */}
      <Card
        onClick={() => setShowIntro(true)}
        className="cursor-pointer bg-white/80 hover:bg-white shadow-md rounded-xl border border-amber-200 transition-transform hover:scale-[1.02]"
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-amber-800">{level.title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-700 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {level.duration || "8 min"}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" /> {level.xpReward} XP
              </span>
              <span className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-amber-500" /> {level.coinReward} monedas
              </span>
            </div>
          </div>
          <div>
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              {level.type}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* --- Intro Modal --- */}
      {showIntro && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 rounded-xl shadow-lg max-w-lg w-full p-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-amber-800">{level.intro.title}</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">{level.intro.scenario}</p>

            {/* Pista de mascota opcional */}
            {level.hint && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                💡 {level.hint}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowIntro(false)}>
                Volver
              </Button>
              <Button
                className="bg-amber-600 text-white hover:bg-amber-700"
                onClick={() => {
                  setShowIntro(false)
                  router.push(`/level/${level.id}`)
                }}
              >
                Comenzar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
