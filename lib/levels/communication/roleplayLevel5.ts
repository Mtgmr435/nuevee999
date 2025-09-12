export const roleplayLevel5 = {
  id: 5,
  title: "Presentaciones Efectivas",
  type: "roleplay" as const,
  duration: 15,
  xpReward: 100,
  coinReward: 40,
  background: "assets/worlds/selva.png",
  story: "Debes presentar tu proyecto ante el consejo de capibaras ancianas.",
  hint: "Empieza fuerte y termina con un llamado a la acción.",
  steps: [
    {
      situation: "¿Cómo inicias tu presentación?",
      options: [
        { text: "Con una historia breve y relevante", correct: true, points: 30 },
        { text: "Disculpándote por estar nervioso", correct: false, points: 0 },
        { text: "Leyendo un texto sin mirar al público", correct: false, points: 0 },
      ],
      feedback: {
        correct: "¡Muy bien! Una historia engancha y conecta con la audiencia.",
        incorrect: "Lo mejor es captar la atención desde el inicio.",
      },
    },
  ],
}
