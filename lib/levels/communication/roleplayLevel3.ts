export const roleplayLevel3 = {
  id: 3,
  title: "Comunicación No Verbal",
  type: "roleplay" as const,
  duration: 7,
  xpReward: 45,
  coinReward: 18,
  background: "assets/worlds/rio.png",
  story: "El lenguaje corporal dice más que las palabras.",
  hint: "Mantén contacto visual y usa gestos abiertos.",
  steps: [
    {
      situation: "Estás en una reunión, ¿cómo te sientas?",
      options: [
        { text: "Con los brazos cruzados", correct: false, points: 0 },
        { text: "Relajado, con postura abierta", correct: true, points: 20 },
        { text: "Mirando el celular", correct: false, points: 0 },
      ],
      feedback: {
        correct: "¡Bien! Una postura abierta genera confianza.",
        incorrect: "El lenguaje corporal cerrado transmite desinterés.",
      },
    },
  ],
}
