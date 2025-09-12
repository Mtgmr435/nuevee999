import confetti from "canvas-confetti"

export function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#FFD700", "#FF69B4", "#87CEFA", "#32CD32"]
  })
}
