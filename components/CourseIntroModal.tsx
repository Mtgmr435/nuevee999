"use client"

import { Button } from "@/components/ui/button"
import { courseIntros, defaultIntro } from "@/lib/courseIntros"

type Props = {
  courseId: string
  onClose: () => void
  onStart: () => void
}

export default function CourseIntroModal({ courseId, onClose, onStart }: Props) {
  const intro = courseIntros[courseId] ?? defaultIntro

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white/95 p-6 shadow-xl">
        <h2 className="text-xl font-bold text-amber-800">{intro.title}</h2>

        <p className="mt-3 leading-relaxed text-gray-700">{intro.description}</p>

        <ul className="mt-3 list-inside list-disc text-gray-700">
          {intro.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Volver
          </Button>
          <Button className="bg-amber-600 text-white hover:bg-amber-700" onClick={onStart}>
            Comenzar Aventura
          </Button>
        </div>
      </div>
    </div>
  )
}
