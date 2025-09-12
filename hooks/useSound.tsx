// hooks/useSound.tsx
"use client"
import { useCallback } from "react"

export default function useSound(path: string, volume: number = 0.6) {
  const play = useCallback(() => {
    const audio = new Audio(path)
    audio.volume = volume
    audio.play().catch(() => {})
  }, [path, volume])

  return play
}
