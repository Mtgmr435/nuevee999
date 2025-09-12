export const quizLevel4 = {
  id: 4,
  title: "Manejo de Conflictos",
  type: "quiz" as const,
  duration: 12,
  xpReward: 80,
  coinReward: 30,
  background: "assets/worlds/mercado.png",
  story: "Una discusión entre capibaras amenaza la armonía del grupo.",
  hint: "Escuchar y mediar es mejor que imponer.",
  steps: [
    {
      situation: "Dos compañeros discuten, ¿qué haces?",
      options: [
        { text: "Ignoro el conflicto", correct: false, points: 0 },
        { text: "Escucho a ambas partes y busco puntos comunes", correct: true, points: 30 },
        { text: "Me pongo del lado de uno", correct: false, points: 0 },
      ],
      feedback: {
        correct: "Excelente, la mediación fomenta el respeto.",
        incorrect: "Tomar partido genera más conflicto.",
      },
    },
  ],
}
