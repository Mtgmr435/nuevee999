// lib/courseIntros.ts
export type CourseIntro = {
  title: string
  description: string
  bullets: string[]
}

// 🔹 Intros por ID de curso (puedes agregar más sin tocar componentes)
export const courseIntros: Record<string, CourseIntro> = {
  "communication-v1": {
    title: "🌟 Entrenamiento: La Aventura de la Empatía",
    description:
      "Bienvenido/a, héroe. Tu reto es superar 5 misiones y desbloquear el superpoder de la empatía 🦸‍♀️🦸‍♂️.",
    bullets: [
      "Historia (qué está pasando)",
      "Roleplay (cómo entrenar)",
      "Pista secreta 🕵️ (ayuda para ganar)",
      "Quiz-Reto (para avanzar de nivel)",
    ],
  },

  // Ejemplo de otro curso (Liderazgo). Si no lo usas aún, déjalo.
  "leadership-v1": {
    title: "🔥 Entrenamiento: El Camino del Líder",
    description:
      "Bienvenido/a, capitán. Aprende a inspirar y guiar a tu equipo con visión y ejemplo.",
    bullets: [
      "Historias de liderazgo",
      "Roleplays para decidir bajo presión",
      "Pistas de tu mentor 🕵️",
      "Quiz-Retos para consolidar hábitos",
    ],
  },
}

// 🔹 Fallback si el curso no tiene intro definida
export const defaultIntro: CourseIntro = {
  title: "🌟 Entrenamiento",
  description:
    "Bienvenido/a. Completa las misiones para desbloquear nuevas habilidades.",
  bullets: [
    "Historia (contexto)",
    "Roleplay (práctica guiada)",
    "Pista secreta 🕵️ (ayuda)",
    "Quiz-Reto (para avanzar de nivel)",
  ],
}
