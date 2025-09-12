// lib/levels/roleplayLevel1.ts
export const roleplayLevel1 = {
  id: 1,
  title: "Primeros Encuentros",
  type: "roleplay" as const,
  duration: 8,
  xpReward: 50,
  coinReward: 20,
  background: "jungle-campfire-night-scene-animated.png",
  story:
    "Llegas a un campamento de capibaras exploradoras en medio de la selva. Es tu primer día y necesitas presentarte al grupo. Tu objetivo es causar una buena primera impresión.",
  hint:
    "Recuerda: una sonrisa genuina y mostrar interés por los demás son claves universales para conectar.",
  steps: [
    {
      situation: "¿Cómo saludarás a una capibara desconocida que se acerca a ti?",
      options: [
        { text: "Con una sonrisa cálida y contacto visual directo", correct: true, points: 20 },
        { text: "Con un saludo rápido sin mirar mucho", correct: false, points: 0 },
        { text: "Esperando a que ella hable primero", correct: false, points: 0 },
      ],
      feedback: {
        correct: "¡Excelente! El contacto visual y la sonrisa genuina transmiten confianza y apertura.",
        incorrect: "Una sonrisa cálida y contacto visual directo son fundamentales para una buena primera impresión.",
      },
    },
    {
      situation: "Durante la conversación, ¿mantienes contacto visual?",
      options: [
        { text: "Sí, de manera natural y respetuosa", correct: true, points: 20 },
        { text: "No, me da pena mirar a los ojos", correct: false, points: 0 },
        { text: "Solo cuando hablo yo", correct: false, points: 5 },
      ],
      feedback: {
        correct: "Perfecto. El contacto visual muestra interés genuino y construye confianza.",
        incorrect: "El contacto visual natural (no fijo) demuestra respeto e interés por la otra persona.",
      },
    },
    {
      situation: "El interlocutor responde de manera tímida. ¿Qué haces?",
      options: [
        { text: "Le doy espacio y hablo más suave", correct: true, points: 20 },
        { text: "Trato de animarlo hablando más fuerte", correct: false, points: 0 },
        { text: "Cambio de tema inmediatamente", correct: false, points: 0 },
      ],
      feedback: {
        correct: "¡Muy bien! Adaptar tu energía a la del otro muestra inteligencia emocional.",
        incorrect: "Cuando alguien es tímido, es mejor bajar la intensidad y darle espacio para abrirse.",
      },
    },
    {
      situation: "Una capibara te ofrece la mano para saludar. ¿Qué tipo de apretón usas?",
      options: [
        { text: "Firme pero no excesivo, con contacto visual", correct: true, points: 20 },
        { text: "Muy suave, casi sin fuerza", correct: false, points: 0 },
        { text: "Muy fuerte para mostrar seguridad", correct: false, points: 0 },
      ],
      feedback: {
        correct: "Excelente. Un apretón firme pero respetuoso transmite confianza sin intimidar.",
        incorrect: "Un apretón de manos debe ser firme pero no excesivo, acompañado de contacto visual.",
      },
    },
    {
      situation: "Te presentan al grupo. ¿Cómo te presentas?",
      options: [
        { text: "Digo mi nombre y algo que me gusta hacer", correct: true, points: 20 },
        { text: "Solo digo mi nombre", correct: false, points: 5 },
        { text: "Hago una broma para romper el hielo", correct: false, points: 0 },
      ],
      feedback: {
        correct: "¡Perfecto! Compartir un interés personal ayuda a otros a conectar contigo.",
        incorrect: "Agregar algo personal (un interés o pasión) ayuda a crear conexiones más profundas.",
      },
    },
  ],
}
