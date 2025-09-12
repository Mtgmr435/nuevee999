// lib/levels/quizLevel1.ts
export const quizLevel1 = {
  id: 2,
  title: "Presentaciones Efectivas",
  type: "quiz" as const,
  duration: 10,
  xpReward: 60,
  coinReward: 25,
  background: "assets/worlds/montana.png",
  story:
    "Debes presentar tu proyecto ante el consejo de capibaras. ¿Cómo logras captar su atención?",
  hint: "Las buenas presentaciones inician con algo que conecte emocionalmente.",
  steps: [
    {
      situation: "¿Cuál es la mejor manera de iniciar tu presentación?",
      options: [
        { text: "Con una historia breve relacionada al tema", correct: true, points: 20 },
        { text: "Con estadísticas y datos duros", correct: false, points: 5 },
        { text: "Disculpándome por posibles errores", correct: false, points: 0 },
      ],
      feedback: {
        correct: "¡Excelente! Las historias capturan atención y crean conexión emocional inmediata.",
        incorrect: "Las historias conectan emocionalmente desde el inicio y hacen tu mensaje memorable.",
      },
    },
    {
      situation: "Notas que el público se distrae. ¿Qué haces?",
      options: [
        { text: "Hago una pregunta directa o cambio el ritmo", correct: true, points: 20 },
        { text: "Continúo como si nada pasara", correct: false, points: 0 },
        { text: "Hablo más fuerte para captar atención", correct: false, points: 0 },
      ],
      feedback: {
        correct: "¡Muy bien! Involucrar al público recupera su atención.",
        incorrect: "Cuando pierdes atención, involucra al público con preguntas o cambios de ritmo.",
      },
    },
  ],
}
