import { Level } from "@/lib/userTypes"

/**
 * 🔹 Aquí organizamos los cursos por categoría
 * Cada curso tiene sus niveles (quiz / roleplay por ahora).
 * En el futuro puedes meter más tipos: "interactive", "video", etc.
 */
export const courses: Record<string, Level[]> = {
  communication: [
    {
      id: 1,
      title: "Primeros Encuentros",
      type: "roleplay",
      duration: 8,
      xpReward: 50,
      coinReward: 20,
      isCompleted: false,
      isUnlocked: true,
      world: "selva",
    },
    {
      id: 2,
      title: "Escucha Activa",
      type: "quiz",
      duration: 6,
      xpReward: 40,
      coinReward: 15,
      isCompleted: false,
      isUnlocked: true,
      world: "montana",
    },
    {
      id: 3,
      title: "Comunicación No Verbal",
      type: "quiz",
      duration: 7,
      xpReward: 45,
      coinReward: 18,
      isCompleted: false,
      isUnlocked: false,
      world: "rio",
    },
    {
      id: 4,
      title: "Resolviendo Malentendidos",
      type: "roleplay",
      duration: 9,
      xpReward: 60,
      coinReward: 25,
      isCompleted: false,
      isUnlocked: false,
      world: "mercado",
    },
  ],

  leadership: [
    {
      id: 1,
      title: "Liderazgo Positivo",
      type: "quiz",
      duration: 6,
      xpReward: 40,
      coinReward: 15,
      isCompleted: false,
      isUnlocked: true,
      world: "mercado",
    },
    {
      id: 2,
      title: "Tomando Decisiones Difíciles",
      type: "roleplay",
      duration: 10,
      xpReward: 70,
      coinReward: 30,
      isCompleted: false,
      isUnlocked: false,
      world: "rio",
    },
  ],

  creativity: [
    {
      id: 1,
      title: "Pensamiento Lateral",
      type: "quiz",
      duration: 7,
      xpReward: 45,
      coinReward: 20,
      isCompleted: false,
      isUnlocked: true,
      world: "mercado",
    },
    {
      id: 2,
      title: "Improvisación en Equipo",
      type: "roleplay",
      duration: 8,
      xpReward: 55,
      coinReward: 22,
      isCompleted: false,
      isUnlocked: false,
      world: "selva",
    },
  ],
}

/**
 * 🔹 Helper para obtener todos los niveles de todos los cursos
 * (por si quieres listarlos en una sola vista de roadmap)
 */
export const allLevels: Level[] = Object.values(courses).flat()
