// hooks/useSound.ts
import { useCallback } from "react"

export default function useSound(url: string, volume: number = 0.5) {
  const play = useCallback(() => {
    const audio = new Audio(url)
    audio.volume = volume
    audio.play().catch(() => {})
  }, [url, volume])

  return play
}